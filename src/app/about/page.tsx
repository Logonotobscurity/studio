import FoundersNote from '@/components/pages/home/founders-note';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission and vision behind StartIT.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <FoundersNote />
    </div>
  );
}
