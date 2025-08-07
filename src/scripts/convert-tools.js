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
  // Default to CategoryTool for markdown-like lists that don't fit other schemas
  if (lines.some(l => l.startsWith('- ['))) {
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
  const defaultCategoryName = toTitleCase(baseName);
  const baseMeta = { _schema: schema, _sourceFile: sourceFile, _convertedAt: now };

  if (lines.length < 150) {
      console.warn(`⚠️ File ${sourceFile} has fewer than 150 lines, it might be incomplete.`);
  }

  const allTools = [];

  switch (schema) {
    case 'UrlTool':
      lines.forEach((line, i) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          allTools.push({
            ...baseMeta,
            id: `u-${baseName}-${String(i).padStart(3, '0')}`,
            name: new URL(trimmedLine).hostname.replace('www.',''),
            url: trimmedLine,
            description: `A tool for ${defaultCategoryName}.`,
            category: defaultCategoryName
          });
        }
      });
      return allTools;
    case 'JsonLineTool':
       lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          allTools.push({ ...JSON.parse(trimmedLine), ...baseMeta, category: defaultCategoryName });
        }
      });
      return allTools;
    case 'CategoryTool':
        let currentCategory = defaultCategoryName;
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('### ')) {
                currentCategory = trimmedLine.substring(4).trim();
            } else if (trimmedLine.length > 0) {
                const match = trimmedLine.match(/- \[(.*?)\]\((.*?)\)(?: - (.*))?/);
                if (match) {
                    allTools.push({
                        ...baseMeta,
                        name: match[1].trim(),
                        url: match[2].trim(),
                        description: (match[3] || `A tool for ${currentCategory}`).trim(),
                        category: currentCategory,
                    });
                }
            }
        });
        return allTools;
    default:
      throw new Error(`Unknown schema for ${sourceFile}`);
  }
}

async function generateTypes(allTools) {
    const sampleTool = allTools.length > 0 ? allTools[0] : {};
    const keys = [...new Set(allTools.flatMap(tool => Object.keys(tool)))];

    let content = `// Auto-generated, never hand-edited. Based on all converted JSON files.
export type Tool = {
`;
    keys.sort().forEach(key => {
        let type = 'any';
        const allTypes = new Set(allTools.map(t => typeof t[key]).filter(t => t !== 'undefined'));
        if (allTypes.size === 1) {
            const foundType = allTypes.values().next().value;
            if (foundType === 'string') type = 'string';
            if (foundType === 'number') type = 'number';
            if (foundType === 'boolean') type = 'boolean';
            if (foundType === 'object' && Array.isArray(sampleTool[key])) type = 'string[]';
        }
        const isOptional = allTools.some(t => typeof t[key] === 'undefined');
        content += `  ${key}${isOptional ? '?' : ''}: ${type};\n`;
    });
    content += `};
`;
    
    const outDir = path.join(process.cwd(), 'src', 'lib');
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, 'tool-schemas.ts');
    
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
    
    let allToolsCombined = [];

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

      const jsonData = parseTxt(content, schema, file);
      allToolsCombined.push(...jsonData);
      
      const outPath = path.join(dataOutDir, `${path.basename(file, path.extname(file))}.json`);
      
      const { sha256 } = atomicWrite(outPath, jsonData);

      report.files[file] = {
        schema,
        count: jsonData.length,
        sha256,
      };
      console.log(`✅ Converted ${file} to ${outPath}`);
    }

    await generateTypes(allToolsCombined);

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
