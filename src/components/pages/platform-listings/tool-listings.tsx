'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, List } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SidePanel from './side-panel';
import ToolCard from './tool-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

type ToolListingsProps = {
  tools: Tool[];
  availableCategories: string[];
  availableFunnels: string[];
  searchParams: { [key: string]: string | string[] | undefined };
  categoryInfo?: {
    title: string;
    description: string;
    slug: string;
  };
};

export default function ToolListings({
  tools,
  availableCategories,
  availableFunnels,
  searchParams,
  categoryInfo,
}: ToolListingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
            Showing {filteredTools.length} of {tools.length} tools
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.tool} tool={tool} onSelect={handleSelectTool} />
              ))}
            </div>
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
