'use client';

import React from 'react';
import { PortalLayout, Badge } from '@eduverse/ui';

export default function AdminSupportPage() {
  const tickets = [
    { id: 'TCK-201', sender: 'Marcus Johnson', category: 'BUG_REPORT', title: 'Invoice payment gateway throws 502 error', status: 'OPEN', sla: 'SLA: 4 hrs remaining' },
    { id: 'TCK-202', sender: 'Sophia Johnson', category: 'SUPPORT_TICKET', title: 'Cannot access physics module slide handouts', status: 'CLOSED', sla: 'SLA: Resolved on-time' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Support Queue & Bug Reports"
      pageDescription="Verify portal feedback logs, coordinate ticketing resolutions, and audit SLA performance compliance metrics."
    >
      <div className="flex flex-col gap-4 select-none max-w-4xl">
        {tickets.map((t) => (
          <div key={t.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-card-foreground font-heading">{t.title}</h4>
                <Badge variant={t.status === 'OPEN' ? 'warning' : 'success'}>{t.status}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Sender: <strong>{t.sender}</strong> • {t.category}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-primary block font-mono font-heading">{t.sla}</span>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
