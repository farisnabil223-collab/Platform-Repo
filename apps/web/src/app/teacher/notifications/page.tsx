'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Badge } from '@eduverse/ui';

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = React.useState<any[]>([
    { id: '1', title: 'Assignment Submitted', message: 'Sophia Johnson uploaded Calculus assignment workbook.', date: '1 hr ago', priority: 'HIGH' },
    { id: '2', title: 'Quiz Completed', message: 'Liam Davies completed the Calculus Quiz 1 attempt.', date: '3 hrs ago', priority: 'MEDIUM' },
  ]);

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Priority Alert notifications"
      pageDescription="Verify students submissions notices and messaging inbox alerts."
    >
      <div className="flex flex-col gap-3 select-none">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-start gap-4 hover:border-primary/20 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-xs font-bold text-foreground font-heading">{n.title}</h5>
                <Badge variant={n.priority === 'HIGH' ? 'error' : 'info'}>{n.priority}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">{n.message}</p>
            </div>
            <span className="text-[9px] text-muted-foreground shrink-0">{n.date}</span>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
