'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent, ChartWidget } from '@eduverse/ui';
import { linkedChildren } from '../../../services/parentData';

export default function ParentGradesPage() {
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

  const gpaProgress = [
    { label: 'Term 1', value: 3.5 },
    { label: 'Term 2', value: 3.7 },
    { label: 'Term 3', value: 3.8 },
    { label: 'Current', value: parseFloat(activeChild?.gpa || '3.5') },
  ];

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Academic Performance Grades"
      pageDescription="Verify quizzes, final exams averages, and cumulative GPAs progress trackers."
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
          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Current Term GPA</span>
            <span className="text-xl font-black text-primary font-heading mt-1">{activeChild?.gpa}</span>
          </div>

          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Cumulative GPA Index</span>
            <span className="text-xl font-black text-card-foreground font-heading mt-1">{activeChild?.overallGPA}</span>
          </div>

          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Grade Status Warning</span>
            <span className="text-xl font-black text-teal font-heading mt-1">Excellent Standing</span>
          </div>
        </div>

        <ChartWidget
          title="GPA Progression History"
          type="line"
          data={gpaProgress}
        />
      </div>
    </PortalLayout>
  );
}
