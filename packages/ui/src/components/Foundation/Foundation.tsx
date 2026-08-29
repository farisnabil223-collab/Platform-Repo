import * as React from 'react';
import { cn } from '../../index';

// 1. TYPOGRAPHY PRIMITIVE
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'code';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'code';
}

export const Text: React.FC<TextProps> = ({
  className,
  variant = 'body',
  weight = 'normal',
  as: Component = 'p',
  ...props
}) => {
  const variantStyles = {
    h1: 'text-3xl font-bold font-heading tracking-tight',
    h2: 'text-2xl font-bold font-heading tracking-tight',
    h3: 'text-xl font-bold font-heading tracking-tight',
    h4: 'text-lg font-semibold font-heading tracking-tight',
    body: 'text-sm text-foreground/90 leading-relaxed',
    caption: 'text-xs text-muted-foreground',
    code: 'font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-border/40',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Component
      className={cn(variantStyles[variant], weightStyles[weight], className)}
      {...props}
    />
  );
};

// 2. LAYOUT PRIMITIVE
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: boolean;
  flexCol?: boolean;
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'between';
  p?: 1 | 2 | 3 | 4 | 6 | 8;
  m?: 1 | 2 | 3 | 4 | 6 | 8;
}

export const Box: React.FC<BoxProps> = ({
  className,
  flex = false,
  flexCol = false,
  gap,
  align,
  p,
  m,
  ...props
}) => {
  const gapStyles = gap ? `gap-${gap}` : '';
  const pStyles = p ? `p-${p}` : '';
  const mStyles = m ? `m-${m}` : '';

  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    between: 'justify-between items-center',
  };

  return (
    <div
      className={cn(
        flex && 'flex',
        flexCol && 'flex-col',
        gapStyles,
        align && alignStyles[align],
        pStyles,
        mStyles,
        className
      )}
      {...props}
    />
  );
};

// 3. SURFACE PRIMITIVE
export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Surface: React.FC<SurfaceProps> = ({
  className,
  level = 0,
  rounded = 'md',
  ...props
}) => {
  const levels = {
    0: 'bg-background border border-border/40',
    1: 'bg-card border border-border/60 shadow-sm',
    2: 'bg-popover border border-border shadow-md',
  };

  const rounds = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(levels[level], rounds[rounded], className)}
      {...props}
    />
  );
};
