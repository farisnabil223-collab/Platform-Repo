import * as React from 'react';
import { cn } from '../../index';
import { Card, CardContent } from '../Card/Card';

export interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string | number;
    type: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  className,
  title,
  value,
  description,
  trend,
  icon,
  ...props
}) => {
  return (
    <Card className={cn('bg-card text-card-foreground select-none overflow-hidden relative border border-border/60 hover:border-border', className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading">
            {title}
          </span>
          {icon && <div className="text-muted-foreground/80 shrink-0">{icon}</div>}
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground font-heading">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold select-none',
                trend.type === 'up' && 'bg-emerald-500/10 text-emerald-500',
                trend.type === 'down' && 'bg-red-500/10 text-red-500',
                trend.type === 'neutral' && 'bg-muted text-muted-foreground'
              )}
            >
              {trend.type === 'up' && '↑'}
              {trend.type === 'down' && '↓'}
              {trend.value}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
export default StatisticCard;
