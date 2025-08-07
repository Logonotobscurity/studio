'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const popularTools = [
  { name: 'Vercel', category: 'Hosting', href: 'https://vercel.com', logo: 'https://placehold.co/40x40' },
  { name: 'Hotjar', category: 'Analytics', href: 'https://hotjar.com', logo: 'https://placehold.co/40x40' },
  { name: 'Figma', category: 'Design', href: 'https://figma.com', logo: 'https://placehold.co/40x40' },
  { name: 'Notion', category: 'Productivity', href: 'https://notion.so', logo: 'https://placehold.co/40x40' },
  { name: 'Stripe', category: 'Payments', href: 'https://stripe.com', logo: 'https://placehold.co/40x40' },
  { name: 'OpenAI', category: 'AI', href: 'https://openai.com', logo: 'https://placehold.co/40x40' },
];

export default function MostViewedTools() {
  return (
    <motion.section 
      className="py-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Most Viewed Tools</h2>
        <p className="mt-2 text-lg text-muted-foreground">Discover what the community is excited about.</p>
      </div>
      <div className="mt-12">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {popularTools.map((tool) => (
                <li key={tool.name}>
                  <Link href={tool.href} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 hover:bg-muted/50 transition-colors group">
                    <Image 
                      src={tool.logo} 
                      alt={`${tool.name} logo`} 
                      width={40} 
                      height={40} 
                      className="rounded-md" 
                      data-ai-hint="logo"
                      sizes="40px"
                    />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold">{tool.name}</p>
                      <p className="text-sm text-muted-foreground font-inter">{tool.category}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 mr-1 text-orange-400" />
                      Popular
                    </div>
                    <ArrowUpRight className="h-5 w-5 ml-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
