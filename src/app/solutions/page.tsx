import Categories from '@/components/pages/home/categories';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Explore all tool categories and solutions offered by StartIT.',
};

export default function SolutionsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Categories />
    </div>
  );
}
