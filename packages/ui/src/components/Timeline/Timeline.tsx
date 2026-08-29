import * as React from 'react';
import { cn } from '../../index';

export interface TimelineItem {
  id: string;
  title: string;
  time: string;
  description?: string;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ className, items, ...props }) => {
  return (
    <div className={cn('flex flex-col gap-4 pl-4 border-l border-border select-none relative', className)} {...props}>
      {items.map((item) => (
        <div key={item.id} className="relative pl-4 flex flex-col gap-0.5">
          {/* Node dot */}
          <div className="absolute -left-[21px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
          <span className="text-[10px] font-bold text-primary font-heading uppercase">{item.time}</span>
          <h5 className="text-xs font-semibold text-foreground font-heading leading-tight">{item.title}</h5>
          {item.description && <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.description}</p>}
        </div>
      ))}
      <p className="text-[10px] text-muted-foreground italic">[Timeline scaffolded component]</p>
    </div>
  );
};
export default Timeline;
