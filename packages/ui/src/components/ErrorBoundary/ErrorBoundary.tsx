import * as React from 'react';
import { Button } from '../Button/Button';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 border border-red-500/20 bg-red-500/5 rounded-lg text-center gap-4 max-w-md mx-auto my-8 select-none">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <svg className="h-6 w-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 font-heading">Application Render Failure</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs mx-auto">
              An unexpected error occurred while loading this module. Please try reloading the page.
            </p>
          </div>
          {this.state.error && (
            <pre className="text-[10px] text-red-400/70 bg-red-500/10 border border-red-500/20 rounded p-2.5 max-w-full overflow-auto max-h-24 w-full font-mono leading-tight">
              {this.state.error.toString()}
            </pre>
          )}
          <Button variant="outline" size="sm" onClick={this.handleReset}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
