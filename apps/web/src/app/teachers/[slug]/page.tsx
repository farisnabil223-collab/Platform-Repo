'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PublicLayout from '../../../components/PublicLayout';
import Rating from '../../../components/ui/Rating';
import CourseCard from '../../../components/ui/CourseCard';
import { teachersRepository } from '../../../repositories/TeachersRepository';
import { coursesRepository } from '../../../repositories/CoursesRepository';
import { Button, Card, Avatar } from '@eduverse/ui';
import { GraduationCap, ShieldAlert, Award } from 'lucide-react';

const Linkedin = ({ size = 24, ...props }: React.ComponentPropsWithoutRef<'svg'> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ size = 24, ...props }: React.ComponentPropsWithoutRef<'svg'> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github = ({ size = 24, ...props }: React.ComponentPropsWithoutRef<'svg'> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


interface Params {
  slug: string;
}

export default function TeacherProfilePage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [teacher, setTeacher] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teachersRepository.getBySlug(resolvedParams.slug).then((data) => {
      setTeacher(data);
      if (data) {
        coursesRepository.getAll().then((allCourses) => {
          // Filter courses taught by this teacher
          const teacherCourses = allCourses.filter(
            (c) => c.instructorId === data.id || c.instructorName === data.name
          );
          setCourses(teacherCourses);
        });
      }
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500">Loading teacher credentials...</span>
        </div>
      </PublicLayout>
    );
  }

  if (!teacher) {
    return (
      <PublicLayout>
        <div className="py-20 text-center space-y-4">
          <ShieldAlert className="mx-auto text-red-500" size={32} />
          <h2 className="text-xl font-bold font-heading text-white">Instructor Not Found</h2>
          <p className="text-xs text-slate-400">The requested teacher profile record does not exist.</p>
          <Button variant="primary" onClick={() => router.push('/teachers')}>Back to Directory</Button>
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
          <span className="hover:text-white cursor-pointer" onClick={() => router.push('/teachers')}>Teachers</span>
          <span>/</span>
          <span className="text-indigo-400">{teacher.name}</span>
        </div>

        {/* Profile Card Header */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Detailed Bio (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <Avatar className="h-20 w-20 rounded-full border border-slate-800 bg-indigo-900/40 text-indigo-300 font-bold text-2xl flex items-center justify-center shrink-0">
                {teacher.avatar || teacher.name.charAt(0)}
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
                  {teacher.name}
                </h1>
                <div className="flex flex-wrap gap-2 pt-1">
                  {teacher.specialties.map((s: string) => (
                    <span key={s} className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Biography Summary</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                {teacher.detailedBio}
              </p>
            </div>

            {/* Qualifications */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Qualifications & Education</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {teacher.qualifications.map((q: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <GraduationCap size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certification / Awards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Honors & Certifications</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {teacher.certificates.map((c: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Award size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses Taught */}
            <div className="space-y-4 pt-4 border-t border-slate-800/40">
              <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">Courses Taught</h3>
              {courses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No active public courses assigned currently.</p>
              )}
            </div>
          </div>

          {/* Stats & Contacts Panel (Right Column) */}
          <div className="space-y-6">
            <Card className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl">
              <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider">Teaching Portfolio</h3>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xl font-black font-heading text-white block">
                    {teacher.experienceYears}+
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Years Exp</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xl font-black font-heading text-white block">
                    {teacher.studentsCount.toLocaleString()}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Students</span>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-slate-800/60 pt-4 text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Aggregate Rating:</span>
                  <div className="flex items-center gap-1">
                    <Rating value={teacher.rating} size={12} />
                    <span className="text-white font-bold">{teacher.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reviews Received:</span>
                  <span className="text-white font-bold">{teacher.reviewsCount}</span>
                </div>
              </div>

              {/* Social Contacts */}
              <div className="border-t border-slate-800/60 pt-4 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Social Links</span>
                <div className="flex gap-3 text-slate-400">
                  {teacher.socialLinks.linkedin && (
                    <a
                      href={teacher.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                  {teacher.socialLinks.twitter && (
                    <a
                      href={teacher.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={14} />
                    </a>
                  )}
                  {teacher.socialLinks.github && (
                    <a
                      href={teacher.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={14} />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </PublicLayout>
  );
}
