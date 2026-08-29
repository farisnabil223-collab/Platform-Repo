import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="space-y-10 select-none max-w-3xl mx-auto animate-fade-in">
        <SectionHeader
          badge="Legal Docs"
          title="Privacy Policy"
          subtitle="Details on how EduVerse securely collects and protects your account details."
        />
        <div className="text-xs md:text-sm text-slate-400 space-y-4 leading-relaxed">
          <p>
            Your privacy is highly important to us. We store your account profiles, email verification tokens, and linked child student mappings securely.
          </p>
          <p>
            We do not share your details with third parties. Session cookies and local storage tokens are only used to authenticate dashboard navigation states.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
