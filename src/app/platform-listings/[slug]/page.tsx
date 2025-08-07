import { getToolsBySlug, getCategoriesForSlug, getFunnelsForSlug, Tool } from '@/lib/tools';
import ToolListings from '@/components/pages/platform-listings/tool-listings';
import { categories } from '@/data/categories';
import type { Metadata } from 'next';

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

export async function generateStaticParams() {
  const slugs = categories.map(c => ({ slug: c.slug }));
  return [...slugs, { slug: 'all' }];
}

export default async function PlatformListingsPage({ params, searchParams }: PlatformListingsPageProps) {
  const { slug } = params;
  const tools: Tool[] = await getToolsBySlug(slug);
  const availableCategories = await getCategoriesForSlug(slug);
  const availableFunnels = await getFunnelsForSlug(slug);

  return (
    <ToolListings
      slug={slug}
      tools={tools}
      availableCategories={availableCategories}
      availableFunnels={availableFunnels}
      searchParams={searchParams}
    />
  );
}
