'use client';

import React from 'react';
import { PortalLayout, useTheme } from '@eduverse/ui';

export default function ParentSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = React.useState('en');

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="System Configurations"
      pageDescription="Manage application theme preferences and accessibility overrides."
    >
      <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Application Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {['light', 'dark', 'system'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as 'light' | 'dark' | 'system')}
                className={`py-1.5 text-xs rounded border capitalize font-semibold transition-all ${
                  theme === t
                    ? 'bg-primary border-primary text-primary-foreground shadow'
                    : 'border-border/60 hover:bg-muted/30 text-muted-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Language Locale</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
          >
            <option value="en">English (US)</option>
            <option value="es">Español (ES)</option>
          </select>
        </div>
      </div>
    </PortalLayout>
  );
}
