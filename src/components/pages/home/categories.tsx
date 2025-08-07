import CategoryCard from './category-card';
import { categories } from '@/data/categories';

export default function Categories() {
  return (
    <section id="solutions" className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Building Your Dream</h2>
        <p className="mt-2 text-lg text-muted-foreground">Pick a Solution to get started on your journey.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryCard key={category.slug} {...category} />
        ))}
      </div>
    </section>
  );
}
