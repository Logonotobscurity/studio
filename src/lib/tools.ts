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
const toolFiles = ['growth-hacking.json', 'startup-journey.json', 'developer-journey.json'];

async function readJsonFile(filename: string): Promise<Tool[]> {
  try {
    const filePath = path.join(dataDirectory, filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading or parsing ${filename}:`, error);
    return [];
  }
}

async function getAllTools(): Promise<Tool[]> {
  const allToolPromises = toolFiles.map(file => readJsonFile(file));
  const allToolArrays = await Promise.all(allToolPromises);
  const allTools = allToolArrays.flat();
  // Simple deduplication based on tool name
  const uniqueTools = Array.from(new Map(allTools.map(tool => [tool.tool, tool])).values());
  return uniqueTools;
}

export async function getToolsBySlug(slug: string): Promise<Tool[]> {
  if (slug === 'all') {
    return getAllTools();
  }

  const filename = `${slug}.json`;
  if (toolFiles.includes(filename)) {
    return readJsonFile(filename);
  }
  
  return [];
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
