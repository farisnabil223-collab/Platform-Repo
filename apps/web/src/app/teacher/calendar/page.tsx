'use client';
 

import React from 'react';
import { PortalLayout, CalendarWidget } from '@eduverse/ui';

export default function TeacherCalendarPage() {
  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Academic Teaching Schedule"
      pageDescription="Verify class rooms slot times, midterms deadlines, and university calendar logs."
    >
      <div className="max-w-md">
        <CalendarWidget />
      </div>
    </PortalLayout>
  );
}
