'use client';

import * as React from 'react';
import { ArrowUpRight, Loader2, Search } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { commandPaletteSearch, type CommandPaletteSearchOutput } from '@/ai/flows/command-palette-search';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

type CommandPaletteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<CommandPaletteSearchOutput>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const search = async () => {
      if (debouncedQuery.length > 2) {
        setLoading(true);
        try {
          const searchResults = await commandPaletteSearch({ query: debouncedQuery });
          setResults(searchResults);
        } catch (error) {
          console.error("Command palette search failed:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    search();
  }, [debouncedQuery]);

  const handleSelect = (url: string) => {
    setOpen(false);
    // Check if it's an internal or external link
    if (url.startsWith('/')) {
      router.push(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search for tools or actions..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="p-4 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && debouncedQuery.length > 2 && results.length === 0 && (
          <CommandEmpty>No results found for "{debouncedQuery}".</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Tools">
            {results.map((result) => (
              <CommandItem key={result.url} onSelect={() => handleSelect(result.url)} value={result.tool}>
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                        <span className="font-medium">{result.tool}</span>
                        <span className="text-xs text-muted-foreground">{result.benefit}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
