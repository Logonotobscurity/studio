import { useMemo, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Tool } from '@/lib/tools';

const TOOLS_PER_PAGE = 12;

type UseToolFiltersProps = {
  tools: Tool[];
  searchParams: { [key: string]: string | string[] | undefined };
  searchTerm: string;
};

export function useToolFilters({ tools, searchParams, searchTerm }: UseToolFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = useMemo(() => {
    const page = searchParams?.page;
    const pageNumber = Number(page);
    return isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
  }, [searchParams?.page]);

  const selectedCategories = useMemo(() => {
    const cats = searchParams?.categories;
    return new Set(Array.isArray(cats) ? cats : (cats ? [cats] : []));
  }, [searchParams?.categories]);

  const selectedFunnels = useMemo(() => {
    const funnels = searchParams?.funnels;
    return new Set(Array.isArray(funnels) ? funnels : (funnels ? [funnels] : []));
  }, [searchParams?.funnels]);

  const selectedTags = useMemo(() => {
    const tags = searchParams?.tags;
    return new Set(Array.isArray(tags) ? tags : (tags ? [tags] : []));
  }, [searchParams?.tags]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const searchTermMatch = searchTerm === '' ||
        tool.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.benefit.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(tool.category);
      
      const funnelMatch = selectedFunnels.size === 0 || (tool.funnel && tool.funnel.some(f => selectedFunnels.has(f)));
      
      const tagMatch = selectedTags.size === 0 || (tool.tags && tool.tags.some(t => selectedTags.has(t)));

      return searchTermMatch && categoryMatch && funnelMatch && tagMatch;
    });
  }, [tools, searchTerm, selectedCategories, selectedFunnels, selectedTags]);

  const totalPages = Math.ceil(filteredTools.length / TOOLS_PER_PAGE);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * TOOLS_PER_PAGE;
    const end = start + TOOLS_PER_PAGE;
    return filteredTools.slice(start, end);
  }, [filteredTools, currentPage]);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const params = new URLSearchParams(searchParams as any);
      params.set('page', String(totalPages));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, totalPages, searchParams, pathname, router]);
  
  useEffect(() => {
    // Reset page to 1 when filters change
    const params = new URLSearchParams(searchParams as any);
    if (params.has('page') && params.get('page') !== '1') {
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedFunnels, selectedTags, searchTerm]);

  return {
    paginatedTools,
    totalPages,
    currentPage,
    filteredToolCount: filteredTools.length,
  };
}
