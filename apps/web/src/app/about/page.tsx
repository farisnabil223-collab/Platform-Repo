import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="space-y-10 select-none max-w-3xl mx-auto animate-fade-in">
        <SectionHeader
          badge="About Us"
          title="Our Educational Mission"
          subtitle="Learn about the philosophy and engineering behind the EduVerse learning workspace."
        />
        <div className="text-xs md:text-sm text-slate-400 space-y-4 leading-relaxed">
          <p>
            EduVerse is a unified educational platform designed to make learning discoverable, academic planning manageable, and teaching rewarding. We believe in providing open course outlines and lesson video previews anonymously before requiring registration.
          </p>
          <p>
            Our architecture bridges classrooms with interactive homework review flows, student cumulative GPA tracking graphs, and parent monitoring channels under a modern Notion-style design system.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
