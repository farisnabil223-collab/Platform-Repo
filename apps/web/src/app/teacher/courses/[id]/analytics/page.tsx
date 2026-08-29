'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { ChartWidget } from '@eduverse/ui';

export default function CourseAnalyticsTab() {
  const params = useParams();
  const courseId = params.id as string;

  const distribution = [
    { label: 'A', value: 3 },
    { label: 'B', value: 8 },
    { label: 'C', value: 4 },
    { label: 'D', value: 0 },
    { label: 'F', value: 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Performance Analytics</h4>
      </div>

      <ChartWidget
        title="Grade Distribution Matrix"
        type="bar"
        data={distribution}
      />
    </div>
  );
}
