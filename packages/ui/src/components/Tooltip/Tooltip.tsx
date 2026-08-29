import * as React from 'react';
import { cn } from '../../index';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ className, content, children, ...props }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      className={cn('relative inline-block select-none', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      {...props}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className="absolute z-60 px-2 py-1 text-[10px] font-semibold text-primary-foreground bg-primary rounded shadow-sm whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1.5 animate-fadeIn"
        >
          {content}
        </div>
      )}
    </div>
  );
};
export default Tooltip;
