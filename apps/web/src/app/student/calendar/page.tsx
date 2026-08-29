'use client';
 

import React from 'react';
import {
  PortalLayout,
  Icon,
  Calendar,
} from '@eduverse/ui';

export default function StudentCalendarPage() {
  const events = [
    { id: '1', date: '2026-07-29', title: 'Calculus I Lecture', time: '09:00', type: 'class' },
    { id: '2', date: '2026-07-29', title: 'Quantum Physics Lab', time: '14:00', type: 'class' },
    { id: '3', date: '2026-08-05', title: 'Calculus Definite Integrals Due', time: '23:59', type: 'deadline' },
    { id: '4', date: '2026-08-10', title: 'Schrödinger Homework Submission', time: '23:59', type: 'deadline' },
    { id: '5', date: '2026-08-12', title: 'Midterm Exam: Calculus I', time: '09:00', type: 'exam' },
  ];

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Academic Schedule & Calendar"
      pageDescription="Trace lecture times, homework deadlines, and midterm rooms slots."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Monthly Grid */}
        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-xl shadow-sm flex items-center justify-center">
          <Calendar value={new Date()} />
        </div>

        {/* Right Side: Events Feed */}
        <div className="lg:col-span-1 flex flex-col gap-4 select-none">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
            Schedule Events & Deadlines
          </h4>
          <div className="flex flex-col gap-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 rounded-lg bg-card border border-border/60 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground font-heading">{ev.title}</span>
                  <Badge variant={ev.type === 'exam' ? 'danger' : ev.type === 'deadline' ? 'warning' : 'info'}>
                    {ev.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                  <Icon name="clock" size="sm" />
                  <span>{ev.date} at {ev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

// Simple internal Badge component for convenience in local scopes
const Badge: React.FC<{ children: React.ReactNode; variant: 'info' | 'warning' | 'danger' }> = ({ children, variant }) => {
  const styles = {
    info: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};
