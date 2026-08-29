import * as React from 'react';
import { cn } from '../../index';

export interface PopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ className, trigger, content, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const popRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={popRef} className={cn('relative inline-block select-none', className)} {...props}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer inline-block">
        {trigger}
      </div>
      {open && (
        <div className="absolute z-40 mt-2 p-4 rounded-md border border-border bg-card shadow-md max-w-xs animate-fadeIn text-sm">
          {content}
          <p className="text-[9px] text-muted-foreground italic mt-2">[Popover scaffolded component]</p>
        </div>
      )}
    </div>
  );
};
export default Popover;
