'use client';
/* eslint-disable no-undef */

import React from 'react';
import { PortalLayout, StatisticWidget, Badge } from '@eduverse/ui';
import { linkedChildren } from '../../../services/parentData';

export default function ParentAttendancePage() {
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

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Attendance Logs & Warnings"
      pageDescription="Verify class check-in entries, consecutive absence counts, and school holiday logs."
    >
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="p-4 bg-card border border-border/60 rounded-xl flex items-center justify-between select-none shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Child Context Selector:</span>
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

        <div className="grid md:grid-cols-3 gap-6 select-none">
          <StatisticWidget
            title="Attendance Ratio"
            value={activeChild?.attendanceRate}
            description="Target threshold: 90%"
            trend={{ value: activeChild?.attendanceRate > '90%' ? 'Safe' : 'Critical', type: activeChild?.attendanceRate > '90%' ? 'up' : 'down' }}
          />

          <StatisticWidget
            title="Absence Sessions"
            value={activeChild?.absenceCount.toString()}
            description="Excludes medical leaves."
            trend={{ value: 'Unexcused', type: 'neutral' }}
          />

          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Absence Warning</span>
              <h3 className="text-lg font-black font-heading mt-1">
                {activeChild?.absenceCount >= 5 ? (
                  <Badge variant="error">High Risk Status</Badge>
                ) : (
                  <Badge variant="success">Safe Standing</Badge>
                )}
              </h3>
            </div>
            <span className="text-[9px] text-muted-foreground mt-2 block">Weekly logs refreshed dynamically from NestJS.</span>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
