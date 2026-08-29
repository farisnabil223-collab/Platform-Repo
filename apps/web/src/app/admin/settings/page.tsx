'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Button } from '@eduverse/ui';

export default function AdminSettingsPage() {
  const [flags, setFlags] = React.useState([
    { id: '1', name: 'AI Teaching Assistant Console', scope: 'TENANT', active: true },
    { id: '2', name: 'Live Video Streaming Handouts', scope: 'GLOBAL', active: false },
  ]);

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="System Configurations & Feature Flags"
      pageDescription="Manage localization settings, define storage providers, and deploy progressive feature flag rollouts."
    >
      <div className="flex flex-col gap-6 max-w-2xl select-none">
        {/* Feature Flags Editor */}
        <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
            Progressive Feature Flag Scopes
          </h4>
          <div className="flex flex-col gap-3">
            {flags.map((flag) => (
              <div key={flag.id} className="flex justify-between items-center p-3 bg-muted/10 border border-border/40 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-card-foreground font-heading">{flag.name}</span>
                  <span className="text-[9px] text-primary font-heading block mt-0.5">Scope: {flag.scope}</span>
                </div>
                <button
                  onClick={() => toggleFlag(flag.id)}
                  className={`px-3 py-1 text-[10px] font-bold rounded transition-all font-heading ${
                    flag.active ? 'bg-teal/20 text-teal' : 'bg-destructive/20 text-destructive'
                  }`}
                >
                  {flag.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
