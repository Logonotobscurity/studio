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
              <Image src="https://placehold.co/80x80" alt="Founder's Signature" width={80} height={80} className="rounded-full mb-4" data-ai-hint="logo abstract" />
              <h2 className="text-2xl font-bold font-headline">Founder's Note</h2>
              <p className="font-semibold mt-1">Logo Oluwamayowa</p>
              <p className="text-sm text-muted-foreground">Founder & Chief Curator</p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-lg text-foreground/90 mb-4 text-balance">
                "Every great journey begins with curiosity. StartIT was born from my passion to bridge the gap between ambitious minds and the tools they need to transform their ideas into reality. As an entrepreneur and growth enthusiast, I know the challenge of finding the right solution. That's why I built StartIT."
              </p>
              <p className="text-lg text-foreground/90 font-semibold text-balance">
                My Promise: StartIT will always remain a platform dedicated to your growth.
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
