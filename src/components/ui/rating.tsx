import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RatingProps = {
  rating: number;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function Rating({ rating, totalStars = 5, size = 'md', className }: RatingProps) {
  const filledStars = Math.round(rating);
  
  const starSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  return (
    <div className={cn("flex items-center gap-0.5 rating-glow p-2", className)} aria-label={`Rating: ${rating} out of ${totalStars} stars`}>
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            'transition-colors',
            i < filledStars ? 'text-orange-400 fill-orange-400' : 'text-muted-foreground/50'
          )}
        />
      ))}
    </div>
  );
}
