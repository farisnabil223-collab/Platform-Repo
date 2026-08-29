'use client';
 

import React from 'react';
import { PortalLayout } from '@eduverse/ui';

export default function AdminAuditPage() {
  const [selectedLogId, setSelectedLogId] = React.useState<string | null>(null);

  const logs = [
    { id: '1', actor: 'Dr. Emily Watson', action: 'GRADE_CHANGED', entity: 'AssignmentGrade', date: '10:14 AM', traceId: 'tr-827-x92', before: 'Grade: B (82)', after: 'Grade: A- (91)' },
    { id: '2', actor: 'Admin User', action: 'TENANT_UPDATED', entity: 'Tenant', date: '09:30 AM', traceId: 'tr-911-m12', before: 'Status: DRAFT', after: 'Status: ACTIVE' },
  ];

  const selectedLog = logs.find((l) => l.id === selectedLogId);

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="System Security Audit Center"
      pageDescription="Inspect low-level schema diff changes, map actor identifiers, and track API request traces."
    >
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Timeline Log List */}
        <div className="lg:col-span-2 flex flex-col gap-3 select-none">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLogId(log.id)}
              className={`p-4 border rounded-xl flex justify-between items-start transition-all cursor-pointer ${
                selectedLogId === log.id ? 'bg-muted/10 border-primary/40' : 'bg-card border-border/60 hover:border-primary/20'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-card-foreground font-heading">{log.action}</h4>
                  <span className="text-[9px] text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded font-heading">{log.traceId}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Actor: <strong>{log.actor}</strong> • Entity: {log.entity}</p>
              </div>
              <span className="text-[9px] text-muted-foreground mt-0.5">{log.date}</span>
            </div>
          ))}
        </div>

        {/* Entity Diff Viewer Panel */}
        <div className="lg:col-span-1 p-5 bg-card border border-border/60 rounded-xl select-none">
          {selectedLog ? (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-card-foreground font-heading">Entity Diff Analyzer</h4>
                <span className="text-[9px] text-muted-foreground block mt-0.5">Trace Context: {selectedLog.traceId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-border/40">
                <div className="p-2 bg-destructive/10 border border-destructive/30 rounded flex flex-col">
                  <span className="font-bold text-destructive font-heading block mb-1">Before State:</span>
                  <span className="text-foreground font-mono">{selectedLog.before}</span>
                </div>
                <div className="p-2 bg-teal/10 border border-teal/30 rounded flex flex-col">
                  <span className="font-bold text-teal font-heading block mb-1">After State:</span>
                  <span className="text-foreground font-mono">{selectedLog.after}</span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Select an audit log row to inspect structural entity diffs.</span>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
