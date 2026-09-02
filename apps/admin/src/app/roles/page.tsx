'use client';

import React from 'react';
import { PortalLayout } from '@eduverse/ui';

export default function AdminRolesPage() {
  const [matrix] = React.useState([
    { role: 'TEACHER', viewGrades: true, editGrades: true, manageCourses: true },
    { role: 'STUDENT', viewGrades: true, editGrades: false, manageCourses: false },
    { role: 'PARENT', viewGrades: true, editGrades: false, manageCourses: false },
  ]);

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="RBAC Permissions Matrix"
      pageDescription="Edit and deploy role hierarchy privileges across the entire workspace."
    >
      <div className="overflow-x-auto border border-border/60 rounded-xl bg-card max-w-4xl select-none">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-muted/15 text-muted-foreground uppercase tracking-wider font-bold border-b border-border/60">
            <tr>
              <th className="py-3 px-4">Role Key</th>
              <th className="py-3 px-4 text-center">View Grades</th>
              <th className="py-3 px-4 text-center">Edit / Issue Grades</th>
              <th className="py-3 px-4 text-center">Manage Courses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {matrix.map((row, idx) => (
              <tr key={idx}>
                <td className="py-3 px-4 text-card-foreground font-bold font-heading">{row.role}</td>
                <td className="py-3 px-4 text-center">
                  <input type="checkbox" checked={row.viewGrades} readOnly className="accent-primary" />
                </td>
                <td className="py-3 px-4 text-center">
                  <input type="checkbox" checked={row.editGrades} readOnly className="accent-primary" />
                </td>
                <td className="py-3 px-4 text-center">
                  <input type="checkbox" checked={row.manageCourses} readOnly className="accent-primary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
