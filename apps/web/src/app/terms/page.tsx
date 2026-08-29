import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="space-y-10 select-none max-w-3xl mx-auto animate-fade-in">
        <SectionHeader
          badge="Legal Docs"
          title="Terms of Service"
          subtitle="Read the agreement terms guiding the use of the EduVerse educational learning platforms."
        />
        <div className="text-xs md:text-sm text-slate-400 space-y-4 leading-relaxed">
          <p>
            By using EduVerse, you agree to comply with our academic integrity rules. Double accounts and plagiarism of assignment sheets are prohibited.
          </p>
          <p>
            Instructor applicants must provide true credentials, and payments for premium courses must align with checkout verification paths.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
