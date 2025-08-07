import { existsSync, writeFileSync, unlinkSync, readFileSync, mkdirSync } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { atomicWrite } from './utils/atomicWrite.js';

const LOCKFILE = './data/.convert.lock';
const DATA_DIR = './data';

function lock() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
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
  if (firstFive.every(l => l.startsWith('https://') || l.startsWith('http://'))) {
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

function toTitleCase(str) {
    return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function parseTxt(content, schema, sourceFile) {
  const lines = content.split('\n').filter(l => l.trim() !== '');
  const now = new Date().toISOString();
  const baseName = path.basename(sourceFile, path.extname(sourceFile));
  const categoryName = toTitleCase(baseName);
  const baseMeta = { _schema: schema, _sourceFile: sourceFile, _convertedAt: now };

  if (lines.length < 150) {
      throw new Error(`File ${sourceFile} has fewer than 150 lines, skipping.`);
  }

  switch (schema) {
    case 'UrlTool':
      return lines.map((line, i) => ({
        ...baseMeta,
        id: `u-${baseName}-${String(i).padStart(3, '0')}`,
        name: new URL(line.trim()).hostname.replace('www.',''),
        url: line.trim(),
        description: `A tool for ${categoryName}.`,
        tags: ['url'],
        category: categoryName
      }));
    case 'JsonLineTool':
      return lines.map(line => ({ ...JSON.parse(line), ...baseMeta, category: categoryName }));
    case 'CategoryTool':
        const result = [];
        let currentCategory = null;
        lines.forEach(line => {
            if (line.startsWith('### ')) {
                currentCategory = line.substring(4).trim();
            } else if (currentCategory && line.trim().length > 0) {
                const match = line.match(/- \[(.*?)\]\((.*?)\) - (.*)/);
                if (match) {
                    result.push({
                        name: match[1],
                        url: match[2],
                        description: match[3],
                        category: currentCategory,
                        ...baseMeta
                    });
                }
            }
        });
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
  category: string;
}
`;
    }
    if (uniqueSchemas.includes('JsonLineTool')) {
        content += `export interface JsonLineTool extends BaseMeta {
  [key: string]: unknown;
  category: string;
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
    
    const outDir = path.join(process.cwd(), 'src', 'lib');
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, 'tool-schemas.ts');
    
    // Use atomicWrite but tell it the content is not JSON
    atomicWrite(outPath, content, false); 
    console.log(`✅ Generated TypeScript interfaces in ${outPath}`);
}


async function main() {
  lock();
  try {
    const dataOutDir = path.join(process.cwd(), 'src', 'data');
    if (!existsSync(dataOutDir)) {
      mkdirSync(dataOutDir, { recursive: true });
    }
      
    const files = await glob('data/**/*.TXT', { case: 'i' });
    const report = {
      timestamp: new Date().toISOString(),
      files: {},
    };
    const schemas = [];

    if (files.length === 0) {
        console.log('No .TXT files found in data directory. Skipping conversion.');
        await generateTypes([]);
        return;
    }

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
      const outPath = path.join(dataOutDir, `${path.basename(file, path.extname(file))}.json`);
      
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
