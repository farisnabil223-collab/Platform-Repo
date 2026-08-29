'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent, Badge } from '@eduverse/ui';
import { linkedChildren } from '../../../services/parentData';

export default function ParentAssignmentsPage() {
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
      pageTitle="Assignments Overview"
      pageDescription="Verify upcoming school deadlines, submission states, and review instructor feedback remarks."
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

        <div className="flex flex-col gap-3 select-none">
          <div className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-start gap-4 hover:border-primary/20 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-card-foreground font-heading">Calculus Worksheet 4: Integral Theorems</h4>
                <Badge variant="success">Submitted</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Due Date: Friday, August 7 • Attempt 1</p>
              <div className="p-2.5 bg-muted/15 border border-border/30 rounded mt-3 text-[10px] text-foreground">
                <strong>Feedback from Emily Watson:</strong> Solid derivation workflow. Proof notation is fully correct.
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-muted-foreground block">Grade Issued</span>
              <span className="text-sm font-black text-primary font-heading">94/100 (A)</span>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
