'use client';
 

import React from 'react';
import { PortalLayout, CalendarWidget } from '@eduverse/ui';

export default function AdminSchedulePage() {
  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Academic Calendars & Scheduling"
      pageDescription="Allocate teaching rooms, coordinate midterm timetables, and monitor holiday schedules."
    >
      <div className="max-w-3xl">
        <CalendarWidget />
      </div>
    </PortalLayout>
  );
}
