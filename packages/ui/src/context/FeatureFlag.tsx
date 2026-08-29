'use client';

import * as React from 'react';

export interface FeatureFlags {
  enableAiChat: boolean;
  enableAnalyticsDashboard: boolean;
  enableSyllabusBuilderV2: boolean;
  enableBillingStripe: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableAiChat: process.env.NEXT_PUBLIC_FF_AI_CHAT ? process.env.NEXT_PUBLIC_FF_AI_CHAT === 'true' : process.env.NODE_ENV !== 'production',
  enableAnalyticsDashboard: process.env.NEXT_PUBLIC_FF_ANALYTICS === 'true' || false,
  enableSyllabusBuilderV2: process.env.NEXT_PUBLIC_FF_SYLLABUS_V2 === 'true' || false,
  enableBillingStripe: process.env.NEXT_PUBLIC_FF_BILLING_STRIPE === 'true' || false,
};

export interface FeatureFlagState {
  flags: FeatureFlags;
  setOverride: (flag: keyof FeatureFlags, value: boolean) => void;
  clearOverrides: () => void;
}

const FeatureFlagContext = React.createContext<FeatureFlagState | undefined>(undefined);

export function useFeatureFlag(name: keyof FeatureFlags): boolean {
  const context = React.useContext(FeatureFlagContext);
  if (!context) throw new Error('useFeatureFlag must be used within FeatureFlagProvider');
  return context.flags[name];
}

export function useFeatureFlagsConfig() {
  const context = React.useContext(FeatureFlagContext);
  if (!context) throw new Error('useFeatureFlagsConfig must be used within FeatureFlagProvider');
  return context;
}

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = React.useState<FeatureFlags>(DEFAULT_FLAGS);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eduverse-ff-overrides');
      if (stored) {
        try {
          const overrides = JSON.parse(stored);
          setFlags((prev) => ({ ...prev, ...overrides }));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const setOverride = (flag: keyof FeatureFlags, value: boolean) => {
    setFlags((prev) => {
      const updated = { ...prev, [flag]: value };
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('eduverse-ff-overrides') || '{}';
        try {
          const overrides = JSON.parse(stored);
          overrides[flag] = value;
          localStorage.setItem('eduverse-ff-overrides', JSON.stringify(overrides));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  const clearOverrides = () => {
    localStorage.removeItem('eduverse-ff-overrides');
    setFlags(DEFAULT_FLAGS);
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, setOverride, clearOverrides }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
export default FeatureFlagProvider;
