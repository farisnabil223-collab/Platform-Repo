import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <div className="space-y-10 select-none max-w-3xl mx-auto animate-fade-in">
        <SectionHeader
          badge="Legal Docs"
          title="Refund Policy"
          subtitle="Learn about the 30-day money-back guarantee policy details on course purchases."
        />
        <div className="text-xs md:text-sm text-slate-400 space-y-4 leading-relaxed">
          <p>
            We stand behind our course quality. If you are unsatisfied with a paid course, you can request a full refund within 30 days of purchase.
          </p>
          <p>
            Refund requests can be submitted to our support desk or initiated directly in your student profile dashboard.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
