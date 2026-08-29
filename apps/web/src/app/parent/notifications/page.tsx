'use client';
 

import React from 'react';
import { PortalLayout, Badge } from '@eduverse/ui';

export default function ParentNotificationsPage() {
  const [filter, setFilter] = React.useState<string>('ALL');

  const notifications = [
    { id: '1', title: 'Grade Released', category: 'ACADEMIC', message: 'Sophia scored 94% on Calculus Worksheet 4.', priority: 'MEDIUM', date: '2 hrs ago' },
    { id: '2', title: 'Absence Incident Warning', category: 'ATTENDANCE', message: 'Liam missed the morning homeroom check-in period.', priority: 'HIGH', date: 'Today at 08:45 AM' },
  ];

  const filtered = notifications.filter((n) => filter === 'ALL' || n.category === filter);

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Activity Notifications Feed"
      pageDescription="Verify behavioral warnings, attendance logs, and academic updates."
    >
      <div className="flex flex-col gap-6 max-w-3xl select-none">
        {/* Filters */}
        <div className="flex gap-2 pb-2 border-b border-border/40 overflow-x-auto">
          {['ALL', 'ACADEMIC', 'ATTENDANCE', 'BEHAVIOR', 'EMERGENCY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted/10 border border-border/40 text-muted-foreground hover:bg-muted/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Logs */}
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <div key={n.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-start gap-4 hover:border-primary/20 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-card-foreground font-heading">{n.title}</h5>
                  <Badge variant={n.priority === 'HIGH' ? 'error' : 'info'}>{n.category}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{n.message}</p>
              </div>
              <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{n.date}</span>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
