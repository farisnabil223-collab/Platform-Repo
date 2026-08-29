import React from 'react';

interface PriceBadgeProps {
  price: number;
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ price, className = '' }) => {
  const isFree = price === 0;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        isFree
          ? 'bg-teal/10 text-teal border border-teal/20'
          : 'bg-primary/10 text-primary border border-primary/20'
      } ${className}`}
    >
      {isFree ? 'Free' : `$${price.toFixed(2)}`}
    </span>
  );
};

export default PriceBadge;
