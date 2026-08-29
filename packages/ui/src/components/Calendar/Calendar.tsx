import * as React from 'react';
import { cn } from '../../index';

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ className, value = new Date(), onChange, ...props }) => {
  const daysInMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(value.getFullYear(), value.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
  const blanks = Array.from({ length: firstDayIndex }, (_, idx) => idx);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={cn('p-4 rounded-lg border border-border bg-card shadow-sm w-full max-w-sm select-none flex flex-col gap-3', className)} {...props}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold font-heading">{months[value.getMonth()]} {value.getFullYear()}</h4>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="h-8" />
        ))}
        {days.map((d) => {
          const isToday = d === new Date().getDate() && value.getMonth() === new Date().getMonth() && value.getFullYear() === new Date().getFullYear();
          return (
            <button
              key={`day-${d}`}
              onClick={() => onChange?.(new Date(value.getFullYear(), value.getMonth(), d))}
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center font-medium transition-colors hover:bg-muted/50 focus:outline-none',
                isToday ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground'
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
      <p className="text-[9px] text-muted-foreground italic text-center mt-1">[Calendar scaffolded component]</p>
    </div>
  );
};
export default Calendar;
