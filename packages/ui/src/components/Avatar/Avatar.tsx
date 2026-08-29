import * as React from 'react';
import { cn } from '../../index';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', fallback, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    };

    const getInitials = (text?: string) => {
      if (!text) return '';
      const parts = text.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const isUrl = (str?: string) => str && (str.startsWith('http') || str.startsWith('/') || str.startsWith('data:'));
    const actualSrc = isUrl(src) ? src : isUrl(fallback) ? fallback : null;
    const initialText = fallback && !isUrl(fallback) ? fallback : src && !isUrl(src) ? src : alt;
    const hasImage = actualSrc && !imageError;

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-primary/20 border border-primary/30 select-none items-center justify-center font-bold text-primary font-heading shadow-sm',
          sizes[size],
          className
        )}
        {...props}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={actualSrc!}
            alt={alt || 'Avatar'}
            onError={() => setImageError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span className="uppercase tracking-wider">{getInitials(initialText)}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
