import * as React from 'react';
import { cn } from '../../index';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showValueLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  value,
  max = 100,
  showValueLabel = false,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex items-center gap-3 w-full', className)} {...props}>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-2 w-full overflow-hidden rounded-full bg-secondary border border-border/10 shrink-0"
      >
        <div
          className="h-full w-full flex-1 bg-teal transition-all duration-300 ease-out rounded-full"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
      {showValueLabel && (
        <span className="text-xs font-semibold text-muted-foreground select-none font-heading min-w-[36px] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
export default Progress;
