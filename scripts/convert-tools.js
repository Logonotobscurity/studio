import { existsSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { atomicWrite } from './utils/atomicWrite.js';

const LOCKFILE = './data/.convert.lock';

function lock() {
  if (existsSync(LOCKFILE)) {
    console.error('Conversion locked. Another process is running.');
    process.exit(1);
  }
  writeFileSync(LOCKFILE, process.pid.toString());
}

function unlock() {
  if (existsSync(LOCKFILE)) {
    unlinkSync(LOCKFILE);
  }
}

function inferSchema(lines) {
  const firstFive = lines.slice(0, 5).map(l => l.trim());
  if (firstFive.every(l => l.startsWith('https://'))) {
    return 'UrlTool';
  }
  if (firstFive.every(l => l.startsWith('{'))) {
    return 'JsonLineTool';
  }
  if (lines.some(l => l.startsWith('###'))) {
    return 'CategoryTool';
  }
  return 'unknown';
}

function parseTxt(content, schema, sourceFile) {
  const lines = content.split('\n').filter(l => l.trim() !== '');
  const now = new Date().toISOString();
  const baseMeta = { _schema: schema, _sourceFile: sourceFile, _convertedAt: now };

  if (lines.length < 150) {
      throw new Error(`File ${sourceFile} has fewer than 150 lines, skipping.`);
  }

  switch (schema) {
    case 'UrlTool':
      return lines.map((line, i) => ({
        ...baseMeta,
        id: `u-${String(i).padStart(3, '0')}`,
        url: line.trim(),
        description: '',
        tags: ['url'],
      }));
    case 'JsonLineTool':
      return lines.map(line => ({ ...JSON.parse(line), ...baseMeta }));
    case 'CategoryTool':
        const result = [];
        let currentCategory = null;
        lines.forEach(line => {
            if (line.startsWith('### ')) {
                if (currentCategory) {
                    result.push(currentCategory);
                }
                currentCategory = { category: line.substring(4).trim(), tools: [], ...baseMeta };
            } else if (currentCategory && line.trim().length > 0) {
                const match = line.match(/- \[(.*?)\]\((.*?)\) - (.*)/);
                if (match) {
                    currentCategory.tools.push({
                        name: match[1],
                        url: match[2],
                        description: match[3],
                    });
                }
            }
        });
        if (currentCategory) {
            result.push(currentCategory);
        }
        return result;
    default:
      throw new Error(`Unknown schema for ${sourceFile}`);
  }
}

async function generateTypes(schemas) {
    const uniqueSchemas = [...new Set(schemas)];
    let content = `// Auto-generated, never hand-edited
export interface BaseMeta {
  _schema: string;
  _sourceFile: string;
  _convertedAt: string;
}

`;
    if (uniqueSchemas.includes('UrlTool')) {
        content += `export interface UrlTool extends BaseMeta {
  id: string;
  url: string;
  description?: string;
  tags: string[];
}
`;
    }
    if (uniqueSchemas.includes('JsonLineTool')) {
        content += `export interface JsonLineTool extends BaseMeta {
  [key: string]: unknown;
}
`;
    }
    if (uniqueSchemas.includes('CategoryTool')) {
        content += `export interface CategoryTool extends BaseMeta {
  category: string;
  tools: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}
`;
    }
    const outPath = path.join(process.cwd(), 'src', 'lib', 'tool-schemas.ts');
    atomicWrite(outPath, content.replace(/\\/g, '/'), false);
    console.log(`✅ Generated TypeScript interfaces in ${outPath}`);
}


async function main() {
  lock();
  try {
    const files = await glob('data/**/*.TXT', { case: 'i' });
    const report = {
      timestamp: new Date().toISOString(),
      files: {},
    };
    const schemas = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      const schema = inferSchema(lines);
      
      if (schema === 'unknown') {
        console.warn(`⚠️ Could not determine schema for ${file}, skipping.`);
        continue;
      }
      schemas.push(schema);

      const jsonData = parseTxt(content, schema, file);
      const outPath = path.join(process.cwd(), 'src', 'data', `${path.basename(file, path.extname(file))}.json`);
      
      const { sha256 } = atomicWrite(outPath, jsonData);

      report.files[file] = {
        schema,
        count: jsonData.length,
        sha256,
      };
      console.log(`✅ Converted ${file} to ${outPath}`);
    }

    await generateTypes(schemas);

    const reportPath = path.join(process.cwd(), 'scripts', 'convert-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`✅ Wrote conversion report to ${reportPath}`);

  } catch (error) {
    console.error('❌ Conversion process failed:', error);
    process.exit(1);
  } finally {
    unlock();
  }
}

main();
