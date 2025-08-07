import fs from 'fs-extra';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');
const outputFile = path.join(process.cwd(), 'src', 'lib', 'tools.json');

interface RawTool {
  tool: string;
  url: string;
  benefit: string;
  category: string;
  tags?: string[];
  funnel?: string[];
  description?: string;
  rating?: number;
  [key: string]: any;
}

async function prebuildTools() {
  try {
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    const allTools: RawTool[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const jsonContent: RawTool[] = await fs.readJson(filePath);
      allTools.push(...jsonContent);
    }

    // Deduplicate tools based on the 'tool' name, last one wins.
    const uniqueTools = Array.from(new Map(allTools.map((tool) => [tool.tool, tool])).values());
    
    // Sort tools alphabetically by name
    uniqueTools.sort((a, b) => a.tool.localeCompare(b.tool));

    await fs.writeJson(outputFile, uniqueTools, { spaces: 2 });
    console.log(`✅ Successfully generated ${outputFile} with ${uniqueTools.length} tools.`);
  } catch (error) {
    console.error('❌ Error generating tools.json:', error);
    process.exit(1);
  }
}

prebuildTools();
