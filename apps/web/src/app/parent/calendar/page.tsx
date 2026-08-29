'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, CalendarWidget } from '@eduverse/ui';

export default function ParentCalendarPage() {
  const events = [
    { id: '1', title: 'Calculus Worksheet 4 Due', date: '2026-08-07', category: 'DEADLINE' },
    { id: '2', title: 'Midterm Science Exam', date: '2026-08-15', category: 'EXAM' },
  ];

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Guardian Calendar Schedule"
      pageDescription="Access class test dates, assignment due guidelines, and parent-teacher meetings."
    >
      <div className="max-w-3xl">
        <CalendarWidget />
      </div>
    </PortalLayout>
  );
}
