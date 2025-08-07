import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tool } from "@/lib/tools";
import { ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { tagMap } from "@/lib/constants";
import { motion } from 'framer-motion';
import Rating from "@/components/ui/rating";

type ToolCardProps = {
  tool: Tool;
  onSelect: (tool: Tool) => void;
};

export default function ToolCard({ tool, onSelect }: ToolCardProps) {

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toolName = tool.tool || tool.name || 'Unnamed Tool';
  const benefit = tool.benefit || tool.description || 'No description available.';
  const description = tool.description || '';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div onClick={() => onSelect(tool)} className="flex flex-col flex-grow cursor-pointer">
          <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{toolName}</CardTitle>
                {tool.rating && <Rating rating={tool.rating} />}
            </div>
            <CardDescription className="font-inter !mt-2">{benefit}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
              {description && <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.tags?.map((tag: string) => {
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
    </motion.div>
  );
}
