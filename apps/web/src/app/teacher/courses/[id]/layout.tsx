'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { PortalLayout, Icon } from '@eduverse/ui';
import { teacherCoursesService } from '../../../../services/teacherCoursesService';

export default function TeacherCourseWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const courseId = params.id as string;
  const [course, setCourse] = React.useState<any>(null);

  React.useEffect(() => {
    teacherCoursesService.getCourseById(courseId).then((data) => {
      setCourse(data || {
        id: courseId,
        code: 'MATH-101',
        title: 'Calculus I',
        description: 'Course outline and instructions.',
      });
    });
  }, [courseId]);

  const workspaceTabs = [
    { id: 'overview', label: 'Overview', icon: <Icon name="grades" size="sm" /> },
    { id: 'lessons', label: 'Lessons Syllabus', icon: <Icon name="task" size="sm" /> },
    { id: 'assignments', label: 'Assignments Review', icon: <Icon name="task" size="sm" /> },
    { id: 'quizzes', label: 'Quizzes Center', icon: <Icon name="task" size="sm" /> },
    { id: 'exams', label: 'Exams guidelines', icon: <Icon name="calendar" size="sm" /> },
    { id: 'students', label: 'Roster & Grades', icon: <Icon name="messages" size="sm" /> },
    { id: 'attendance', label: 'Attendance logs', icon: <Icon name="calendar" size="sm" /> },
    { id: 'announcements', label: 'Circular Notices', icon: <Icon name="messages" size="sm" /> },
    { id: 'discussions', label: 'Discussions Q&A', icon: <Icon name="messages" size="sm" /> },
    { id: 'analytics', label: 'Risk Analytics', icon: <Icon name="grades" size="sm" /> },
    { id: 'settings', label: 'Archival Settings', icon: <Icon name="messages" size="sm" /> },
  ];

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle={course ? `${course.code}: ${course.title}` : 'Loading workspace...'}
      pageDescription={course?.description || 'Course outline & instructions.'}
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Workspace Navigation Tab links */}
        <div className="lg:col-span-1 bg-card border border-border/60 rounded-xl p-3 flex flex-col gap-1 select-none shadow-sm">
          {workspaceTabs.map((tab) => {
            const tabUrl = `/teacher/courses/${courseId}/${tab.id}`;
            const isActive = pathname === tabUrl;
            return (
              <Link
                key={tab.id}
                href={tabUrl}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow font-bold'
                    : 'text-muted-foreground hover:bg-muted/15 hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Dynamic Nested Tab Content Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </PortalLayout>
  );
}
