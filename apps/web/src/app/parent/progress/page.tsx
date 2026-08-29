'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent } from '@eduverse/ui';
import { linkedChildren } from '../../../services/parentData';

export default function ParentProgressPage() {
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
      pageTitle="Academic Progress Reports"
      pageDescription="Monitor class syllabi, completed video lectures, and study times."
    >
      <div className="flex flex-col gap-6 max-w-3xl">
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

        <Card className="bg-card border border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-card-foreground font-heading">Course Progression Metrics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 select-none">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-card-foreground font-heading">Calculus III (Honors)</span>
                <span className="text-primary font-heading">88% Completed</span>
              </div>
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-card-foreground font-heading">Introduction to Physics</span>
                <span className="text-primary font-heading">72% Completed</span>
              </div>
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '72%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
