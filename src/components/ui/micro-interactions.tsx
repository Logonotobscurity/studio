'use client';

import { useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Heart, Bookmark, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

// --- HeartButton ---
export function HeartButton({
  initialLiked = false,
  initialCount = 0,
  onChange,
  className,
}: {
  initialLiked?: boolean;
  initialCount?: number;
  onChange?: (isLiked: boolean, newCount: number) => void;
  className?: string;
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? count + 1 : count - 1;
    setIsLiked(newLikedState);
    setCount(newCount);
    // analytics.track('heart_button_clicked', { liked: newLikedState });
    onChange?.(newLikedState, newCount);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn("flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors duration-200", className)}
      whileTap={{ scale: 0.9 }}
      aria-pressed={isLiked}
      aria-label={isLiked ? `Unlike, currently ${count} likes` : `Like, currently ${count} likes`}
    >
      <motion.div
        animate={{
          scale: isLiked ? [1, 1.3, 1] : 1,
          transition: { duration: 0.3 },
        }}
      >
        <Heart
          className={cn("h-5 w-5", isLiked && "text-red-500 fill-current")}
        />
      </motion.div>
      <span className="text-sm font-medium">{count}</span>
    </motion.button>
  );
}

// --- BookmarkButton ---
export function BookmarkButton({
  initialBookmarked = false,
  onChange,
  className,
}: {
  initialBookmarked?: boolean;
  onChange?: (isBookmarked: boolean) => void;
  className?: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleClick = () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    // analytics.track('bookmark_button_clicked', { bookmarked: newBookmarkedState });
    onChange?.(newBookmarkedState);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn("text-muted-foreground hover:text-accent transition-colors duration-200 p-2", className)}
      whileTap={{ scale: 0.9 }}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <motion.div
        animate={{
          rotate: isBookmarked ? [0, 10, -5, 0] : 0,
          transition: { duration: 0.4 },
        }}
      >
        <Bookmark
          className={cn("h-5 w-5", isBookmarked && "text-accent fill-current")}
        />
      </motion.div>
    </motion.button>
  );
}

// --- FloatingActionButton ---
export function FloatingActionButton({
    onClick,
    className,
    children,
    ariaLabel = 'Floating Action Button',
}: {
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    ariaLabel?: string;
}) {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                'fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg',
                className
            )}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label={ariaLabel}
        >
            {children || <Plus />}
        </motion.button>
    );
}

// --- RippleButton ---
export function RippleButton({ children, className, ...props }: ButtonProps) {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newRipple = { x, y, id: Date.now() };

        setRipples([...ripples, newRipple]);

        setTimeout(() => {
            setRipples((prevRipples) => prevRipples.filter((r) => r.id !== newRipple.id));
        }, 600);
        
        props.onClick?.(event);
    };

    return (
        <Button
            className={cn("relative overflow-hidden", className)}
            {...props}
            onClick={handleClick}
        >
            {children}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    className="absolute block h-1 w-1 rounded-full bg-current opacity-50"
                    style={{ left: ripple.x, top: ripple.y }}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 200, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            ))}
        </Button>
    );
}
