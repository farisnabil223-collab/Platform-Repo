'use client';
 

import React from 'react';
import { PortalLayout, Badge } from '@eduverse/ui';

export default function AdminJobsPage() {
  const jobs = [
    { id: 'job-901', name: 'Parent Profile CSV Bulk Import', queue: 'IMPORT_QUEUE', status: 'COMPLETED', progress: '100%' },
    { id: 'job-902', name: 'Monthly Financial Tuition Report Export', queue: 'EXPORT_QUEUE', status: 'PROCESSING', progress: '42%' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Background Queues & Jobs"
      pageDescription="Monitor import/export routines, track pending transaction queues, and verify retry tasks."
    >
      <div className="flex flex-col gap-4 select-none max-w-4xl">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-card-foreground font-heading">{job.name}</h4>
                <Badge variant={job.status === 'COMPLETED' ? 'success' : 'warning'}>{job.status}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Queue: <strong>{job.queue}</strong> • Progress: {job.progress}</p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground font-bold">{job.id}</span>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
