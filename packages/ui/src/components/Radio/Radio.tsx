import * as React from 'react';
import { cn } from '../../index';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={radioId}
          className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-foreground/90 select-none group"
        >
          <div className="relative">
            <input
              type="radio"
              id={radioId}
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded-full border border-input bg-background transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-hover:border-primary/80 peer-checked:border-primary',
                error && 'border-destructive'
              )}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-primary hidden peer-checked:block transition-all duration-150" />
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
Radio.displayName = 'Radio';
