'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PublicLayout from '../../../components/PublicLayout';
import SectionHeader from '../../../components/ui/SectionHeader';
import CourseCard from '../../../components/ui/CourseCard';
import { subjectsRepository } from '../../../repositories/SubjectsRepository';
import { coursesRepository } from '../../../repositories/CoursesRepository';
import { Button } from '@eduverse/ui';
import { BookOpen, ShieldAlert } from 'lucide-react';

interface Params {
  slug: string;
}

export default function SubjectDeepDivePage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [subject, setSubject] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectsRepository.getBySlug(resolvedParams.slug).then((subjData) => {
      setSubject(subjData);
      if (subjData) {
        coursesRepository.getAll().then((allCourses) => {
          const matched = allCourses.filter(
            (c) => c.category.toLowerCase() === subjData.id.toLowerCase() || c.category.toLowerCase() === subjData.name.toLowerCase()
          );
          setCourses(matched);
        });
      }
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500">Querying subject track...</span>
        </div>
      </PublicLayout>
    );
  }

  if (!subject) {
    return (
      <PublicLayout>
        <div className="py-20 text-center space-y-4">
          <ShieldAlert className="mx-auto text-red-500" size={32} />
          <h2 className="text-xl font-bold font-heading text-white">Subject Category Not Found</h2>
          <p className="text-xs text-slate-400">The requested subject area listing does not exist.</p>
          <Button variant="primary" onClick={() => router.push('/subjects')}>Back to Subjects</Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-12 select-none animate-fade-in">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5">
          <span className="hover:text-white cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span>/</span>
          <span className="hover:text-white cursor-pointer" onClick={() => router.push('/subjects')}>Subjects</span>
          <span>/</span>
          <span className="text-indigo-400">{subject.name}</span>
        </div>

        <SectionHeader
          badge={`Subject Track: ${subject.name}`}
          title={`Academic Courses in ${subject.name}`}
          subtitle={subject.description}
        />

        {courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <BookOpen className="mx-auto text-slate-600 mb-3" size={24} />
            <p className="text-xs text-slate-400">No active classes registered under this subject area yet.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
