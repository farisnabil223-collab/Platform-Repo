import { logger } from '@eduverse/ui';

export const analytics = {
  trackPageView(url: string) {
    logger.info(`[Analytics] Page View: ${url}`);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-MOCK-ID', { page_path: url });
    }
  },
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    logger.info(`[Analytics] Event: ${eventName}`, properties);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  }
};

export default analytics;
