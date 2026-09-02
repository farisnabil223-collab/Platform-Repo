import React from 'react';

interface PriceBadgeProps {
  price: number;
  originalPrice?: number;
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ price, originalPrice, className = '' }) => {
  const isFree = price === 0;
  const hasDiscount = Boolean(originalPrice && originalPrice > price);
  const discountPercent = hasDiscount ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0;

  return (
    <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
          isFree
            ? 'bg-teal/10 text-teal border border-teal/20'
            : 'bg-primary/10 text-primary border border-primary/20'
        }`}
      >
        {isFree ? 'Free' : `$${price.toFixed(2)}`}
      </span>
      {hasDiscount && (
        <>
          <span className="text-xs text-muted-foreground line-through font-semibold">
            ${originalPrice!.toFixed(2)}
          </span>
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
};

export default PriceBadge;
