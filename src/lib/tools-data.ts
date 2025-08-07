import growthHackingTools from '@/data/growth-hacking.json';
import startupJourneyTools from '@/data/startup-journey.json';
import developerJourneyTools from '@/data/developer-journey.json';
import type { Tool } from '@/lib/tools';

const allToolArrays = [
    growthHackingTools as Tool[],
    startupJourneyTools as Tool[],
    developerJourneyTools as Tool[]
];

const allTools = allToolArrays.flat();

// Deduplicate based on tool name, giving priority to later entries
export const tools = Array.from(new Map(allTools.map(tool => [tool.tool, tool])).values());
