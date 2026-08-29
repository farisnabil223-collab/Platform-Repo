'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import {
  PortalLayout,
  Icon,
  Button,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockAnnouncements } from '../../../services/studentData';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    studentService.getAnnouncements().then((data) => {
      // Map API result to UI structure, fallback to mock if empty
      const items = data.length > 0 ? data.map((ann: any) => ({
        id: ann.id,
        title: ann.title,
        content: ann.content,
        pinned: ann.pinned ?? false,
        read: ann.read ?? false,
        date: ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'Today',
        author: ann.author?.name || 'Faculty Office',
      })) : mockAnnouncements;

      setAnnouncements(items);
      setLoading(false);
    });
  }, []);

  const handleMarkAllRead = () => {
    setAnnouncements((prev) => prev.map((ann) => ({ ...ann, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setAnnouncements((prev) => prev.map((ann) => {
      if (ann.id === id) {
        return { ...ann, read: !ann.read };
      }
      return ann;
    }));
  };

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Academic Announcements Bulletin"
      pageDescription="Access campus circulars, syllabus shift notices, and exam slots schedules."
      headerActions={
        <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs" disabled={loading}>
          Mark All as Read
        </Button>
      }
    >
      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-card border border-border/30 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 select-none">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 bg-card border rounded-xl shadow-sm transition-all flex flex-col gap-3 relative ${
                ann.pinned ? 'border-primary/40 bg-gradient-to-r from-primary/5 to-transparent' : 'border-border/60'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                  {ann.pinned && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Pinned
                    </span>
                  )}
                  {!ann.read && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Unread Notice" />
                  )}
                  <h4 className="text-sm font-bold text-foreground font-heading">{ann.title}</h4>
                </div>
                <span className="text-[10px] text-muted-foreground">{ann.date}</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>

              <div className="flex justify-between items-center border-t border-border/30 pt-3 mt-1 text-[10px] text-muted-foreground">
                <span>Published by: {ann.author}</span>
                <button onClick={() => handleToggleRead(ann.id)} className="hover:text-foreground hover:underline font-bold">
                  {ann.read ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
