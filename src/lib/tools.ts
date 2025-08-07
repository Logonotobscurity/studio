import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';

export interface Tool {
  tool: string;
  url: string;
  benefit: string;
  category: string;
  tags?: ('OS' | 'SH' | 'CC' | 'β' | '*' | 'FF' | 'NC')[];
  rating?: number;
  funnel?: ('Awareness' | 'Acquisition' | 'Activation' | 'Revenue' | 'Retention' | 'Referral')[];
  description?: string;
  seoMetaDescription?: string;
}

const dataDirectory = path.join(process.cwd(), 'src', 'data');

async function readJsonFile(filename: string): Promise<Tool[]> {
  try {
    const filePath = path.join(dataDirectory, filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    // Ensure the data is always an array
    if (Array.isArray(data)) {
      return data;
    }
    // If the JSON is an object with a 'tools' array (like old startup-journey.json)
    if (typeof data === 'object' && data !== null && Array.isArray(data.tools)) {
      return data.tools;
    }
    // If the JSON is an array of objects with a 'tools' array (like old developer-journey.json)
    if (Array.isArray(data) && data.every(item => typeof item === 'object' && item !== null && Array.isArray(item.tools))) {
      return data.flatMap(category => 
        (category.tools as any[]).map(tool => ({ ...tool, category: tool.category || category.category }))
      );
    }
    return [];
  } catch (error) {
    console.error(`Error reading or parsing ${filename}:`, error);
    return [];
  }
}

async function getAllTools(): Promise<Tool[]> {
  const allToolPromises = (await fs.readdir(dataDirectory))
    .filter(file => file.endsWith('.json'))
    .map(file => readJsonFile(file));
  
  const allToolArrays = await Promise.all(allToolPromises);
  const allTools = allToolArrays.flat();
  
  // Deduplicate based on tool name, giving priority to later entries
  const uniqueTools = Array.from(new Map(allTools.map(tool => [tool.tool, tool])).values());
  return uniqueTools;
}

export async function getToolsBySlug(slug: string): Promise<Tool[]> {
  if (slug === 'all') {
    return getAllTools();
  }

  const filename = `${slug}.json`;
  try {
    // Check if file exists before reading
    await fs.access(path.join(dataDirectory, filename));
    return readJsonFile(filename);
  } catch (error) {
    // File doesn't exist for the slug
    console.warn(`No data file found for slug: ${slug}`);
    return [];
  }
}

export async function getCategoriesForSlug(slug: string): Promise<string[]> {
  const tools = await getToolsBySlug(slug);
  const categories = new Set(tools.map(tool => tool.category));
  return Array.from(categories).sort();
}

export async function getFunnelsForSlug(slug: string): Promise<string[]> {
    const tools = await getToolsBySlug(slug);
    const funnels = new Set(tools.flatMap(tool => tool.funnel || []));
    return Array.from(funnels).sort();
}
