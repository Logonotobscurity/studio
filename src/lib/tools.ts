import toolsJson from './tools.json';
import { categories as allCategories } from '@/data/categories';

// The interface is now derived from the JSON source of truth.
export type Tool = (typeof toolsJson)[0];

export const getAllTools = (): Tool[] => {
  // The JSON is pre-processed at build time, so we can just type-assert it.
  return toolsJson as Tool[];
};

export function getToolsBySlug(slug: string): Tool[] {
  const allTools = getAllTools();
  if (slug === 'all') {
    return allTools;
  }
  
  const category = allCategories.find(c => c.slug === slug);
  if (!category) {
      console.warn(`No data file found for slug: ${slug}`);
      return [];
  }
  
  // Filter tools based on the main category title from categories.ts
  return allTools.filter(tool => {
      // Find the category object for the tool.
      const toolCategory = allCategories.find(c => c.title === tool.category);
      // Check if the tool's category slug matches the requested slug.
      return toolCategory?.slug === slug;
  });
}

export function getCategoriesForSlug(slug: string): string[] {
  const tools = getToolsBySlug(slug);
  const categories = new Set(tools.map(tool => tool.category));
  return Array.from(categories).sort();
}

export function getFunnelsForSlug(slug: string): string[] {
    const tools = getToolsBySlug(slug);
    const funnels = new Set(tools.flatMap(tool => tool.funnel || []));
    return Array.from(funnels).sort();
}
