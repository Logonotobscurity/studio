'use server';

/**
 * @fileOverview Implements a Genkit flow for the command palette search feature.
 *
 * - commandPaletteSearch - A function that handles the command palette search process.
 * - CommandPaletteSearchInput - The input type for the commandPaletteSearch function.
 * - CommandPaletteSearchOutput - The return type for the commandPaletteSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommandPaletteSearchInputSchema = z.object({
  query: z.string().describe('The search query entered by the user.'),
});
export type CommandPaletteSearchInput = z.infer<typeof CommandPaletteSearchInputSchema>;

const CommandPaletteSearchOutputSchema = z.array(
  z.object({
    tool: z.string().describe('The name of the tool.'),
    url: z.string().url().describe('The URL of the tool.'),
    benefit: z.string().describe('A brief description of the tool.'),
    category: z.string().describe('The category of the tool.'),
  })
);
export type CommandPaletteSearchOutput = z.infer<typeof CommandPaletteSearchOutputSchema>;

export async function commandPaletteSearch(input: CommandPaletteSearchInput): Promise<CommandPaletteSearchOutput> {
  return commandPaletteSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'commandPaletteSearchPrompt',
  input: {schema: CommandPaletteSearchInputSchema},
  output: {schema: CommandPaletteSearchOutputSchema},
  prompt: `You are a search assistant that helps users find tools based on their query.\n  Given the user's query, search for relevant tools and return a list of tools with their name, URL, brief description, and category.\n\n  Query: {{{query}}}\n  `,
});

const commandPaletteSearchFlow = ai.defineFlow(
  {
    name: 'commandPaletteSearchFlow',
    inputSchema: CommandPaletteSearchInputSchema,
    outputSchema: CommandPaletteSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
