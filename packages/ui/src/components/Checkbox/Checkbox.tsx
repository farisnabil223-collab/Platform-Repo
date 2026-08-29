import * as React from 'react';
import { cn } from '../../index';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-foreground/90 select-none group"
        >
          <div className="relative">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded border border-input bg-background transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-hover:border-primary/80 peer-checked:bg-primary peer-checked:border-primary',
                error && 'border-destructive'
              )}
            >
              <svg
                className="h-3 w-3 text-primary-foreground stroke-2 hidden peer-checked:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          {label && <span>{label}</span>}
        </label>
        {error && (
          <p className="text-xs font-medium text-destructive mt-0.5 animate-fadeIn" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
