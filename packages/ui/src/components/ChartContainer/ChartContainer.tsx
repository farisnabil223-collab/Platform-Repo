import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../index';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ className, title, children, ...props }) => {
  return (
    <div className={cn('p-5 rounded-lg border border-border bg-card text-card-foreground shadow-sm flex flex-col gap-4 select-none w-full', className)} {...props}>
      {title && <h4 className="text-sm font-semibold font-heading text-muted-foreground">{title}</h4>}
      <div className="h-[220px] w-full flex items-end justify-center relative">
        {children}
      </div>
    </div>
  );
};

export const SVGLineChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const height = 180;
  const width = 400;
  const padding = 20;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxVal) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points.reduce((acc, p, index) => {
    return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grids */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <line
              key={ratio}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              className="stroke-border/30 stroke-1"
              strokeDasharray="4"
            />
          );
        })}

        {/* Gradient fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        {points.length > 0 && (
          <motion.path
            d={areaD}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Line path */}
        {points.length > 0 && (
          <motion.path
            d={pathD}
            fill="none"
            className="stroke-primary"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}

        {/* Dots */}
        {points.map((p, idx) => (
          <motion.circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="4"
            className="fill-background stroke-primary stroke-2 hover:r-6 cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.05 + 0.3 }}
          />
        ))}
      </svg>

      {/* X Labels */}
      <div className="flex justify-between px-3 text-[10px] text-muted-foreground mt-2">
        {data.map((d, index) => (
          <span key={index}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

export const SVGBarChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const height = 180;
  const width = 400;
  const padding = 20;

  const barWidth = ((width - padding * 2) / data.length) * 0.65;
  const gap = ((width - padding * 2) / data.length) * 0.35;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {data.map((d, index) => {
          const x = padding + index * (barWidth + gap) + gap / 2;
          const barHeight = (d.value / maxVal) * (height - padding * 2);
          const y = height - padding - barHeight;

          return (
            <g key={index}>
              {/* Bar Rect */}
              <motion.rect
                x={x}
                y={height - padding}
                width={barWidth}
                height={0}
                rx="4"
                className="fill-primary/80 hover:fill-primary transition-colors cursor-pointer"
                animate={{
                  y,
                  height: barHeight,
                }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
              />
            </g>
          );
        })}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-border stroke-1" />
      </svg>

      <div className="flex justify-between px-3 text-[10px] text-muted-foreground mt-2">
        {data.map((d, index) => (
          <span key={index} style={{ width: `${100 / data.length}%`, textAlign: 'center' }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};
