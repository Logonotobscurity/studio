
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, List } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SidePanel from './side-panel';
import ToolCard from './tool-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { categories } from '@/data/categories';
import Pagination from './pagination';
import { useToolFilters } from '@/hooks/use-tool-filters';

type ToolListingsProps = {
  slug: string;
  tools: Tool[];
  availableCategories: string[];
  availableFunnels: string[];
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ToolListings({
  slug,
  tools,
  availableCategories,
  availableFunnels,
  searchParams,
}: ToolListingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const categoryInfo = categories.find(c => c.slug === slug);

  const { paginatedTools, totalPages, currentPage, filteredToolCount } = useToolFilters({
    tools,
    searchParams,
    searchTerm,
  });
  
  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    if (isMobile) {
      setIsSidePanelOpen(true);
    }
  };

  const handleClearSelectedTool = () => {
    setSelectedTool(null);
  };
  
  const handleOpenFilters = () => {
    setSelectedTool(null);
    setIsSidePanelOpen(true);
  };

  useEffect(() => {
    if (!isSidePanelOpen) {
      handleClearSelectedTool();
    }
  }, [isSidePanelOpen]);

  const pageTitle = categoryInfo ? `${categoryInfo.title} Tools` : 'All Tools';
  const pageDescription = categoryInfo ? categoryInfo.description : 'Explore all tools to accelerate your growth.';

  const sidePanelContent = (
    <SidePanel
      availableCategories={availableCategories}
      availableFunnels={availableFunnels}
      selectedTool={selectedTool}
      onClearSelectedTool={handleClearSelectedTool}
    />
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex">
        {/* Desktop Side Panel */}
        {!isMobile && (
          <aside className="w-80 flex-shrink-0 pr-8 py-10 sticky top-16 h-[calc(100vh-4rem)]">
            {sidePanelContent}
          </aside>
        )}
        
        <div className="flex-1 py-10 min-w-0">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight font-headline">{pageTitle}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{pageDescription}</p>
          </header>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <List className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            {/* Mobile Filter Trigger */}
            {isMobile && (
              <Sheet open={isSidePanelOpen} onOpenChange={setIsSidePanelOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2" onClick={handleOpenFilters}>
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full max-w-sm p-0">
                    {sidePanelContent}
                </SheetContent>
              </Sheet>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            Showing {paginatedTools.length} of {filteredToolCount} tools
          </div>
          
          {paginatedTools.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedTools.map((tool, index) => (
                  <ToolCard key={`${tool.tool}-${index}`} tool={tool} onSelect={handleSelectTool} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <p className="font-semibold text-lg">No tools found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
