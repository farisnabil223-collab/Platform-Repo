import * as React from 'react';
import { cn } from '../../index';

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  value?: string;
  onChange?: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ className, label, value, onChange, ...props }) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full max-w-md select-none', className)} {...props}>
      {label && <span className="text-sm font-medium text-foreground/90">{label}</span>}
      <div className="relative">
        <input
          type="time"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-150"
        />
      </div>
      <p className="text-[10px] text-muted-foreground italic">[TimePicker scaffolded component]</p>
    </div>
  );
};
export default TimePicker;
