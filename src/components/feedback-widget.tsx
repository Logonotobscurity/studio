'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Coffee, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    // In a real app, you would track this interaction with an analytics event
    // analytics.track('feedback_widget_toggled', { open: !isOpen });
    setIsOpen(!isOpen);
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // In a real app, you would send this data to a backend endpoint
    // await fetch('/api/feedback', { ... });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback!",
    });
    setIsSubmitting(false);
    setIsOpen(false);
  }

  const fabColor = "hsl(var(--accent))";
  const iconColor = "hsl(var(--accent-foreground))";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-40px)] max-w-sm rounded-lg border bg-popover shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
          >
            <div className="p-6">
                <h2 id="feedback-title" className="text-lg font-semibold text-popover-foreground">Share Your Thoughts</h2>
                <p className="mt-1 text-sm text-muted-foreground">Found a bug or have a suggestion? Let us know!</p>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <textarea
                    name="feedback"
                    placeholder="Your feedback..."
                    required
                    className="w-full h-24 p-2 text-sm border rounded-md resize-none bg-background focus:ring-2 focus:ring-ring"
                    aria-label="Feedback input"
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                    <Send className="ml-2 h-4 w-4"/>
                  </Button>
                </form>

                <div className="mt-6 border-t pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Love StartIT?</p>
                    <Button asChild variant="link" className="text-accent font-semibold">
                      <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer">
                        <Coffee className="mr-2 h-4 w-4" />
                        Buy me a coffee
                      </a>
                    </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: fabColor }}
          aria-label={isOpen ? 'Close feedback widget' : 'Open feedback widget'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X color={iconColor} /> : <MessageSquare color={iconColor} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
