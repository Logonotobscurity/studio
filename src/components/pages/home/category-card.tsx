import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ElementType } from 'react';

type CategoryCardProps = {
  title: string;
  description: string;
  slug: string;
  icon: ElementType;
  gradient: string;
};

export default function CategoryCard({ title, description, slug, icon: Icon, gradient }: CategoryCardProps) {
  return (
    <Link href={`/platform-listings/${slug}`} className="block group">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <CardHeader className="flex-grow">
          <div className={cn("mb-4 w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br text-white", gradient)}>
            <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <CardTitle className="font-headline font-bold">{title}</CardTitle>
          <CardDescription className="pt-1">{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="link" className="p-0 text-accent font-semibold">
            Explore Solutions
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
