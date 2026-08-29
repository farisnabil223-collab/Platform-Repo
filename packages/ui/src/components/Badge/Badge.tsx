import * as React from 'react';
import { cn } from '../../index';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  outline?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', outline = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-colors';

    const variants = {
      default: outline
        ? 'border-border text-foreground bg-transparent'
        : 'bg-secondary text-secondary-foreground border-transparent',
      primary: outline
        ? 'border-primary text-primary bg-transparent'
        : 'bg-primary text-primary-foreground border-transparent',
      secondary: outline
        ? 'border-secondary text-secondary-foreground bg-transparent'
        : 'bg-secondary text-secondary-foreground border-transparent',
      success: outline
        ? 'border-[hsl(173,58%,39%)] text-[hsl(173,58%,39%)] bg-transparent'
        : 'bg-[hsl(173,58%,39%)]/10 text-[hsl(173,58%,39%)] border-[hsl(173,58%,39%)]/20',
      warning: outline
        ? 'border-[hsl(36,79%,57%)] text-[hsl(36,79%,57%)] bg-transparent'
        : 'bg-[hsl(36,79%,57%)]/10 text-[hsl(36,79%,57%)] border-[hsl(36,79%,57%)]/20',
      error: outline
        ? 'border-destructive text-destructive bg-transparent'
        : 'bg-destructive/10 text-destructive border-destructive/20',
      info: outline
        ? 'border-sky-500 text-sky-500 bg-transparent'
        : 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
