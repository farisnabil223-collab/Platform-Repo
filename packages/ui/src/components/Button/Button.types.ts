import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface ComponentMetadata {
  name: string;
  version: string;
  accessibilityLevel: 'A' | 'AA' | 'AAA';
  themeSupport: boolean;
  rtlSupport: boolean;
  dependencies: string[];
  supportedVariants: string[];
}
