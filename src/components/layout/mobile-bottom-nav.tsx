'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import CommandPalette from '@/components/command-palette';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/solutions', label: 'Solutions', icon: Compass },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  })

  return (
    <>
      <motion.div 
        variants={{
          visible: { y: 0 },
          hidden: { y: "100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border z-50"
      >
        <nav className="h-full">
          <ul className="flex justify-around items-center h-full">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href} className="h-full">
                <Link
                  href={href}
                  className={cn(
                    'flex flex-col items-center justify-center h-full w-20 transition-colors',
                    pathname === href ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{label}</span>
                </Link>
              </li>
            ))}
            <li className="h-full">
                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="flex flex-col items-center justify-center h-full w-20 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Open search"
                >
                  <Search className="h-6 w-6" />
                  <span className="text-xs mt-1">Search</span>
                </button>
            </li>
             <li className="h-full">
                <Link
                  href="/suggest"
                  className="flex flex-col items-center justify-center h-full w-20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PlusCircle className="h-6 w-6" />
                  <span className="text-xs mt-1">Suggest</span>
                </Link>
              </li>
          </ul>
        </nav>
      </motion.div>
      <CommandPalette open={isCommandPaletteOpen} setOpen={setIsCommandPaletteOpen} />
    </>
  );
}
