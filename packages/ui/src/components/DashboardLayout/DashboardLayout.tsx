import * as React from 'react';
import { cn } from '../../index';

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ className, columns = 3, ...props }) => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={cn('grid gap-6 w-full', cols[columns], className)}
      {...props}
    />
  );
};

export const DashboardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-1.5 pb-4 border-b border-border/40 w-full', className)} {...props} />
);

export const DashboardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex-1 flex flex-col gap-6 w-full', className)} {...props} />
);

export const DashboardWidgetsArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6 w-full', className)} {...props} />
);

export const DashboardSidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-6 w-full lg:col-span-1', className)} {...props} />
);

export const DashboardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('py-4 text-center text-xs text-muted-foreground border-t border-border/40 w-full', className)} {...props} />
);

export const DashboardQuickActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center gap-3 w-full', className)} {...props} />
);
