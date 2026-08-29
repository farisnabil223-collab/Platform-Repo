'use client';

import * as React from 'react';
import { AppProviders } from '@eduverse/ui';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <AppProviders>{children}</AppProviders>
    </div>
  );
}
