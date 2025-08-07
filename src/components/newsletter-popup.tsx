'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mail, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem('newsletterPopupShown');
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 7000); // 7-second delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Subscribing email:', email);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Subscribed!',
      description: "Thanks for joining our newsletter. You're all set!",
    });

    setIsSubmitting(false);
    setEmail('');
    handleClose();
  };

  const handleClose = () => {
    sessionStorage.setItem('newsletterPopupShown', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="p-6 text-center">
                 <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-accent" />
                    </div>
                 </div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold font-headline">Join Our Weekly Digest</DialogTitle>
                  <DialogDescription className="mt-2 text-muted-foreground">
                    Get the best new tools, growth strategies, and founder stories delivered to your inbox.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="you@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-center"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                 <Button variant="ghost" size="sm" className="mt-4 text-muted-foreground" onClick={handleClose}>
                    No, thanks
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
