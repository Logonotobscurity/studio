'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import CommandPalette from '@/components/command-palette';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/about', label: 'About' },
];

const filterToggles = [
  { label: 'Free Forever', query: { tags: 'FF' } },
  { label: 'No-Card Required', query: { tags: 'NC' } },
  { label: 'Open Source', query: { tags: 'OS' } },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  const StartITLogo = () => (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-foreground">
      <span>Start</span>
      <span className="text-accent">IT</span>
    </Link>
  );

  const desktopNav = (
    <div className="hidden md:flex items-center gap-6">
      <nav className="flex items-center gap-6 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        {filterToggles.map((filter) => (
          <Button key={filter.label} variant="ghost" size="sm" asChild>
             <Link href={{ pathname: '/platform-listings/all', query: filter.query }}>{filter.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
  
  const rightActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCommandPaletteOpen(true)}
        aria-label="Open command palette"
        className="text-foreground/60 hover:text-foreground"
      >
        <Search className="h-5 w-5" />
      </Button>
      <Button asChild className="hidden sm:flex animate-pulse-subtle bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/suggest">Suggest a Tool</Link>
      </Button>
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <StartITLogo />
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetTrigger>
              </div>
              <nav className="flex flex-col gap-6 text-lg font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 border-t border-border pt-6 flex flex-col gap-4">
                <p className="font-semibold">Quick Filters</p>
                {filterToggles.map((filter) => (
                    <Button key={filter.label} variant="outline" asChild>
                        <Link href={{ pathname: '/platform-listings/all', query: filter.query }} onClick={() => setIsMobileMenuOpen(false)}>
                            {filter.label}
                        </Link>
                    </Button>
                ))}
              </div>
              <div className="mt-auto">
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90" asChild>
                    <Link href="/suggest">Suggest a Tool</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-background/80 shadow-md backdrop-blur-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <StartITLogo />
              {desktopNav}
            </div>
            {rightActions}
          </div>
        </div>
      </header>
      <CommandPalette open={isCommandPaletteOpen} setOpen={setIsCommandPaletteOpen} />
    </>
  );
}
