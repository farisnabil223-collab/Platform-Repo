import * as React from 'react';
import { cn } from '../../index';
import { Button } from '../Button/Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  title,
  description,
  icon,
  actionLabel,
  onAction,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-xl bg-card/20 select-none max-w-sm mx-auto my-6',
        className
      )}
      {...props}
    >
      {/* Icon frame */}
      <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
        {icon || (
          <svg className="h-6 w-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>

      <h4 className="text-sm font-semibold font-heading text-foreground leading-none">{title}</h4>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-5 text-xs">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
