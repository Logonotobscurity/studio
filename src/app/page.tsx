import Hero from '@/components/pages/home/hero';
import Categories from '@/components/pages/home/categories';
import MostViewedTools from '@/components/pages/home/most-viewed-tools';
import FoundersNote from '@/components/pages/home/founders-note';
import { Separator } from '@/components/ui/separator';
import { getAllTools } from '@/lib/tools';
import type { Tool } from '@/lib/tools';

export default async function Home() {
  const allTools: Tool[] = await getAllTools();
  const popularTools = allTools
    .filter(tool => Array.isArray(tool.tags) && tool.tags.includes('*'))
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Categories />
        <Separator className="my-16" />
        <MostViewedTools popularTools={popularTools} />
        <Separator className="my-16" />
        <FoundersNote />
      </div>
    </div>
  );
}
