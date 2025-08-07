import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Sparkles } from 'lucide-react';
import Image from "next/image";

const pillars = [
  {
    icon: CheckCircle,
    title: 'Curated Excellence',
    description: 'We meticulously select and review every tool to ensure it meets our high standards for quality and utility.'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Your feedback and suggestions shape our platform. We believe in the power of collective wisdom.'
  },
  {
    icon: Sparkles,
    title: 'Continuous Innovation',
    description: 'The startup world never sleeps, and neither do we. We are always adding new tools and features.'
  },
];

export default function FoundersNote() {
  return (
    <section className="py-16">
      <Card className="bg-muted/30 border">
        <CardContent className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <Image 
                src="https://placehold.co/80x80" 
                alt="Logo Oluwamayowa, Founder of StartIT" 
                width={80} 
                height={80} 
                className="rounded-full mb-4" 
                data-ai-hint="logo abstract"
                sizes="80px"
              />
              <h2 className="text-2xl font-bold font-headline text-foreground">Founder's Note</h2>
              <p className="font-semibold mt-1 text-foreground">Logo Oluwamayowa</p>
              <p className="text-sm text-foreground">Founder & Chief Curator</p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-lg text-foreground mb-4 text-balance">
                "We're indie hackers who've been in the trenches, building startups and hunting for the right tools to accelerate our growth. After years of bookmarking, testing, and comparing hundreds of tools, we realized we had built something valuable - a curated collection of the best resources for every stage of the startup journey."
              </p>
              <p className="text-lg text-foreground font-semibold text-balance">
                "StartIT is our way of giving back. Every tool here has been personally tested or comes highly recommended by founders we trust. No affiliate spam, no fake reviews - just honest recommendations from builders, for builders."
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-background border mb-4">
                  <pillar.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 text-balance">{pillar.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
