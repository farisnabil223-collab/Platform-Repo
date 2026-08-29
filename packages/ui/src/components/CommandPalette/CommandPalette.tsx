import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../index';

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  action: () => void;
  icon?: React.ReactNode;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Filter commands
  const filtered = React.useMemo(() => {
    if (!query) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(lower) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Handle keyboard traversal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          filtered[activeIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, activeIndex, onClose]);

  // Reset index when search changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl text-card-foreground overflow-hidden flex flex-col focus:outline-none"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 border-b border-border/50">
              <svg className="h-4 w-4 stroke-2 text-muted-foreground mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full h-12 bg-transparent border-0 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-foreground"
                autoFocus
              />
              <kbd className="hidden sm:inline-block border border-border px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted font-bold text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* List Results */}
            <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-0.5">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No commands matched your query.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all text-left focus:outline-none select-none',
                        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-foreground/80'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </div>
                      <span className={cn('text-[9px] uppercase font-bold tracking-wider', isActive ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
export default CommandPalette;
