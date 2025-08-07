import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tool } from "@/lib/tools";
import { ArrowUpRight, Star } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { tagMap } from "@/lib/constants";

type ToolCardProps = {
  tool: Tool;
  onSelect: (tool: Tool) => void;
};

export default function ToolCard({ tool, onSelect }: ToolCardProps) {

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5 rating-glow p-2" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(totalStars)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 transition-colors ${i < filledStars ? 'text-orange-400 fill-orange-400' : 'text-muted-foreground/50'}`}
          />
        ))}
      </div>
    );
  };


  return (
    <Card className="flex flex-col h-full group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div onClick={() => onSelect(tool)} className="flex flex-col flex-grow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold">{tool.tool}</CardTitle>
              {tool.rating && renderStars(tool.rating)}
          </div>
          <CardDescription className="font-inter !mt-2">{tool.benefit}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            {tool.description && <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.tags?.map(tag => {
                  const tagInfo = tagMap[tag];
                  return tagInfo ? <Badge key={tag} variant={tagInfo.variant} className="font-figtree">{tagInfo.label}</Badge> : null;
              })}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Link href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm text-accent font-semibold flex items-center justify-between p-3 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors w-full">
                <span>Visit Website</span>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
