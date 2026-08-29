'use client';

import * as React from 'react';
import { ThemeProvider } from '../components/ThemeSwitcher/ThemeSwitcher';
import { LanguageProvider } from '../components/LanguageSwitcher/LanguageSwitcher';
import { ToastProvider } from '../components/Toast/Toast';
import { GlobalStoreProvider } from '../context/GlobalStore';
import { FeatureFlagProvider } from '../context/FeatureFlag';

// TanStack Query Cache Provider Placeholder
export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Future AI Services Provider Placeholder
export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <GlobalStoreProvider>
          <FeatureFlagProvider>
            <ToastProvider>
              <QueryProvider>
                <AIProvider>
                  {children}
                </AIProvider>
              </QueryProvider>
            </ToastProvider>
          </FeatureFlagProvider>
        </GlobalStoreProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};
export default AppProviders;
