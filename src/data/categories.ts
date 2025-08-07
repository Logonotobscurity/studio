import { LineChart, Rocket, Code } from 'lucide-react';

export const categories = [
  {
    title: 'Growth Hacking',
    description: 'Unlock rapid growth with cutting-edge tools and strategies for user acquisition, retention, and monetization.',
    slug: 'growth-hacking',
    icon: LineChart,
    gradient: 'from-orange-400 to-red-500',
  },
  {
    title: 'Startup Journey',
    description: 'Navigate the startup lifecycle from idea to IPO with essential tools for validation, funding, and scaling.',
    slug: 'startup-journey',
    icon: Rocket,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    title: 'Developer Journey',
    description: 'Build, deploy, and maintain robust applications with the best tools for coding, testing, and infrastructure.',
    slug: 'developer-journey',
    icon: Code,
    gradient: 'from-green-400 to-teal-500',
  },
];
