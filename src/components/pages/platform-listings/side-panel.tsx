'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import FilterCheckbox from "./filter-checkbox";
import type { Tool } from "@/lib/tools";
import ToolDossier from "./tool-dossier";
import { AnimatePresence, motion } from "framer-motion";

type SidePanelProps = {
  availableCategories: string[];
  availableFunnels: string[];
  selectedTool: Tool | null;
  onClearSelectedTool: () => void;
};

export default function SidePanel({ availableCategories, availableFunnels, selectedTool, onClearSelectedTool }: SidePanelProps) {
    const oneTapFilters = [
        { value: 'FF', label: 'Free Forever' },
        { value: 'NC', label: 'No-Card Required' },
        { value: 'OS', label: 'Open Source' },
    ];

    const variants = {
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };
    
    const dossierVariants = {
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
            {selectedTool ? (
                <motion.div
                    key="dossier"
                    variants={dossierVariants}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    <ToolDossier tool={selectedTool} onBack={onClearSelectedTool} />
                </motion.div>
            ) : (
                <motion.div
                    key="filters"
                    variants={variants}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                >
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold">Filters</h2>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6">
                        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="font-semibold">General</AccordionTrigger>
                                <AccordionContent className="space-y-2 pt-2">
                                    {oneTapFilters.map(filter => (
                                        <FilterCheckbox key={filter.value} id={`tag-${filter.value}`} paramName="tags" value={filter.value} label={filter.label} />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                            {availableCategories.length > 0 && (
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="font-semibold">Categories</AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-2">
                                        {availableCategories.map(category => (
                                            <FilterCheckbox key={category} id={`cat-${category}`} paramName="categories" value={category} label={category} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                            {availableFunnels.length > 0 && (
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="font-semibold">Growth Funnel</AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-2">
                                        {availableFunnels.map(funnel => (
                                            <FilterCheckbox key={funnel} id={`funnel-${funnel}`} paramName="funnels" value={funnel} label={funnel} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
