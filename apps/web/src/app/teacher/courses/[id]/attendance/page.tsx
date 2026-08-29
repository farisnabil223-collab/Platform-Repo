'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Icon, Badge } from '@eduverse/ui';

export default function CourseAttendanceTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [sessions, setSessions] = React.useState<any[]>([
    { id: 'att-1', date: '2026-07-28', presentCount: 22, absentCount: 2 },
  ]);

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Attendance Sessions</h4>
        <Button variant="primary" size="sm" className="text-xs h-9 px-4 gap-1">
          <span className="font-bold">+</span> Generate Session
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map((s) => (
          <div key={s.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all">
            <div>
              <h5 className="text-xs font-bold text-foreground font-heading">Session Date: {s.date}</h5>
              <div className="flex gap-4 text-[10px] text-muted-foreground mt-1">
                <span>Present: <strong className="text-emerald-500">{s.presentCount}</strong></span>
                <span>Absent: <strong className="text-red-500">{s.absentCount}</strong></span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="text-primary hover:underline font-bold text-xs">Verify List</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
