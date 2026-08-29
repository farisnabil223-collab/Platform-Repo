import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';

export default function AccessibilityPage() {
  return (
    <PublicLayout>
      <div className="space-y-10 select-none max-w-3xl mx-auto animate-fade-in">
        <SectionHeader
          badge="Accessibility"
          title="Accessibility Declaration"
          subtitle="Our commitment to WCAG 2.1 Level AA compliance guidelines."
        />
        <div className="text-xs md:text-sm text-slate-400 space-y-4 leading-relaxed">
          <p>
            EduVerse is committed to digital inclusivity. All public directories and portal dashboards are designed to meet WCAG 2.1 AA benchmarks.
          </p>
          <p>
            We implement proper ARIA roles, key-navigable focus rings on interactive buttons, and screen reader-friendly navigation trees.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
