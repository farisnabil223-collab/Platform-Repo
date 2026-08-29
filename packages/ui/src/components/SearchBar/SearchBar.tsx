import * as React from 'react';
import { cn } from '../../index';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  showShortcut?: boolean;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, showShortcut = true, placeholder = 'Search anywhere...', onChange, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(e.currentTarget.value);
      }
    };

    return (
      <div className="relative w-full max-w-md select-none group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <svg
            className="h-4 w-4 stroke-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          type="search"
          placeholder={placeholder}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-muted/30 pl-9 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background transition-all duration-150',
            className
          )}
          ref={ref}
          onKeyDown={handleKeyDown}
          onChange={onChange}
          {...props}
        />

        {/* Shortcut Badge */}
        {showShortcut && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground shadow-sm">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
