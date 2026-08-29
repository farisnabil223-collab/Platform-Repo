'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import {
  PortalLayout,
  Button,
  Icon,
} from '@eduverse/ui';

export default function TeacherResourcesPage() {
  const [resources, setResources] = React.useState<any[]>([
    { id: '1', name: 'Calculus I Syllabus Draft.pdf', type: 'PDF', size: '1.2MB' },
    { id: '2', name: 'Quantum Physics Lecture Video.mp4', type: 'Video', size: '34MB' },
  ]);

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Faculty Resources Library"
      pageDescription="Access and reference slides, study handouts, and lecture outlines."
    >
      <div className="flex justify-between items-center select-none pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Handouts & Videos</h4>
        <Button variant="primary" className="text-xs h-9 px-4 gap-1">
          <span className="font-bold">+</span> Upload File
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {resources.map((res) => (
          <div key={res.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 select-none hover:border-primary/20 transition-all">
            <div className="flex gap-3 items-center">
              <Icon name="task" size="sm" />
              <div>
                <span className="text-xs font-bold text-foreground font-heading block">{res.name}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">{res.type} | Size: {res.size}</span>
              </div>
            </div>

            <button className="text-primary hover:underline font-bold text-xs shrink-0">Download</button>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
