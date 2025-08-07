import Link from 'next/link';
import { Coffee, Newspaper, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "WHY THIS?",
    answer: "StartIT is built to empower entrepreneurs and growth enthusiasts by providing a curated, community-driven platform to discover and evaluate the best tools. We cut through the noise to help you build and scale faster."
  },
  {
    question: "WHY IS MY FAVOURITE TOOL NOT HERE?",
    answer: "We're constantly updating our listings! If your favorite tool is missing, please suggest it to us. We prioritize tools based on community feedback, relevance, and our curation guidelines."
  },
  {
    question: "HOW ARE TOOLS RATED?",
    answer: "Ratings are a combination of our expert reviews and aggregated community feedback. We aim for a transparent and unbiased rating system to help you make informed decisions."
  }
];

export default function Footer() {
  const StartITLogo = () => (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-foreground">
      <span>Start</span>
      <span className="text-accent">IT</span>
    </Link>
  );

  return (
    <footer className="bg-muted/50 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-4">
            <StartITLogo />
            <p className="text-muted-foreground text-sm max-w-xs">
              Open platform for growth enthusiasts to find recommended Solutions to Curiosity.
            </p>
             <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer">
                    <Coffee className="mr-2 h-4 w-4" />
                    Support StartIT
                  </a>
                </Button>
                <Button variant="outline" disabled>
                    <Newspaper className="mr-2 h-4 w-4" />
                    Weekly Digest
                </Button>
             </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-semibold text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StartIT. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 mt-4 sm:mt-0 items-center">
            <Button variant="ghost" size="sm" disabled>
                <Code className="mr-2 h-4 w-4" />
                Embed Badge
            </Button>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
