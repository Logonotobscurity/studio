import CategoryCard from './category-card';
import { categories } from '@/data/categories';

export default function Categories() {
  return (
    <section id="solutions" className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Building Your Dream</h2>
        <p className="mt-2 text-lg text-muted-foreground">Pick a Solution to get started on your journey.</p>
      </div>
      <div className="mt-12">
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
             {categories.map((category) => (
                <div key={category.slug} className="flex-shrink-0 w-4/5 sm:w-2/3">
                    <CategoryCard {...category} />
                </div>
            ))}
            <div className="flex-shrink-0 w-1"></div>
          </div>
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {categories.map((category) => (
              <CategoryCard key={category.slug} {...category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
