import * as React from 'react';
import { cn } from '../../index';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rect', ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted/80',
        variant === 'text' && 'h-3 w-4/5 rounded-md my-1',
        variant === 'circle' && 'rounded-full h-10 w-10 shrink-0',
        variant === 'rect' && 'rounded-md w-full',
        className
      )}
      {...props}
    />
  );
};
export default Skeleton;
