import type { Tool } from "@/lib/tools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tagMap } from "@/lib/constants";
import { motion } from "framer-motion";
import Rating from "@/components/ui/rating";

type ToolDossierProps = {
  tool: Tool;
  onBack: () => void;
};

export default function ToolDossier({ tool, onBack }: ToolDossierProps) {

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex items-center gap-2 flex-shrink-0 min-w-0">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to filters">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        <h2 className="text-lg font-semibold truncate">{tool.tool}</h2>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-6 space-y-6">
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="p-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold truncate">{tool.tool}</CardTitle>
                {tool.rating && <Rating rating={tool.rating} size="lg" />}
              </div>
              <CardDescription className="!mt-2 text-base truncate">{tool.benefit}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              {tool.description && <p className="text-sm text-foreground/80">{tool.description}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.tags?.map(tag => {
                  const tagInfo = tagMap[tag];
                  return tagInfo ? <Badge key={tag} variant={tagInfo.variant}>{tagInfo.label}</Badge> : null;
                })}
              </div>
            </CardContent>
          </Card>
          
          {tool.funnel && tool.funnel.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Growth Funnel Stage</h3>
              <div className="flex flex-wrap gap-2">
                {tool.funnel.map(f => <Badge key={f} variant="outline">{f}</Badge>)}
              </div>
            </div>
          )}

          <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <Badge variant="secondary">{tool.category}</Badge>
          </div>

        </div>
      </ScrollArea>
       <div className="p-6 mt-auto border-t flex-shrink-0">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                  Visit Website
                  <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
       </div>
    </div>
  );
}
