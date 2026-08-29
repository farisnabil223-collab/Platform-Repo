'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout } from '@eduverse/ui';
import { linkedChildren, mockTimelineEvents } from '../../../services/parentData';

export default function ParentTimelinePage() {
  const [selectedChildId, setSelectedChildId] = React.useState<string>('');

  React.useEffect(() => {
    const saved = localStorage.getItem('parent_selected_child_id');
    if (saved && linkedChildren.some((c) => c.id === saved)) {
      setSelectedChildId(saved);
    } else {
      setSelectedChildId(linkedChildren[0].id);
    }
  }, []);

  const activeChild = React.useMemo(() => {
    return linkedChildren.find((c) => c.id === selectedChildId) || linkedChildren[0];
  }, [selectedChildId]);

  const events = React.useMemo(() => {
    return (mockTimelineEvents as any)[selectedChildId] || [];
  }, [selectedChildId]);

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Unified Student Activity Timeline"
      pageDescription="Inspect hourly school updates, lesson completions, and grading logs."
    >
      <div className="max-w-2xl flex flex-col gap-6">
        {/* Selector */}
        <div className="p-4 bg-card border border-border/60 rounded-xl flex items-center justify-between select-none shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Timeline for:</span>
          <select
            value={selectedChildId}
            onChange={(e) => {
              setSelectedChildId(e.target.value);
              localStorage.setItem('parent_selected_child_id', e.target.value);
            }}
            className="bg-muted/20 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          >
            {linkedChildren.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Timeline Log */}
        <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-6 select-none relative">
          <div className="absolute left-[37px] top-6 bottom-6 w-0.5 bg-border/40"></div>

          {events.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-6">No timeline events logged for today.</div>
          ) : (
            events.map((ev: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-start relative z-10">
                <div className="text-xs font-bold text-muted-foreground w-10 shrink-0 text-right mt-1.5">{ev.time}</div>
                <div className="h-5 w-5 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-[9px] shrink-0 mt-1">
                  ✓
                </div>
                <div className="flex-1 p-3 bg-muted/15 border border-border/20 rounded-lg">
                  <h4 className="text-xs font-bold text-card-foreground font-heading">{ev.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{ev.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
