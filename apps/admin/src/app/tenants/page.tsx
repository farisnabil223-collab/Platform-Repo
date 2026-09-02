'use client';

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent, Badge } from '@eduverse/ui';

export default function AdminTenantsPage() {
  const [tab, setTab] = React.useState<'SCHOOLS' | 'FACULTIES' | 'CAMPUSES'>('SCHOOLS');

  const schools = [
    { id: '1', name: 'University of Algebra', campus: 'North Campus', status: 'ACTIVE' },
    { id: '2', name: 'College of Physics', campus: 'South Campus', status: 'ACTIVE' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Tenant Registry Hub"
      pageDescription="Configure institutional boundaries, campuses, schools, and academic semesters."
    >
      <div className="flex flex-col gap-6 max-w-4xl select-none">
        {/* Sub-tabs switcher */}
        <div className="flex gap-2 pb-2 border-b border-border/40 overflow-x-auto">
          {(['SCHOOLS', 'FACULTIES', 'CAMPUSES'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted/10 border border-border/40 text-muted-foreground hover:bg-muted/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content lists */}
        <div className="grid md:grid-cols-2 gap-4">
          {schools.map((sch) => (
            <Card key={sch.id} className="bg-card border border-border/60 hover:border-primary/20 transition-all">
              <CardHeader>
                <CardTitle className="text-card-foreground text-xs font-bold font-heading">{sch.name}</CardTitle>
                <span className="text-[10px] text-muted-foreground">{sch.campus}</span>
              </CardHeader>
              <CardContent className="flex justify-between items-center border-t border-border/40 pt-3">
                <span className="text-[10px] text-muted-foreground">Status</span>
                <Badge variant="success">{sch.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
