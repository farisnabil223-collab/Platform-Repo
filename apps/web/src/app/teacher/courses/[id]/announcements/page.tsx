'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Icon } from '@eduverse/ui';

export default function CourseAnnouncementsTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [announcements, setAnnouncements] = React.useState<any[]>([
    { id: '1', title: 'Welcome to Calculus I!', content: 'Please review lesson 1.1 slides before class.', date: 'July 28', author: 'Dr. Emily Watson' },
  ]);

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Broadcast Announcements</h4>
        <Button variant="primary" size="sm" className="text-xs h-9 px-4 gap-1">
          <span className="font-bold">+</span> Create Notice
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="p-5 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center w-full border-b border-border/30 pb-2">
              <h5 className="text-xs font-bold text-foreground font-heading">{ann.title}</h5>
              <span className="text-[9px] text-muted-foreground">{ann.date} by {ann.author}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
