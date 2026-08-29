'use client';
/* eslint-disable no-undef */

import React from 'react';
import {
  PortalLayout,
  Button,
  Icon,
} from '@eduverse/ui';

export default function TeacherGradebookPage() {
  const [search, setSearch] = React.useState('');
  const [roster, setRoster] = React.useState<any[]>([
    { id: 's1', name: 'Sophia Johnson', email: 'student@eduverse.com', math101: 95, phys202: 88 },
    { id: 's2', name: 'Liam Davies', email: 'liam.davies@eduverse.com', math101: 82, phys202: 90 },
  ]);

  const handleBulkEdit = (studentId: string, courseKey: string, val: string) => {
    const num = parseInt(val) || 0;
    setRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, [courseKey]: num } : s))
    );
  };

  const handleExportCSV = () => {
    const headers = 'Name,Email,Calculus I,Quantum Physics\n';
    const rows = roster.map((s) => `${s.name},${s.email},${s.math101},${s.phys202}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gradebook_export.csv';
    link.click();
  };

  const filtered = roster.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Standalone Faculty Gradebook"
      pageDescription="Perform bulk grade changes, lookup student transcript matrix tables, and export reports."
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center select-none pb-4 border-b border-border/40">
        <div className="relative flex-grow max-w-md w-full">
          <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name..."
            className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="text-xs h-9 px-4 gap-1.5 shrink-0"
        >
          Export CSV Log
        </Button>
      </div>

      <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
        <table className="w-full text-xs text-left border-collapse select-none">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Calculus I (MATH-101)</th>
              <th className="py-3 px-4">Quantum Physics (PHYS-202)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/30 hover:bg-muted/15">
                <td className="py-3 px-4 font-semibold text-foreground">
                  <div>
                    <span className="block font-bold">{s.name}</span>
                    <span className="text-[10px] text-muted-foreground">{s.email}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={s.math101}
                    onChange={(e) => handleBulkEdit(s.id, 'math101', e.target.value)}
                    className="w-20 p-1.5 bg-muted/20 border border-input rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={s.phys202}
                    onChange={(e) => handleBulkEdit(s.id, 'phys202', e.target.value)}
                    className="w-20 p-1.5 bg-muted/20 border border-input rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
