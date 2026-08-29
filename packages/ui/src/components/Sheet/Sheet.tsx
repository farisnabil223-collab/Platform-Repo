import * as React from 'react';
import { cn } from '../../index';

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
}

export const Sheet: React.FC<SheetProps> = ({ className, isOpen = false, onClose, title, children, ...props }) => {
  if (!isOpen) return null;
  return (
    <div className={cn('fixed inset-0 z-50 flex justify-end select-none', className)} {...props}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border-l border-border p-6 shadow-lg z-50">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          ✕
        </button>
        {title && <h3 className="text-lg font-bold font-heading mb-4">{title}</h3>}
        {children}
        <p className="text-[10px] text-muted-foreground italic mt-4">[Sheet scaffolded component]</p>
      </div>
    </div>
  );
};
export default Sheet;
