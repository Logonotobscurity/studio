import { useMemo, useEffect, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

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
      const toolName = tool.tool || tool.name || '';
      const benefit = tool.benefit || tool.description || '';
      
      const searchTermMatch = searchTerm === '' ||
        toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benefit.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = selectedCategories.size === 0 || (tool.category && selectedCategories.has(tool.category));
      
      const funnelMatch = selectedFunnels.size === 0 || (tool.funnel && tool.funnel.some((f: string) => selectedFunnels.has(f)));
      
      const tagMatch = selectedTags.size === 0 || (tool.tags && tool.tags.some((t: string) => selectedTags.has(t)));

      return searchTermMatch && categoryMatch && funnelMatch && tagMatch;
    });
  }, [tools, searchTerm, selectedCategories, selectedFunnels, selectedTags]);

  const totalPages = Math.ceil(filteredTools.length / TOOLS_PER_PAGE);

  const currentPage = useMemo(() => {
    const page = searchParams?.page;
    const pageNumber = Number(page);
    const validPage = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
    return Math.min(validPage, totalPages > 0 ? totalPages : 1);
  }, [searchParams?.page, totalPages]);
  
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * TOOLS_PER_PAGE;
    const end = start + TOOLS_PER_PAGE;
    return filteredTools.slice(start, end);
  }, [filteredTools, currentPage]);

  useEffect(() => {
    // This effect ensures we don't try to update the URL on the server
    // or during the initial client render before hydration is complete.
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // When filters change, if the current page is no longer valid, reset to 1.
      const params = new URLSearchParams(searchParams as any);
      if (currentPage > totalPages && totalPages > 0) {
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [filteredTools.length, totalPages, currentPage, searchParams, pathname, router, isMounted]);

  return {
    paginatedTools,
    totalPages,
    currentPage,
    filteredToolCount: filteredTools.length,
  };
}
