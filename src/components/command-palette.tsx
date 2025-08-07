'use client';

import * as React from 'react';
import { ArrowUpRight, FileText, Folder, HardDrive, Loader2, Search } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { commandPaletteSearch, type CommandPaletteSearchOutput } from '@/ai/flows/command-palette-search';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

type CommandPaletteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const iconMap = {
  tool: HardDrive,
  page: FileText,
  category: Folder,
};


export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<CommandPaletteSearchOutput>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 200);

  React.useEffect(() => {
    const search = async () => {
      if (debouncedQuery.trim().length > 1) {
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
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url);
    }
  };
  
  const handleValueChange = (value: string) => {
    if (value.length < 100) {
      setQuery(value);
    }
  }

  const groupedResults = results.reduce((acc, result) => {
    const key = result.type.charAt(0).toUpperCase() + result.type.slice(1) + 's';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {} as Record<string, CommandPaletteSearchOutput>);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search for tools, categories, or pages..." 
        value={query}
        onValueChange={handleValueChange}
      />
      <CommandList>
        {loading && (
          <div className="p-4 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && debouncedQuery.length > 1 && results.length === 0 && (
          <CommandEmpty>No results found for "{debouncedQuery}".</CommandEmpty>
        )}
        {Object.entries(groupedResults).map(([groupName, groupResults]) => (
            <CommandGroup key={groupName} heading={groupName}>
                {groupResults.map((result) => {
                    const Icon = iconMap[result.type];
                    return (
                        <CommandItem key={result.id} onSelect={() => handleSelect(result.url)} value={`${result.name} ${result.description}`}>
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{result.name}</span>
                                        <span className="text-xs text-muted-foreground">{result.description}</span>
                                    </div>
                                </div>
                                {result.type === 'tool' && <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                            </div>
                        </CommandItem>
                    )
                })}
            </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
