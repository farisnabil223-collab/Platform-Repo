import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Export priority components
export * from './components/Button';
export * from './components/Card';
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Checkbox';
export * from './components/Radio';
export * from './components/Select';
export * from './components/Badge';
export * from './components/Avatar';
export * from './components/Dialog';
export * from './components/Modal';
export * from './components/Toast';
export * from './components/Table';
export * from './components/Skeleton';
export * from './components/Loading';
export * from './components/ErrorBoundary';
export * from './components/Breadcrumb';
export * from './components/Pagination';
export * from './components/Tabs';
export * from './components/Accordion';
export * from './components/Progress';
export * from './components/Notification';

// Export app layout helper components
export * from './components/ThemeSwitcher';
export * from './components/LanguageSwitcher';
export * from './components/ProfileMenu';
export * from './components/StatisticCard';
export * from './components/SearchBar';
export * from './components/CommandPalette';
export * from './components/ChartContainer';

// Export scaffolded components
export * from './components/MultiSelect';
export * from './components/DatePicker';
export * from './components/TimePicker';
export * from './components/Drawer';
export * from './components/Sheet';
export * from './components/Popover';
export * from './components/Tooltip';
export * from './components/DataGrid';
export * from './components/Timeline';
export * from './components/Calendar';
export * from './components/PortalLayout';
export * from './components/EmptyState';
export * from './components/ErrorPages';
export * from './components/DashboardWidgets';
export * from './components/Foundation';
export * from './components/Icon';
export * from './hooks/useBreakpoint';
export * from './context/GlobalStore';
export * from './context/FeatureFlag';
export * from './providers/AppProviders';
export * from './config/routes';
export * from './components/DashboardLayout';
export * from './utils/errors';
export * from './utils/logger';
export * from './hooks/useObservability';
export * from './utils/security';
