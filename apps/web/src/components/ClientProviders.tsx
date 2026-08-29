/* eslint-disable no-undef */
'use client';

import * as React from 'react';
import { AppProviders } from '@eduverse/ui';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const isExtensionError = (errMsg?: string, fileSrc?: string) => {
      const msg = String(errMsg || '');
      const src = String(fileSrc || '');
      return (
        msg.includes('MetaMask') ||
        msg.includes('nkbihfbeogaeaoehlefnkodbefgpggknn') ||
        src.includes('chrome-extension:')
      );
    };

    const handleWindowError = (event: ErrorEvent) => {
      if (isExtensionError(event.message, event.filename)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason ? event.reason.message || String(event.reason) : '';
      if (isExtensionError(reason)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleWindowError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    return () => {
      window.removeEventListener('error', handleWindowError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return (
    <div suppressHydrationWarning>
      <AppProviders>{children}</AppProviders>
    </div>
  );
}
