import * as React from 'react';
import { cn } from '../../index';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, error, helperText, fullWidth = false, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', fullWidth ? 'w-full' : 'max-w-md')}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-foreground/90 select-none">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 appearance-none pr-10',
              hasError
                ? 'border-destructive focus-visible:ring-destructive'
                : 'focus-visible:ring-ring',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              cn(
                hasError ? errorId : undefined,
                helperText ? helperId : undefined
              ) || undefined
            }
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
            <svg
              className="h-4 w-4 stroke-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {hasError && (
          <p id={errorId} className="text-xs font-medium text-destructive animate-fadeIn" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
