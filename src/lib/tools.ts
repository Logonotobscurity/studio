'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Tool } from './tool-schemas';

const dataDir = path.join(process.cwd(), 'src', 'data');

// A simple in-memory cache to avoid re-reading files on every call
let toolCache: Tool[] | null = null;

export const getAllTools = async (): Promise<Tool[]> => {
  if (toolCache) {
    return toolCache;
  }

  const files = await fs.readdir(dataDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const allTools: Tool[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    try {
      const toolsFromFile: any[] = JSON.parse(fileContent);
      
      if (Array.isArray(toolsFromFile)) {
        // Flatten nested structures like in 'developer-journey.json'
        const flattenedTools = toolsFromFile.flatMap(item => {
          if (item.services && Array.isArray(item.services)) {
            return item.services.map((service: any) => ({
              ...service,
              category: item.category, // Assign the parent category
              _sourceFile: file,
            }));
          }
          return { ...item, _sourceFile: file };
        });
        allTools.push(...flattenedTools);
      }

    } catch (e) {
      console.error(`Could not parse ${file}:`, e);
    }
  }
  
  // Sort tools alphabetically by name
  allTools.sort((a, b) => (a.name || a.tool || '').localeCompare(b.name || b.tool || ''));

  toolCache = allTools;
  return allTools;
};

export async function getToolsBySlug(slug: string): Promise<Tool[]> {
  const allTools = await getAllTools();
  if (slug === 'all') {
    return allTools;
  }

  const categoryNameFromSlug = slug.replace(/-/g, ' ').toLowerCase();
  
  return allTools.filter(tool => {
    const toolCategory = (tool.category || '').toLowerCase();
    const sourceFileBaseName = path.basename(tool._sourceFile || '', '.json').toLowerCase();

    return toolCategory === categoryNameFromSlug || 
           sourceFileBaseName === categoryNameFromSlug;
  });
}

function extractUniqueValues(tools: Tool[], key: keyof Tool): string[] {
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
