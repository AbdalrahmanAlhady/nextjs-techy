
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showRating?: boolean;
  className?: string;
}

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showRating = false,
  className = ''
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => (
          <Star
            key={index}
            className={`${sizeClasses[size]} ${
              index < Math.floor(rating) 
                ? 'text-warning fill-warning' 
                : index < rating 
                ? 'text-warning fill-warning/50' 
                : 'text-border'
            }`}
          />
        ))}
      </div>
      {showRating && (
        <span className={`text-neutral-muted font-medium ${textSizes[size]}`}>
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
