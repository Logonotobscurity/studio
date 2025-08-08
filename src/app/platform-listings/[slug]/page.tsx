import { getToolsBySlug, getCategoriesForSlug, getFunnelsForSlug, Tool } from '@/lib/tools';
import ToolListings from '@/components/pages/platform-listings/tool-listings';
import { categories } from '@/data/categories';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PlatformListingsPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: PlatformListingsPageProps): Promise<Metadata> {
  const category = categories.find(c => c.slug === params.slug);
  const title = category ? `${category.title} Tools` : 'All Tools';
  const description = category ? `Discover the best tools for ${category.title.toLowerCase()}.` : 'Explore all tools on StartIT.';

  return {
    title,
    description,
  };
}

export function generateStaticParams() {
  const slugs = categories.map(c => ({ slug: c.slug }));
  return [...slugs, { slug: 'all' }];
}

export default async function PlatformListingsPage({ params, searchParams }: PlatformListingsPageProps) {
  const { slug } = params;
  
  if (slug !== 'all' && !categories.find(c => c.slug === slug)) {
    notFound();
  }

  const tools: Tool[] = await getToolsBySlug(slug);
  const availableCategories = await getCategoriesForSlug(tools);
  const availableFunnels = await getFunnelsForSlug(tools);
  
  const pageTitle = categories.find(c => c.slug === slug)?.title || 'All Tools';
  const pageDescription = categories.find(c => c.slug === slug)?.description || 'Explore all tools to accelerate your growth.';

  return (
    <ToolListings
      initialTools={tools}
      availableCategories={availableCategories}
      availableFunnels={availableFunnels}
      searchParams={searchParams}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    />
  );
}