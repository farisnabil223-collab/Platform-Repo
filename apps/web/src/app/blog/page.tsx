import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import { Newspaper } from 'lucide-react';

export default function BlogPage() {
  return (
    <PublicLayout>
      <div className="space-y-6 select-none max-w-md mx-auto py-20 text-center animate-fade-in">
        <Newspaper className="mx-auto text-indigo-500 animate-pulse" size={48} />
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-white">EduVerse Blog</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our content hub is undergoing CMS integration. Research publications, feature releases, and study guides will be posted here soon.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
