import * as React from 'react';
import { cn } from '../../index';
import { InputProps } from './Input.types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, fullWidth = false, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', fullWidth ? 'w-full' : 'max-w-md')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground/90 select-none">
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150',
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
        />
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

Input.displayName = 'Input';

(Input as any).metadata = {
  name: 'Input',
  version: '1.0.0',
  accessibilityLevel: 'AA',
  themeSupport: true,
  rtlSupport: true,
  dependencies: ['clsx', 'tailwind-merge'],
  supportedVariants: ['text', 'email', 'password', 'number', 'date', 'time'],
};
