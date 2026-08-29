import * as React from 'react';
import { logger } from '../utils/logger';

// 1. Hook to track page loading performance timings
export function usePageLoadTiming(pageName: string) {
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Wait until load event finishes to fetch full timings
    const handleLoad = () => {
      setTimeout(() => {
        const [entry] = window.performance.getEntriesByType('navigation') as any[];
        if (entry) {
          const loadTime = entry.loadEventEnd - entry.startTime;
          const domReady = entry.domContentLoadedEventEnd - entry.startTime;
          
          logger.info(`[Telemetry] Page: "${pageName}" | Load Time: ${loadTime.toFixed(2)}ms | DOM Ready: ${domReady.toFixed(2)}ms`);
        }
      }, 0);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [pageName]);
}

// 2. Hook to track user click interactions on elements
export function useInteractionTracker() {
  const trackClick = React.useCallback((elementName: string, meta?: Record<string, any>) => {
    logger.info(`[Telemetry] Interaction: Clicked "${elementName}"`, meta || {});
    // Here we can forward to application insights or custom datadog collector in future sprints
  }, []);

  return { trackClick };
}
