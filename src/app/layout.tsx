import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import './globals.css';
import FeedbackWidget from '@/components/feedback-widget';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';

export const metadata: Metadata = {
  title: {
    default: 'StartIT - Accelerate Your Growth',
    template: '%s - StartIT',
  },
  description: 'Open platform for growth enthusiasts to find recommended Solutions to Curiosity.',
  openGraph: {
    title: 'StartIT',
    description: 'Open platform for growth enthusiasts to find recommended Solutions to Curiosity.',
    url: 'https://startit.com',
    siteName: 'StartIT',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StartIT',
    description: 'Open platform for growth enthusiasts to find recommended Solutions to Curiosity.',
    images: ['https://placehold.co/1200x630.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9FAFB' },
    { media: '(prefers-color-scheme: dark)', color: '#172125' },
  ],
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500&family=Figtree:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pb-20 md:pb-0">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Footer />
        <FeedbackWidget />
        <MobileBottomNav />
        <Toaster />
      </body>
    </html>
  );
}
