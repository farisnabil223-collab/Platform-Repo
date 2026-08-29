import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../index';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
}

export const Accordion: React.FC<AccordionProps> = ({
  className,
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  ...props
}) => {
  const [expandedIds, setExpandedIds] = React.useState<string[]>(defaultExpandedIds);

  const handleToggle = (id: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('flex flex-col border border-border rounded-lg bg-card overflow-hidden', className)} {...props}>
      {items.map((item, idx) => {
        const isExpanded = expandedIds.includes(item.id);
        const isLast = idx === items.length - 1;

        return (
          <div key={item.id} className={cn('border-b border-border/50', isLast && 'border-b-0')}>
            {/* Header Trigger */}
            <button
              onClick={() => handleToggle(item.id)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-trigger-${item.id}`}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold hover:bg-muted/40 transition-colors text-left focus-visible:outline-none font-heading"
            >
              <span>{item.title}</span>
              <svg
                className={cn('h-4 w-4 stroke-2 transition-transform duration-200 text-muted-foreground', isExpanded && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Content Drawer */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  role="region"
                  aria-labelledby={`accordion-trigger-${item.id}`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 text-sm text-foreground/80 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
export default Accordion;
