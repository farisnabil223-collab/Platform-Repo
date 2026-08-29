'use client';
/* eslint-disable no-undef */

import React from 'react';
import { PortalLayout, Button, Badge } from '@eduverse/ui';

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState([
    { id: '1', name: 'Sophia Johnson', email: 'sophia@example.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '2', name: 'Dr. Emily Watson', email: 'emily@example.com', role: 'TEACHER', status: 'ACTIVE' },
  ]);

  const [importPreview, setImportPreview] = React.useState<any[] | null>(null);

  const handleBulkAction = (action: string) => {
    alert(`Applying action: ${action} to selected accounts.`);
  };

  const handleCsvImportSimulate = () => {
    // Simulate CSV Preview
    setImportPreview([
      { name: 'Alice Smith', email: 'alice@example.com', role: 'STUDENT', status: 'VALID' },
      { name: 'John Doe', email: 'john@example.com', role: 'TEACHER', status: 'VALID' },
    ]);
  };

  const handleCommitImport = () => {
    if (!importPreview) return;
    setUsers((prev) => [
      ...prev,
      ...importPreview.map((x, idx) => ({ id: (prev.length + idx + 1).toString(), name: x.name, email: x.email, role: x.role, status: 'ACTIVE' })),
    ]);
    setImportPreview(null);
  };

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Identity & Access Directory"
      pageDescription="Manage platform accounts, execute bulk user invitations, and review CSV import preview states."
    >
      <div className="flex flex-col gap-6 select-none max-w-5xl">
        {/* Bulk Action Buttons */}
        <div className="flex gap-2 flex-wrap pb-3 border-b border-border/40">
          <Button variant="primary" size="sm" onClick={() => handleBulkAction('INVITE')} className="text-xs h-8 font-heading">Bulk Invite</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('RESET')} className="text-xs h-8">Reset Password</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('LOCK')} className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10 font-bold">Lock Accounts</Button>
          <Button variant="outline" size="sm" onClick={handleCsvImportSimulate} className="text-xs h-8">Import CSV File</Button>
        </div>

        {/* Import Preview Modal / Panel */}
        {importPreview && (
          <div className="p-5 bg-card border border-border rounded-xl flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-card-foreground font-heading">CSV Import Preview & Dry-Run Validation</h4>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleCommitImport} className="text-xs h-8 font-heading">Commit Import</Button>
                <Button variant="outline" size="sm" onClick={() => setImportPreview(null)} className="text-xs h-8">Rollback / Cancel</Button>
              </div>
            </div>
            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-muted/15 text-muted-foreground uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {importPreview.map((x, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 text-card-foreground font-bold font-heading">{x.name}</td>
                      <td className="py-2 px-4">{x.email}</td>
                      <td className="py-2 px-4 font-bold text-primary font-heading">{x.role}</td>
                      <td className="py-2 px-4 text-teal font-bold font-heading">{x.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Lifecycle Roster Table */}
        <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-muted/15 text-muted-foreground uppercase tracking-wider font-bold border-b border-border/60">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-4 text-card-foreground font-bold font-heading">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 font-bold text-primary font-heading">{u.role}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">{u.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
