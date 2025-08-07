'use server';

/**
 * @fileOverview Implements a Genkit flow for the command palette search feature.
 *
 * This flow searches across tools, categories, and site pages.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { tools } from '@/lib/tools-data';
import { categories } from '@/data/categories';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/about', label: 'About' },
  { href: '/suggest', label: 'Suggest a Tool' },
];

const CommandPaletteSearchInputSchema = z.object({
  query: z.string().describe('The search query entered by the user.'),
});
export type CommandPaletteSearchInput = z.infer<typeof CommandPaletteSearchInputSchema>;

const CommandPaletteSearchOutputSchema = z.array(
  z.object({
    id: z.string().describe('A unique identifier for the result item.'),
    type: z.enum(['tool', 'page', 'category']).describe('The type of the search result.'),
    name: z.string().describe('The name of the item.'),
    url: z.string().describe('The URL or path for the item.'),
    description: z.string().describe('A brief description of the item.'),
  })
);
export type CommandPaletteSearchOutput = z.infer<typeof CommandPaletteSearchOutputSchema>;


export async function commandPaletteSearch(input: CommandPaletteSearchInput): Promise<CommandPaletteSearchOutput> {
  const { query } = input;
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();
  const results: CommandPaletteSearchOutput = [];

  // Search tools
  tools.forEach(tool => {
    if (tool.tool.toLowerCase().includes(lowerCaseQuery) || tool.benefit.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        id: `tool-${tool.tool}`,
        type: 'tool',
        name: tool.tool,
        url: tool.url,
        description: tool.benefit,
      });
    }
  });

  // Search categories
  categories.forEach(category => {
    if (category.title.toLowerCase().includes(lowerCaseQuery) || category.description.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        id: `category-${category.slug}`,
        type: 'category',
        name: category.title,
        url: `/platform-listings/${category.slug}`,
        description: category.description,
      });
    }
  });

  // Search pages
  navLinks.forEach(link => {
    if (link.label.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        id: `page-${link.href}`,
        type: 'page',
        name: link.label,
        url: link.href,
        description: `Navigate to the ${link.label} page`,
      });
    }
  });

  // Limit results to prevent overwhelming the user
  return results.slice(0, 15);
}
