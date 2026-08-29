'use client';
 

import React from 'react';
import { PortalLayout, StatisticWidget, Badge } from '@eduverse/ui';

export default function AdminFinancialPage() {
  const invoices = [
    { id: 'INV-102', student: 'Sophia Johnson', amount: '$450.00', status: 'PAID', date: 'July 28, 2026' },
    { id: 'INV-103', student: 'Liam Johnson', amount: '$450.00', status: 'PENDING', date: 'July 29, 2026' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Financial Ledger Registry"
      pageDescription="Inspect student invoice receipts, active subscriptions, and discount adjustments."
    >
      <div className="flex flex-col gap-6 select-none max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          <StatisticWidget
            title="Collected Tuition Revenue"
            value="$45,280.00"
            description="August invoice cycles"
            trend={{ value: '+4% MoM', type: 'up' }}
          />
          <StatisticWidget
            title="Pending Tuition Balances"
            value="$2,450.00"
            description="6 students outstanding"
            trend={{ value: 'Due August 1st', type: 'neutral' }}
          />
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-muted/15 text-muted-foreground uppercase tracking-wider font-bold border-b border-border/60">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 px-4 text-card-foreground font-bold font-heading">{inv.id}</td>
                  <td className="py-3 px-4">{inv.student}</td>
                  <td className="py-3 px-4 text-primary font-bold font-heading">{inv.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>{inv.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
