import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${className}`}>
      <div className="space-y-2">
        {badge && (
          <span className="text-[10px] uppercase tracking-widest font-black text-amber bg-amber/10 px-3.5 py-1 rounded-full border border-amber/20 shadow-sm font-heading">
            {badge}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-xs font-bold text-teal hover:underline transition-colors flex items-center gap-1 shrink-0"
        >
          {viewAllText} &rarr;
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
