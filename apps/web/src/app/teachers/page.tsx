'use client';

import React, { useEffect, useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import TeacherCard from '../../components/ui/TeacherCard';
import { teachersRepository } from '../../repositories/TeachersRepository';
import { Users } from 'lucide-react';

export default function TeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teachersRepository.getAll().then((data) => {
      setTeachers(data);
      setLoading(false);
    });
  }, []);

  return (
    <PublicLayout>
      <div className="space-y-10 select-none animate-fade-in">
        <SectionHeader
          badge="Faculty Directory"
          title="Learn From the Experts"
          subtitle="Meet the doctorate professors, engineers, and researchers guiding classes on EduVerse. Read reviews and experience portfolios."
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-900 border border-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <Users className="mx-auto text-slate-600 mb-3" size={24} />
            <p className="text-xs text-slate-400">No teachers found in the faculty record.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
