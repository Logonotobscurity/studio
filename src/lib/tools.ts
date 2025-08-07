'use server';

import fs from 'fs/promises';
import path from 'path';
import { categories as allCategories } from '@/data/categories';
import type { Tool as PrebuiltTool } from './tool-schemas';

// The prebuild step now generates multiple JSON files in src/data
// We need a more flexible Tool type
export type Tool = PrebuiltTool & {
  [key: string]: any;
};

const dataDir = path.join(process.cwd(), 'src', 'data');

export const getAllTools = async (): Promise<Tool[]> => {
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json') && file !== 'tools.json');

    const allTools: Tool[] = [];

    for (const file of jsonFiles) {
        const filePath = path.join(dataDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        try {
            const tools: any[] = JSON.parse(fileContent);
            if (Array.isArray(tools)) {
                allTools.push(...tools);
            }
        } catch (e) {
            console.error(`Could not parse ${file}`);
        }
    }
    return allTools;
};


export async function getToolsBySlug(slug: string): Promise<Tool[]> {
  const category = allCategories.find(c => c.slug === slug);
  const fileName = slug === 'all' ? '' : category?.slug;

  if (slug !== 'all' && !category) {
    console.warn(`No category found for slug: ${slug}`);
    return [];
  }

  const filesToRead = slug === 'all' 
    ? (await fs.readdir(dataDir)).filter(f => f.endsWith('.json') && f !== 'tools.json')
    : [`${fileName}.json`];

  const allTools: Tool[] = [];
  
  for (const file of filesToRead) {
    try {
      const filePath = path.join(dataDir, file);
      const jsonContent = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(jsonContent);

      if(Array.isArray(parsedData)) {
        // This handles UrlTool and JsonLineTool which are arrays of objects
        allTools.push(...parsedData);
      } else if (typeof parsedData === 'object' && parsedData !== null && Array.isArray(parsedData.tools)) {
        // This handles CategoryTool which has a 'tools' property
        allTools.push(...parsedData.tools);
      } else if (typeof parsedData === 'object' && parsedData !== null) {
        // This can handle other structures like a single tool object.
        allTools.push(parsedData);
      }
      
    } catch (error) {
      if ( (error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Error reading or parsing data file for slug ${slug}: ${file}`, error);
      }
    }
  }

  return allTools;
}

function extractUniqueValues(tools: Tool[], key: string): string[] {
  const valueSet = new Set<string>();
  tools.forEach(tool => {
    const value = tool[key];
    if (typeof value === 'string') {
      valueSet.add(value);
    } else if (Array.isArray(value)) {
      value.forEach(v => typeof v === 'string' && valueSet.add(v));
    }
  });
  return Array.from(valueSet).sort();
}


export async function getCategoriesForSlug(tools: Tool[]): Promise<string[]> {
    return extractUniqueValues(tools, 'category');
}

export async function getFunnelsForSlug(tools: Tool[]): Promise<string[]> {
    return extractUniqueValues(tools, 'funnel');
}
