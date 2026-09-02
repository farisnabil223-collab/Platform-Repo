'use client';

import React from 'react';
import { PortalLayout, Badge, Button } from '@eduverse/ui';

export default function AdminMediaPage() {
  const [assets, setAssets] = React.useState([
    { id: '1', title: 'geometry_lecture_slides.pdf', type: 'PDF', size: '1.2 MB', status: 'READY' },
    { id: '2', title: 'calculus_derivatives_intro.mp4', type: 'VIDEO', size: '48.5 MB', status: 'READY' },
  ]);

  const handleSoftDeleteToggle = (id: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'READY' ? 'ARCHIVED' : 'READY';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Media Storage Registry"
      pageDescription="Verify storage allocations, inspect bandwidth statistics, and soft-delete/restore assets."
    >
      <div className="flex flex-col gap-6 select-none max-w-4xl">
        <div className="p-5 bg-card border border-border/60 rounded-xl flex justify-between items-center select-none shadow-sm">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Global Storage Used</span>
            <span className="text-xl font-black text-card-foreground font-heading mt-1">49.7 MB / 100 GB</span>
          </div>
          <span className="text-xs text-teal font-bold bg-teal/10 px-3 py-1 rounded font-heading">Optimal Uptime</span>
        </div>

        {/* Media Asset List */}
        <div className="flex flex-col gap-3">
          {assets.map((a) => (
            <div key={a.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-card-foreground font-heading">{a.title}</h4>
                  <Badge variant={a.status === 'READY' ? 'success' : 'error'}>{a.status}</Badge>
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 block">{a.type} • {a.size}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSoftDeleteToggle(a.id)}
                className={`text-[10px] h-8 px-3 ${a.status === 'READY' ? 'text-destructive border-destructive/30 hover:bg-destructive/10 font-bold' : 'text-teal border-teal/30 hover:bg-teal/10 font-bold'}`}
              >
                {a.status === 'READY' ? 'Soft Delete' : 'Restore'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
