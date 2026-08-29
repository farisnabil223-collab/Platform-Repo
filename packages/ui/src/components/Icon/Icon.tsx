import * as React from 'react';
import * as Lucide from 'lucide-react';
import { cn } from '../../index';

export const IconRegistry = {
  dashboard: Lucide.LayoutDashboard,
  settings: Lucide.Settings,
  user: Lucide.User,
  bell: Lucide.Bell,
  courses: Lucide.BookOpen,
  assignments: Lucide.ClipboardList,
  grades: Lucide.GraduationCap,
  billing: Lucide.CreditCard,
  logout: Lucide.LogOut,
  menu: Lucide.Menu,
  x: Lucide.X,
  chevronDown: Lucide.ChevronDown,
  chevronUp: Lucide.ChevronUp,
  chevronLeft: Lucide.ChevronLeft,
  chevronRight: Lucide.ChevronRight,
  search: Lucide.Search,
  help: Lucide.HelpCircle,
  info: Lucide.Info,
  warning: Lucide.AlertTriangle,
  error: Lucide.XCircle,
  success: Lucide.CheckCircle2,
  activity: Lucide.Activity,
  announcement: Lucide.Megaphone,
  calendar: Lucide.Calendar,
  task: Lucide.CheckSquare,
  messages: Lucide.MessageSquare,
  exams: Lucide.FileSpreadsheet,
  clock: Lucide.Clock,
  play: Lucide.Play,
  book: Lucide.Book,
  paperclip: Lucide.Paperclip,
  send: Lucide.Send,
  lock: Lucide.Lock,
};

export type IconName = keyof typeof IconRegistry;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'name' | 'ref'> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted' | 'current';
  ariaLabel?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, name, size = 'md', color = 'current', ariaLabel, ...props }, ref) => {
    const LucideIcon = IconRegistry[name];

    if (!LucideIcon) {
      console.warn(`Icon "${name}" does not exist in the IconRegistry.`);
      return null;
    }

    const sizes = {
      sm: 16,
      md: 20,
      lg: 24,
    };

    const iconSize = typeof size === 'number' ? size : sizes[size];

    const colors = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-emerald-500',
      warning: 'text-amber-500',
      error: 'text-red-500',
      muted: 'text-muted-foreground',
      current: 'text-current',
    };

    return (
      <LucideIcon
        ref={ref}
        size={iconSize}
        className={cn(colors[color], className)}
        aria-label={ariaLabel || `${name} icon`}
        aria-hidden={ariaLabel ? undefined : 'true'}
        role={ariaLabel ? 'img' : undefined}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

(Icon as any).metadata = {
  name: 'Icon',
  version: '1.0.0',
  accessibilityLevel: 'AA',
  themeSupport: true,
  rtlSupport: false,
  dependencies: ['lucide-react', 'clsx'],
  supportedVariants: Object.keys(IconRegistry),
};
