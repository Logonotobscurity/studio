'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div 
        aria-hidden="true" 
        className="absolute inset-0 -z-10 animate-[gradient-xy_10s_ease_infinite]"
        style={{
            backgroundSize: '400% 400%',
        }}
      >
        <Image 
          src="https://placehold.co/1200x630.png"
          alt="Abstract background gradient"
          fill
          priority
          quality={80}
          className="object-cover bg-gradient-to-br from-background via-orange-50 to-rose-100 dark:from-gray-900 dark:via-orange-950/20 dark:to-rose-950/20"
          data-ai-hint="gradient background"
          sizes="100vw"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance font-headline">
            We are With You in Every Step in Accelerating your Growth
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground text-balance">
            Open platform for growth enthusiasts to find recommended Solutions to{' '}
            <span className="sparkle-container font-semibold text-foreground/80 hover:text-foreground transition-colors">
              Curiosity
              <span className="sparkle" style={{top: '0%', left: '100%', animationDelay: '0.2s'}}></span>
              <span className="sparkle" style={{top: '100%', left: '50%', animationDelay: '0.5s'}}></span>
            </span>.
          </p>
          <div className="mt-10 flex justify-center">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground animate-pulse-subtle">
              <Link href="/solutions">Explore Solutions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

    