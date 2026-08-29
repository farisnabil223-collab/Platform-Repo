import * as React from 'react';
import { cn } from '../../index';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, fullWidth = false, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', fullWidth ? 'w-full' : 'max-w-md')}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-foreground/90 select-none">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 resize-y',
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
Textarea.displayName = 'Textarea';
