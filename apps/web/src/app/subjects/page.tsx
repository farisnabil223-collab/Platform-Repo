'use client';

import React, { useEffect, useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import SubjectCard from '../../components/ui/SubjectCard';
import { subjectsRepository } from '../../repositories/SubjectsRepository';
import { BookOpen } from 'lucide-react';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectsRepository.getAll().then((data) => {
      setSubjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <PublicLayout>
      <div className="space-y-10 select-none animate-fade-in">
        <SectionHeader
          badge="Learning Subjects"
          title="Browse Classes by Subject Area"
          subtitle="Explore distinct academic fields of study. Deep-dive into curriculum maps matching your interests."
        />

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-900 border border-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((sub) => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <BookOpen className="mx-auto text-slate-600 mb-3" size={24} />
            <p className="text-xs text-slate-400">No subject categories found.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
