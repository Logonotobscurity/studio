import Hero from '@/components/pages/home/hero';
import Categories from '@/components/pages/home/categories';
import MostViewedTools from '@/components/pages/home/most-viewed-tools';
import FoundersNote from '@/components/pages/home/founders-note';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Categories />
        <Separator className="my-16" />
        <MostViewedTools />
        <Separator className="my-16" />
        <FoundersNote />
      </div>
    </div>
  );
}
