'use client';
 

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  PortalLayout,
  Icon,
  Button,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockCourses } from '../../../services/studentData';

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [activeStatus, setActiveStatus] = React.useState<string>('ACTIVE');

  const categories = ['All', 'Science', 'Mathematics', 'Humanities', 'Tech'];

  React.useEffect(() => {
    studentService.getCourses().then((data) => {
      // Map API course fields to UI components, fallback to mock if empty
      const items = data.length > 0 ? data.map((c: any) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description || 'Course outline and instructions.',
        category: c.code.startsWith('MATH') ? 'Mathematics' : c.code.startsWith('PHYS') ? 'Science' : 'Tech',
        status: c.status === 'PUBLISHED' ? 'ACTIVE' : 'COMPLETED',
        progress: c.progress ?? Math.floor(Math.random() * 50) + 30,
        credits: c.credits ?? 3,
        lessonsCount: c.lessonsCount ?? 12,
        teacher: c.teacher?.user?.name || 'Dr. Emily Watson',
      })) : mockCourses;

      setCourses(items);
      setLoading(false);
    });
  }, []);

  const filteredCourses = React.useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                            course.code.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      const matchesStatus = course.status === activeStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, search, activeCategory, activeStatus]);

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Course catalogue"
      pageDescription="Search syllabus modules, access video check-ins, and inspect learning progression cards."
    >
      <div className="flex flex-col gap-6 select-none">
        {/* Search & Categories Filter bar */}
        <div className="p-4 bg-card border border-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 border border-border/30 text-muted-foreground hover:bg-muted/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative md:w-72">
            <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-1.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-4 border-b border-border/40 pb-2">
          {['ACTIVE', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`text-xs font-bold pb-2 transition-all border-b-2 px-1 ${
                activeStatus === st
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'ACTIVE' ? 'Active Enrolls' : 'Completed Archive'}
            </button>
          ))}
        </div>

        {/* Catalogue grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-card border border-border/30 rounded-xl" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div key={c.id} className="p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between h-[280px] shadow-sm hover:border-primary/30 transition-all">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">{c.credits} Credits</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground font-heading mt-1 line-clamp-1">{c.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1 leading-normal">{c.description}</p>
                </div>

                <div className="flex flex-col gap-3 mt-4 border-t border-border/20 pt-3">
                  {/* progress */}
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                    <span>Progress tracker</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>

                  <div className="flex gap-2 mt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs py-1.5"
                      onClick={() => router.push(`/student/courses/${c.id}`)}
                    >
                      Workspace
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-xl bg-card">
            <span className="text-xs text-muted-foreground">No matches found matching criteria.</span>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
