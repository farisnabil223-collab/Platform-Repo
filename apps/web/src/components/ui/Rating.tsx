import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 16,
  className = 'flex items-center gap-0.5',
}) => {
  return (
    <div className={className} aria-label={`Rating: ${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        const half = !filled && starValue - 0.5 <= value;

        return (
          <Star
            key={index}
            size={size}
            className={`${
              filled
                ? 'fill-amber-400 text-amber-400'
                : half
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        );
      })}
    </div>
  );
};

export default Rating;
