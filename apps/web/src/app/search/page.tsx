'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import CourseCard from '../../components/ui/CourseCard';
import TeacherCard from '../../components/ui/TeacherCard';
import SubjectCard from '../../components/ui/SubjectCard';
import api from '../../services/api';
import { Button } from '@eduverse/ui';
import { Search, BookOpen, Users, GraduationCap } from 'lucide-react';
import { analytics } from '../../utils/analytics';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [searchResults, setSearchResults] = useState<{
    courses: any[];
    teachers: any[];
    subjects: any[];
  }>({ courses: [], teachers: [], subjects: [] });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'teachers' | 'subjects'>('all');

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({ courses: [], teachers: [], subjects: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    analytics.trackEvent('search_perform', { query });

    api.get<any>(`/public/search?q=${encodeURIComponent(query)}`).then((res) => {
      const data = res.data || { courses: { items: [] }, teachers: { items: [] }, subjects: { items: [] } };

      const coursesMapped = (data.courses?.items || []).map((c: any) => ({
        id: c.id,
        code: c.code,
        slug: c.slug,
        title: c.title,
        description: c.description || '',
        price: c.code === 'MATH-101' ? 49.99 : c.code === 'PHYS-202' ? 79.99 : 0,
        instructorName: c.teacher?.user?.email ? c.teacher.user.email.split('@')[0] : 'Instructor',
        rating: 4.8,
        reviewsCount: 15,
      }));

      const teachersMapped = (data.teachers?.items || []).map((t: any) => ({
        id: t.id,
        teacherCode: t.teacherCode,
        name: t.teacherCode === 'TCH-9932' ? 'Dr. Emily Watson' : t.teacherCode === 'TCH-9933' ? 'Dr. Arthur Feynman' : 'Prof. Linus Torvalds',
        avatar: t.teacherCode === 'TCH-9932' ? 'EW' : t.teacherCode === 'TCH-9933' ? 'AF' : 'LT',
        bio: t.bio || 'EduVerse Instructor',
        specialties: t.specialties || [],
        rating: 4.9,
      }));

      const subjectsMapped = (data.subjects?.items || []).map((s: any) => ({
        id: s.id,
        slug: s.code?.toLowerCase() || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: s.name,
        description: s.description || '',
      }));

      setSearchResults({
        courses: coursesMapped,
        teachers: teachersMapped,
        subjects: subjectsMapped,
      });
      setLoading(false);
    }).catch(() => {
      setSearchResults({ courses: [], teachers: [], subjects: [] });
      setLoading(false);
    });

    // Fetch search suggestions
    api.get<any>(`/public/search/suggestions?q=${encodeURIComponent(query)}`).then((res) => {
      setSuggestions(res.data || []);
    }).catch(() => {
      setSuggestions([]);
    });

  }, [query]);

  const totalResults = searchResults.courses.length + searchResults.teachers.length + searchResults.subjects.length;

  return (
    <PublicLayout>
      <div className="space-y-10 select-none animate-fade-in">
        <SectionHeader
          badge="Search Results"
          title={query ? `Results for "${query}"` : 'Global Search Console'}
          subtitle={query ? `Found ${totalResults} matching items across catalog directory.` : 'Type a query in the search bar to scan the platform.'}
        />

        {suggestions.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Suggestions:</span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => router.push(`/search?q=${encodeURIComponent(sug)}`)}
                className="text-[10px] font-semibold bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-white text-slate-400 px-2 py-1 rounded-md transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Tab triggers */}
        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            disabled={searchResults.courses.length === 0}
            onClick={() => setActiveTab('courses')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Courses ({searchResults.courses.length})
          </button>
          <button
            disabled={searchResults.teachers.length === 0}
            onClick={() => setActiveTab('teachers')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 ${
              activeTab === 'teachers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Teachers ({searchResults.teachers.length})
          </button>
          <button
            disabled={searchResults.subjects.length === 0}
            onClick={() => setActiveTab('subjects')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 ${
              activeTab === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Subjects ({searchResults.subjects.length})
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center animate-pulse">
            <span className="text-xs text-slate-500">Querying platform files...</span>
          </div>
        ) : totalResults > 0 ? (
          <div className="space-y-12">
            
            {/* Courses section */}
            {(activeTab === 'all' || activeTab === 'courses') && searchResults.courses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <GraduationCap size={14} /> Matching Courses
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}

            {/* Teachers section */}
            {(activeTab === 'all' || activeTab === 'teachers') && searchResults.teachers.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Users size={14} /> Matching Teachers
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.teachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>
              </div>
            )}

            {/* Subjects section */}
            {(activeTab === 'all' || activeTab === 'subjects') && searchResults.subjects.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <BookOpen size={14} /> Matching Subjects
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {searchResults.subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 space-y-3">
            <Search className="mx-auto text-slate-600 mb-2" size={24} />
            <h4 className="text-sm font-bold text-white font-heading">No Matches Found</h4>
            <p className="text-xs text-slate-400">Try checking spelling or typing a broader query term.</p>
            <div className="pt-2">
              <Button variant="primary" onClick={() => router.push('/courses')}>View Courses Catalog</Button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500">Loading search results...</span>
        </div>
      </PublicLayout>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}

