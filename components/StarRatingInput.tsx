import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  maxRating?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  maxRating = 5,
  onChange,
  size = 'md',
  className = '',
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, idx) => (
        <button
          type="button"
          key={idx}
          aria-label={`Rate ${idx + 1} star${idx > 0 ? 's' : ''}`}
          className="focus:outline-none"
          onMouseEnter={() => setHovered(idx + 1)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(idx + 1)}
        >
          <Star
            className={`${sizeClasses[size]} ${
              (hovered !== null ? idx < hovered : idx < value)
                ? 'text-warning fill-warning'
                : 'text-gray-300'
            }`}
            strokeWidth={1.5}
            fill={(hovered !== null ? idx < hovered : idx < value) ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
