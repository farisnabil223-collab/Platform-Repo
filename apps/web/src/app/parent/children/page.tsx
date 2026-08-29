'use client';
 

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent } from '@eduverse/ui';
import { linkedChildren } from '../../../services/parentData';

export default function ParentChildrenPage() {
  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Children Profiles Directory"
      pageDescription="Inspect grade levels, school class registration, and status details of linked dependents."
    >
      <div className="grid md:grid-cols-2 gap-6 select-none max-w-4xl">
        {linkedChildren.map((c) => (
          <Card key={c.id} className="bg-card border border-border/60 hover:border-primary/20 transition-all">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {c.avatar}
              </div>
              <div>
                <CardTitle className="text-card-foreground text-sm font-bold font-heading">{c.name}</CardTitle>
                <span className="text-[10px] text-muted-foreground">{c.grade} • {c.className}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs border-t border-border/40 pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enrollment Status:</span>
                <span className="font-semibold text-teal">{c.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attendance Ratio:</span>
                <span className="font-semibold text-card-foreground">{c.attendanceRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cumulative GPA:</span>
                <span className="font-semibold text-primary font-heading">{c.gpa}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}
