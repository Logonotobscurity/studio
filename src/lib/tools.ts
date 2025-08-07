'use server';

import fs from 'fs/promises';
import path from 'path';
import { categories as allCategories } from '@/data/categories';
import type { BaseMeta, CategoryTool, JsonLineTool, UrlTool } from './tool-schemas';

export type Tool = BaseMeta & {
  [key: string]: any;
};

const dataDir = path.join(process.cwd(), 'src', 'data');

export const getAllTools = async (): Promise<Tool[]> => {
  const files = await fs.readdir(dataDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const allTools: Tool[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    try {
      const tools: Tool[] = JSON.parse(fileContent);
      if (Array.isArray(tools)) {
        // This handles UrlTool arrays, JsonLineTool arrays, and CategoryTool arrays
        const flattenedTools = tools.flatMap(tool => {
            if (tool._schema === 'CategoryTool' && Array.isArray((tool as CategoryTool).tools)) {
                return (tool as CategoryTool).tools.map(t => ({...t, category: tool.category, ...tool, tools: undefined}));
            }
            return tool;
        });
        allTools.push(...flattenedTools);
      }
    } catch (e) {
      console.error(`Could not parse ${file}:`, e);
    }
  }
  return allTools;
};

export async function getToolsBySlug(slug: string): Promise<Tool[]> {
  const allTools = await getAllTools();
  if (slug === 'all') {
    return allTools;
  }
  return allTools.filter(tool => {
      const sourceFile = tool._sourceFile || '';
      return path.basename(sourceFile, '.TXT').toLowerCase() === slug.toLowerCase();
  });
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
