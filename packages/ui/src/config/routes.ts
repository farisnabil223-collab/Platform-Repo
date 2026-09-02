import { IconName } from '../components/Icon/Icon';

export interface RouteDefinition {
  path: string;
  title: string;
  icon?: IconName;
  permissions?: string[];
  breadcrumb?: string;
  featureFlag?: string;
  layout: 'auth' | 'portal' | 'public';
  seo: {
    title: string;
    description: string;
  };
  children?: RouteDefinition[];
}

export const PORTAL_ROUTES: Record<'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN', RouteDefinition[]> = {
  STUDENT: [
    {
      path: '/student/dashboard',
      title: 'My Dashboard',
      icon: 'dashboard',
      layout: 'portal',
      seo: { title: 'Student Dashboard', description: 'Overview of courses and schedules.' },
    },
    {
      path: '/student/courses',
      title: 'My Courses',
      icon: 'courses',
      layout: 'portal',
      seo: { title: 'My Courses', description: 'Access virtual course lectures.' },
    },
    {
      path: '/student/assignments',
      title: 'Assignments',
      icon: 'assignments',
      layout: 'portal',
      seo: { title: 'Assignments', description: 'Upload homework portfolios.' },
    },
    {
      path: '/student/quizzes',
      title: 'Quizzes Center',
      icon: 'task',
      layout: 'portal',
      seo: { title: 'Quizzes Center', description: 'Complete course quizzes.' },
    },
    {
      path: '/student/exams',
      title: 'Exams & Tests',
      icon: 'exams',
      layout: 'portal',
      seo: { title: 'Exams & Tests', description: 'Schedule and view upcoming exams.' },
    },
    {
      path: '/student/grades',
      title: 'Grades Record',
      icon: 'grades',
      layout: 'portal',
      seo: { title: 'Grades', description: 'Performance details.' },
    },
    {
      path: '/student/attendance',
      title: 'Attendance Report',
      icon: 'activity',
      layout: 'portal',
      seo: { title: 'Attendance', description: 'View your course attendance summary.' },
    },
    {
      path: '/student/calendar',
      title: 'My Calendar',
      icon: 'calendar',
      layout: 'portal',
      seo: { title: 'Calendar', description: 'Track events, schedules, and deadlines.' },
    },
    {
      path: '/student/announcements',
      title: 'Announcements',
      icon: 'announcement',
      layout: 'portal',
      seo: { title: 'Announcements', description: 'Stay up to date with department notices.' },
    },
    {
      path: '/student/messages',
      title: 'Messages Chat',
      icon: 'messages',
      layout: 'portal',
      seo: { title: 'Messages', description: 'Chat with instructors and peers.' },
    },
    {
      path: '/student/profile',
      title: 'My Profile',
      icon: 'user',
      layout: 'portal',
      seo: { title: 'My Profile & Settings', description: 'Manage personal preferences and accessibility.' },
    },
    {
      path: '/student/purchase-history',
      title: 'Purchase History',
      icon: 'billing',
      layout: 'portal',
      seo: { title: 'Purchase & Billing History', description: 'Inspect orders and invoices.' },
    },
  ],
  TEACHER: [
    {
      path: '/teacher/dashboard',
      title: 'Faculty Dashboard',
      icon: 'dashboard',
      layout: 'portal',
      seo: { title: 'Faculty Dashboard', description: 'Review registrations and queues.' },
    },
    {
      path: '/teacher/courses',
      title: 'Course Builder',
      icon: 'courses',
      layout: 'portal',
      seo: { title: 'Course Builder', description: 'Design course syllabi.' },
    },
    {
      path: '/teacher/homework',
      title: 'Homework Review',
      icon: 'assignments',
      layout: 'portal',
      seo: { title: 'Homework Review', description: 'Grade student uploads.' },
    },
  ],
  PARENT: [
    {
      path: '/parent/dashboard',
      title: 'Parent Dashboard',
      icon: 'dashboard',
      layout: 'portal',
      seo: { title: 'Parent Dashboard', description: 'Syllabus status of dependents.' },
    },
    {
      path: '/parent/children',
      title: 'Children Directory',
      icon: 'user',
      layout: 'portal',
      seo: { title: 'Children Directory', description: 'Track grades and logs.' },
    },
    {
      path: '/parent/billing',
      title: 'Invoices & Billing',
      icon: 'billing',
      layout: 'portal',
      seo: { title: 'Billing', description: 'tuition payments.' },
      featureFlag: 'enableBillingStripe',
    },
  ],
  ADMIN: [
    {
      path: '/',
      title: 'System Overview',
      icon: 'dashboard',
      layout: 'portal',
      seo: { title: 'Admin Overview', description: 'Observe server statuses.' },
    },
    {
      path: '/subjects',
      title: 'إدارة المواد (Subjects)',
      icon: 'courses',
      layout: 'portal',
      seo: { title: 'Platform Subjects', description: 'Create and manage platform subjects.' },
    },
    {
      path: '/users',
      title: 'Users Directory',
      icon: 'user',
      layout: 'portal',
      seo: { title: 'User Management', description: 'Configure permissions.' },
    },
    {
      path: '/analytics',
      title: 'Business Intelligence',
      icon: 'activity',
      layout: 'portal',
      seo: { title: 'Analytics', description: 'View business metrics.' },
    },
    {
      path: '/financial',
      title: 'Financial Ledger',
      icon: 'billing',
      layout: 'portal',
      seo: { title: 'Financials', description: 'Tuition revenue & invoices.' },
    },
    {
      path: '/audit',
      title: 'Audit Logs',
      icon: 'activity',
      layout: 'portal',
      seo: { title: 'Audit Logs', description: 'Trace platform logs.' },
    },
  ],
};
