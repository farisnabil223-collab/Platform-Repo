import * as React from 'react';
import { cn } from '../../index';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: 'h-4 w-4 stroke-2',
    md: 'h-6 w-6 stroke-2',
    lg: 'h-10 w-10 stroke-[2.5]',
    xl: 'h-16 w-16 stroke-[3]',
  };

  return (
    <svg
      className={cn('animate-spin text-primary', sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  fullScreen?: boolean;
  label?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className, fullScreen = false, label = 'Loading...', ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 bg-background/50 backdrop-blur-[1px] p-6 text-foreground select-none',
        fullScreen ? 'fixed inset-0 z-60 w-screen h-screen' : 'w-full h-full min-h-[120px]',
        className
      )}
      {...props}
    >
      <Spinner size={fullScreen ? 'lg' : 'md'} />
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
    </div>
  );
};
