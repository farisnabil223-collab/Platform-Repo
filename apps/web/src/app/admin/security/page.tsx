'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Badge } from '@eduverse/ui';

export default function AdminSecurityPage() {
  const [sessions, setSessions] = React.useState([
    { id: '1', user: 'Marcus Johnson (Guardian)', ip: '192.168.1.42', status: 'ACTIVE', time: 'Just now' },
    { id: '2', user: 'Sophia Johnson (Student)', ip: '192.168.1.103', status: 'ACTIVE', time: '1 hr ago' },
  ]);

  const failedAttempts = [
    { id: '1', user: 'unknown@eduverse.com', ip: '45.12.33.91', date: 'Today at 07:12 AM', reason: 'Invalid password credentials' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Security Governance Center"
      pageDescription="Monitor failed login attempts, audit active browser user sessions, and inspect API rate limit metrics."
    >
      <div className="grid lg:grid-cols-2 gap-6 items-start max-w-5xl select-none">
        {/* Active Sessions */}
        <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
            Active User Browser Sessions
          </h4>
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-3 bg-muted/10 border border-border/40 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold text-card-foreground font-heading">{s.user}</h5>
                  <span className="text-[10px] text-muted-foreground">IP: {s.ip} • Last seen: {s.time}</span>
                </div>
                <Badge variant="success">{s.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Logins */}
        <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
          <h4 className="text-xs font-bold text-destructive uppercase tracking-wider font-heading pb-2 border-b border-border/40">
            Failed Access Logs & Warnings
          </h4>
          <div className="flex flex-col gap-3">
            {failedAttempts.map((f) => (
              <div key={f.id} className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs flex justify-between items-start gap-4">
                <div>
                  <h5 className="font-bold text-card-foreground font-heading">{f.user}</h5>
                  <span className="text-[10px] text-destructive/90 block mt-0.5">{f.reason}</span>
                  <span className="text-[9px] text-muted-foreground mt-1 block">IP: {f.ip} • {f.date}</span>
                </div>
                <Badge variant="error">FAILED</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
