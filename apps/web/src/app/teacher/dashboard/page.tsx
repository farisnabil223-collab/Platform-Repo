'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PortalLayout,
  StatisticWidget,
  ActivityWidget,
  AnnouncementWidget,
  ChartWidget,
  QuickActionsWidget,
  Icon,
} from '@eduverse/ui';
import { teacherService } from '../../../services/teacherService';
import { teacherCoursesService } from '../../../services/teacherCoursesService';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = React.useState({
    activeStudents: 35,
    gradingQueue: 5,
    averagePerformance: 84.1,
  });
  const [activities, setActivities] = React.useState<any[]>([]);
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      teacherService.getOverviewStats(),
      teacherService.getRecentActivity(),
      teacherCoursesService.getCourses(),
    ]).then(([statsData, activitiesData, coursesData]) => {
      setStats(statsData);
      setActivities(activitiesData);
      setAnnouncements([
        { id: '1', title: 'Faculty Board Meeting', content: 'Scheduled for next Monday at 09:00 in Boardroom A.', date: 'July 28', author: 'Dean of Science' },
      ]);
      setLoading(false);
    });
  }, []);

  const gradeDistribution = [
    { label: 'A', value: 8 },
    { label: 'B', value: 14 },
    { label: 'C', value: 9 },
    { label: 'D', value: 3 },
    { label: 'F', value: 1 },
  ];

  const quickActions = [
    {
      id: 'grade',
      label: 'Grade Submissions',
      description: 'Review pending assignments.',
      action: () => router.push('/teacher/gradebook'),
    },
    {
      id: 'course',
      label: 'Create Course',
      description: 'Setup a new curriculum syllabus.',
      action: () => router.push('/teacher/courses'),
    },
  ];

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Faculty Control Panel"
      pageDescription="Manage course registrations, grading reviews, syllabus modules, and student performance metrics."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading dashboard components...</span>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 select-none">
            <StatisticWidget
              title="Active Students"
              value={`${stats.activeStudents}`}
              description="Aggregated from course sessions."
              trend={{ value: '+4 new', type: 'up' }}
            />
            <StatisticWidget
              title="Grading Queue"
              value={`${stats.gradingQueue} tasks`}
              description="Assignments pending review."
              trend={{ value: '14 reviewed', type: 'up' }}
            />
            <StatisticWidget
              title="Average Performance"
              value={`B+ (${stats.averagePerformance}%)`}
              description="Dean's average quota."
              trend={{ value: '1.8%', type: 'up' }}
            />
          </div>

          {/* Layout Main */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ChartWidget
                title="Grade Distributions (Aggregated Courses)"
                type="bar"
                data={gradeDistribution}
              />
              <QuickActionsWidget actions={quickActions} />
            </div>
            <div className="flex flex-col gap-6">
              <ActivityWidget activities={activities} />
              <AnnouncementWidget announcements={announcements} />
            </div>
          </div>
        </>
      )}
    </PortalLayout>
  );
}
