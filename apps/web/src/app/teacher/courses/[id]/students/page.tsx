'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, Icon, Badge } from '@eduverse/ui';

export default function CourseStudentsTab() {
  const params = useParams();
  const courseId = params.id as string;

  const roster = [
    { id: '1', name: 'Sophia Johnson', email: 'student@eduverse.com', grade: 'A-', attendance: '98%', riskLevel: 'LOW' },
    { id: '2', name: 'Liam Davies', email: 'liam.davies@eduverse.com', grade: 'B', attendance: '92%', riskLevel: 'LOW' },
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Student Roster & Grades</h4>
      </div>

      <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Average Grade</th>
              <th className="py-3 px-4">Risk Status</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((student) => (
              <tr key={student.id} className="border-b border-border/30 hover:bg-muted/15">
                <td className="py-3 px-4 font-semibold text-foreground">
                  <div>
                    <span className="block font-bold">{student.name}</span>
                    <span className="text-[10px] text-muted-foreground">{student.email}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{student.attendance}</td>
                <td className="py-3 px-4 font-black text-primary font-heading">{student.grade}</td>
                <td className="py-3 px-4">
                  <Badge variant={student.riskLevel === 'LOW' ? 'success' : 'error'}>{student.riskLevel}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
