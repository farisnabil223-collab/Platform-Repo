'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, StatisticWidget, QuickActionsWidget, Badge, Card, CardHeader, CardTitle, CardContent } from '@eduverse/ui';
import { linkedChildren, ChildProfile } from '../../../services/parentData';
import Link from 'next/link';

export default function ParentDashboardPage() {
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

  const handleChildChange = (id: string) => {
    setSelectedChildId(id);
    localStorage.setItem('parent_selected_child_id', id);
  };

  const quickActions = [
    { id: 'timeline', label: 'Student Timeline', description: 'Inspect daily activity feeds.', action: () => window.location.href = '/parent/timeline' },
    { id: 'approvals', label: 'Pending Approvals', description: 'Review field trip slips.', action: () => window.location.href = '/parent/approvals' },
  ];

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Guardian Dashboard Console"
      pageDescription="Coordinate academic activities, inspect attendance warnings, and view teacher feedback."
    >
      {/* Child Context Switcher */}
      <div className="p-4 bg-card border border-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {activeChild?.avatar}
          </div>
          <div>
            <h4 className="text-xs font-bold text-muted-foreground">Current Student Context</h4>
            <h3 className="text-sm font-black text-foreground font-heading">{activeChild?.name} ({activeChild?.grade})</h3>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Student:</label>
          <select
            value={selectedChildId}
            onChange={(e) => handleChildChange(e.target.value)}
            className="bg-muted/20 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          >
            {linkedChildren.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Children Overview Widgets */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatisticWidget
          title="Attendance Rate"
          value={activeChild?.attendanceRate}
          description={`${activeChild?.absenceCount} Absences, ${activeChild?.lateCount} Lates.`}
          trend={{ value: activeChild?.attendanceRate > '90%' ? 'Safe' : 'Warning', type: activeChild?.attendanceRate > '90%' ? 'up' : 'down' }}
        />
        <StatisticWidget
          title="Semester GPA"
          value={activeChild?.gpa}
          description={`Overall cumulative: ${activeChild?.overallGPA}`}
          trend={{ value: 'Target 4.0', type: 'neutral' }}
        />
        <StatisticWidget
          title="Missing Homework"
          value={activeChild?.missingAssignments.toString()}
          description="Awaiting student submission."
          trend={{ value: activeChild?.missingAssignments === 0 ? 'Clear' : 'Action Req', type: activeChild?.missingAssignments === 0 ? 'up' : 'down' }}
        />
        <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between select-none">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Risk Status Indicators</span>
            <h3 className="text-lg font-black font-heading mt-1 flex items-center gap-2">
              Academic Risk: 
              <Badge variant={activeChild?.standing === 'LOW' ? 'success' : 'error'}>
                {activeChild?.standing}
              </Badge>
            </h3>
          </div>
          <span className="text-[9px] text-muted-foreground mt-2 block">Standing calculated on recent assignment updates.</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Children Summary Info */}
          <Card className="bg-card border border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground font-heading">Dependent Profiles Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {linkedChildren.map((c) => (
                <div key={c.id} className="p-4 bg-muted/10 border border-border/40 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {c.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground font-heading">{c.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{c.grade} • {c.className}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <div>GPA: <span className="font-bold text-foreground font-heading">{c.gpa}</span></div>
                    <div>Attendance: <span className="font-bold text-teal">{c.attendanceRate}</span></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <QuickActionsWidget actions={quickActions} />
        </div>

        <div className="flex flex-col gap-6 select-none">
          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
              Low Grade Alerts
            </h4>
            {activeChild?.missingAssignments > 0 ? (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex flex-col gap-1">
                <span className="text-xs font-bold text-destructive font-heading">Missing Homework Assignment</span>
                <p className="text-[10px] text-muted-foreground">Homework deadlines passed without submission records.</p>
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground">No recent alerts or academic flags.</span>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
