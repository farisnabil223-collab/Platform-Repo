import * as React from 'react';
import { cn } from '../../index';
import { Button } from '../Button/Button';

export type ErrorTypeCode = '401' | '403' | '404' | '500' | 'offline' | 'maintenance';

export interface ErrorPageProps extends React.HTMLAttributes<HTMLDivElement> {
  code: ErrorTypeCode;
  onAction?: () => void;
  actionLabel?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  className,
  code,
  onAction,
  actionLabel,
  ...props
}) => {
  const configs = {
    '401': {
      title: 'Authentication Required',
      description: 'You must sign in with a valid identity token to view this portal workspace.',
      status: '401',
      icon: (
        <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    '403': {
      title: 'Access Restricted',
      description: 'Your security scope permissions are insufficient to view this administrative resource.',
      status: '403',
      icon: (
        <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    '404': {
      title: 'Page Not Found',
      description: 'The requested portal catalog path does not exist or has been permanently archived.',
      status: '404',
      icon: (
        <svg className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    '500': {
      title: 'Server Engine Failure',
      description: 'The NestJS core API backend encountered an unhandled internal operations exception.',
      status: '500',
      icon: (
        <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    'offline': {
      title: 'Network Disconnected',
      description: 'No active internet connection was detected. Telemetry and API synchronization suspended.',
      status: 'Offline',
      icon: (
        <svg className="h-10 w-10 text-slate-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072M6 18a9 9 0 1112.728-12.728" />
        </svg>
      ),
    },
    'maintenance': {
      title: 'Under Scheduled Maintenance',
      description: 'EduVerse is undergoing standard schema updates. Services will resume shortly.',
      status: 'Maintenance',
      icon: (
        <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  };

  const current = configs[code];

  return (
    <div
      className={cn(
        'min-h-[70vh] flex flex-col items-center justify-center text-center p-6 select-none max-w-md mx-auto gap-5 font-sans',
        className
      )}
      {...props}
    >
      <div className="h-20 w-20 rounded-full bg-card border border-border/60 shadow-md flex items-center justify-center">
        {current.icon}
      </div>

      <div>
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block font-heading mb-1.5">
          System Status: {current.status}
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight font-heading text-foreground">
          {current.title}
        </h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
          {current.description}
        </p>
      </div>

      {onAction && actionLabel && (
        <Button variant="primary" size="sm" onClick={onAction} className="text-xs px-6 py-2 bg-primary hover:bg-primary/95 shadow">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default ErrorPage;
