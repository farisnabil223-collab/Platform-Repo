import * as React from 'react';
import { cn } from '../../index';

export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  className,
  label,
  placeholder = 'Select multiple...',
  options,
  selectedValues = [],
  onChange,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full max-w-md select-none', className)} {...props}>
      {label && <span className="text-sm font-medium text-foreground/90">{label}</span>}
      <div className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex flex-wrap gap-1 items-center justify-between text-muted-foreground">
        <span>{selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}</span>
        <svg className="h-4 w-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <p className="text-[10px] text-muted-foreground italic">[MultiSelect scaffolded component]</p>
    </div>
  );
};
export default MultiSelect;
