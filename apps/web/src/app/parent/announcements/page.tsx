'use client';
 

import React from 'react';
import { PortalLayout, Badge } from '@eduverse/ui';

export default function ParentAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState([
    { id: '1', title: 'Emergency Parent Conference', category: 'EMERGENCY', date: 'Today at 09:00 AM', message: 'Urgent parent-teacher review requested for Grade 8 dependents.', read: false },
    { id: '2', title: 'Physical Education Handbook Update', category: 'ADMINISTRATIVE', date: 'July 25, 2026', message: 'Verify new health/safety waiver updates prior to athletic semester starting.', read: true },
  ]);

  const handleMarkRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const unreadCount = announcements.filter((a) => !a.read).length;

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Notice Board Bulletins"
      pageDescription="Verify circular announcements and priority notifications from instructors and administrators."
    >
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Unread Indicator */}
        <div className="flex items-center gap-2 select-none">
          <span className="text-xs font-bold text-muted-foreground">Unread notices:</span>
          <span className="h-5 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">
            {unreadCount}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => handleMarkRead(ann.id)}
              className={`p-4 border rounded-xl flex flex-col gap-2 transition-all cursor-pointer select-none ${
                ann.read ? 'bg-card border-border/60' : 'bg-muted/10 border-primary/40 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-card-foreground font-heading">{ann.title}</h4>
                  <Badge variant={ann.category === 'EMERGENCY' ? 'error' : 'info'}>{ann.category}</Badge>
                </div>
                <span className="text-[9px] text-muted-foreground">{ann.date}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">{ann.message}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
