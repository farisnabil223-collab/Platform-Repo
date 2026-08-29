'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon, Badge } from '@eduverse/ui';

export default function CourseExamsTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [exams, setExams] = React.useState<any[]>([
    { id: 'e1', title: 'Calculus Midterm Exam', date: '2026-08-10', time: '10:00 - 12:00', location: 'Auditorium B', status: 'PUBLISHED', instructions: ['Bring calculators', 'No phone logs'] },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center select-none pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Midterms & Final Exams</h4>
        <Button variant="primary" size="sm" className="text-xs h-9 px-4 gap-1">
          <span className="font-bold">+</span> Create Exam
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {exams.map((e) => (
          <div key={e.id} className="p-5 bg-card border border-border/60 rounded-xl shadow-sm flex justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                  {e.location}
                </span>
                <Badge variant="success">{e.status}</Badge>
              </div>
              <h4 className="text-sm font-bold text-foreground font-heading mt-1">{e.title}</h4>
              <span className="text-[10px] text-muted-foreground mt-1 block">Scheduled: {e.date} | Duration: {e.time}</span>
            </div>

            <button className="text-primary hover:underline font-bold text-xs">Verify Room</button>
          </div>
        ))}
      </div>
    </div>
  );
}
