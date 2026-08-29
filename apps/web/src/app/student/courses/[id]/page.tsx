'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  PortalLayout,
  Icon,
  Button,
  Badge,
  Tabs,
} from '@eduverse/ui';
import {
  mockCourses,
  mockAssignments,
  mockQuizzes,
  mockAnnouncements,
  Course,
  Lesson,
} from '../../../../services/studentData';
import { studentService } from '../../../../services/studentService';

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const courseId = params.id as string;
  const [course, setCourse] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Default tab or query parameter tab selection
  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = React.useState(tabParam);

  // Lesson player state
  const [activeLesson, setActiveLesson] = React.useState<any | null>(null);
  const [personalNotes, setPersonalNotes] = React.useState('');
  const [discussionPosts, setDiscussionPosts] = React.useState<{ id: string; author: string; role: string; date: string; content: string }[]>([
    { id: '1', author: 'Sophia Johnson', role: 'Student', date: 'Just now', content: 'What textbook sections correspond to integral substitutions?' },
    { id: '2', author: 'Dr. Emily Watson', role: 'Calculus Instructor', date: '1 hr ago', content: 'Sophia, review chapter 5.2 slides, and the Limit Rules handout attached in Resources.' },
  ]);
  const [newPostText, setNewPostText] = React.useState('');

  React.useEffect(() => {
    studentService.getCourseById(courseId).then((data) => {
      if (data) {
        // Flatten lessons from modules
        const allLessons = data.modules?.flatMap((m: any) =>
          m.lessons?.map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: `${l.estimatedDuration || 45} mins`,
            completed: false,
            videoUrl: l.videoUrl || l.mediaUrl || '',
            pdfUrl: l.pdfUrl || '',
            bookmarked: false,
          })) || []
        ) || [];

        setCourse({
          id: data.id,
          code: data.code,
          title: data.title,
          description: data.description || 'Course outline and instructions.',
          category: data.code.startsWith('MATH') ? 'Mathematics' : 'Tech',
          instructor: 'Dr. Emily Watson',
          attendancePercent: 98,
          gradeAverage: 'A-',
          progress: 30,
          lessons: allLessons.length > 0 ? allLessons : [
            { id: '1', title: 'Lesson 1.1: Basic Principles', duration: '45 mins', completed: false, bookmarked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          ],
        });
      } else {
        // Fallback to mock
        const fallback = mockCourses.find((c) => c.id === courseId);
        setCourse(fallback || null);
      }
      setLoading(false);
    });
  }, [courseId]);

  React.useEffect(() => {
    if (course && course.lessons.length > 0 && !activeLesson) {
      setActiveLesson(course.lessons.find((l: any) => !l.completed) || course.lessons[0]);
    }
  }, [course, activeLesson]);

  React.useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  if (loading) {
    return (
      <PortalLayout role="STUDENT" pageTitle="Loading workspace...">
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading course syllabus details...</span>
        </div>
      </PortalLayout>
    );
  }

  if (!course) {
    return (
      <PortalLayout role="STUDENT" pageTitle="Error">
        <div className="p-12 text-center">
          <h3 className="text-lg font-bold text-foreground">Course Not Found</h3>
          <Button onClick={() => router.push('/student/courses')} className="mt-4">
            Back to Catalogue
          </Button>
        </div>
      </PortalLayout>
    );
  }

  // Active lessons toggle completion handler
  const handleToggleComplete = (lessonId: string) => {
    setCourse((prev: any) => {
      if (!prev) return prev;
      const nextLessons = prev.lessons.map((l: any) => {
        if (l.id === lessonId) {
          return { ...l, completed: !l.completed };
        }
        return l;
      });
      const completedCount = nextLessons.filter((l: any) => l.completed).length;
      const nextProgress = Math.round((completedCount / nextLessons.length) * 100);
      return { ...prev, lessons: nextLessons, progress: nextProgress };
    });

    if (activeLesson?.id === lessonId) {
      setActiveLesson((prev: any) => prev ? { ...prev, completed: !prev.completed } : null);
    }
  };

  const handleToggleBookmark = (lessonId: string) => {
    setCourse((prev: any) => {
      if (!prev) return prev;
      const nextLessons = prev.lessons.map((l: any) => {
        if (l.id === lessonId) {
          return { ...l, bookmarked: !l.bookmarked };
        }
        return l;
      });
      return { ...prev, lessons: nextLessons };
    });

    if (activeLesson?.id === lessonId) {
      setActiveLesson((prev: any) => prev ? { ...prev, bookmarked: !prev.bookmarked } : null);
    }
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setDiscussionPosts((prev) => [
      { id: Math.random().toString(), author: 'Sophia Johnson', role: 'Student', date: 'Just now', content: newPostText },
      ...prev,
    ]);
    setNewPostText('');
  };

  const courseAssignments = mockAssignments.filter((a) => a.courseId === courseId);
  const courseQuizzes = mockQuizzes.filter((q) => q.courseId === courseId);

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle={course.title}
      pageDescription={`${course.code} | Category: ${course.category} | Faculty: ${course.instructor}`}
    >
      {/* 1. Header Metrics Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-card border border-border/60 shadow-sm">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Attendance quota</span>
          <div className="text-base font-bold text-foreground mt-0.5">{course.attendancePercent}%</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Progress</span>
          <div className="text-base font-bold text-foreground mt-0.5">{course.progress}%</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Instructor Office</span>
          <div className="text-base font-bold text-foreground mt-0.5">{course.instructor}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-9 justify-center items-center gap-2"
          onClick={() => router.push('/student/messages')}
        >
          <Icon name="messages" size="sm" /> Chat Office
        </Button>
      </div>

      {/* 2. Custom Tabs */}
      <div className="flex border-b border-border/65 gap-4 overflow-x-auto pb-1 select-none">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'lessons', label: 'Lessons' },
          { key: 'resources', label: 'Resources' },
          { key: 'assignments', label: 'Assignments' },
          { key: 'quizzes', label: 'Quizzes Center' },
          { key: 'discussions', label: 'Discussions' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all px-2 ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Render Active Tab viewports */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Syllabus Description */}
              <div className="p-6 bg-card border border-border/60 rounded-xl">
                <h4 className="text-sm font-bold text-foreground font-heading mb-3">Course Syllabus Description</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{course.syllabus}</p>
              </div>

              {/* Course Announcements */}
              <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
                <h4 className="text-sm font-bold text-foreground font-heading">Course Announcements</h4>
                <div className="flex flex-col gap-3">
                  {mockAnnouncements.map((ann) => (
                    <div key={ann.id} className="p-4 rounded-lg bg-muted/20 border border-border/20 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-foreground">{ann.title}</span>
                        <span className="text-[10px] text-muted-foreground">{ann.date}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="flex flex-col gap-6">
              <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4 text-xs">
                <h4 className="text-sm font-bold text-foreground font-heading border-b border-border/40 pb-2">
                  Instructor Profile
                </h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">{course.instructor}</h5>
                    <span className="text-muted-foreground text-[10px]">{course.instructorEmail}</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Available for office consultation hours via direct portal chat or schedule.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Lesson Player with dynamic Sidebar list */}
        {activeTab === 'lessons' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Player Pane */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {activeLesson ? (
                <div className="flex flex-col gap-4">
                  {/* Player viewport mock */}
                  <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-100 p-6 relative overflow-hidden select-none">
                    {/* Media Type Icon */}
                    <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center animate-pulse mb-4">
                      {activeLesson.type === 'video' && <Icon name="play" size="lg" className="translate-x-0.5" />}
                      {activeLesson.type === 'pdf' && <Icon name="book" size="lg" />}
                      {activeLesson.type === 'slides' && <Icon name="exams" size="lg" />}
                    </div>
                    <span className="text-sm font-bold text-center leading-normal max-w-sm">
                      {activeLesson.type === 'video'
                        ? 'Calculus Lecture Stream: ' + activeLesson.title
                        : 'Interactive document view: ' + activeLesson.title}
                    </span>
                    <span className="text-xs text-slate-400 mt-1.5">{activeLesson.duration} resource item</span>
                  </div>

                  {/* Lesson title & complete checkbox */}
                  <div className="flex justify-between items-center p-4 rounded-xl bg-card border border-border/60 shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-foreground font-heading">{activeLesson.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                        Resource Type: {activeLesson.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleBookmark(activeLesson.id)}
                        className="text-xs gap-1.5"
                      >
                        <Icon name="task" size="sm" className={activeLesson.bookmarked ? 'text-amber-500 fill-amber-500' : ''} />
                        {activeLesson.bookmarked ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                      <Button
                        variant={activeLesson.completed ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleComplete(activeLesson.id)}
                        className="text-xs gap-1.5"
                      >
                        {activeLesson.completed ? (
                          <>
                            <Icon name="success" size="sm" className="text-emerald-500" /> Completed
                          </>
                        ) : (
                          'Mark Complete'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Notes Panel */}
                  <div className="p-5 bg-card border border-border/60 rounded-xl">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading mb-3">
                      Personal Lecture Notes
                    </h5>
                    <textarea
                      value={personalNotes}
                      onChange={(e) => setPersonalNotes(e.target.value)}
                      placeholder="Add personal study references here..."
                      className="w-full h-24 p-3 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <span className="text-xs text-muted-foreground">Select a lesson to begin.</span>
                </div>
              )}
            </div>

            {/* Lessons list sidebar */}
            <div className="p-4 bg-card border border-border/60 rounded-xl flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                Course Syllabus Map
              </h4>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[480px]">
                {course.lessons.map((lesson: any) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`p-3 rounded-lg border text-left flex justify-between items-start transition-all ${
                      activeLesson?.id === lesson.id
                        ? 'bg-primary/10 border-primary/40'
                        : 'bg-muted/10 border-border/20 hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex gap-2">
                      <div className="mt-0.5 shrink-0 text-muted-foreground">
                        {lesson.type === 'video' && <Icon name="play" size="sm" />}
                        {lesson.type === 'pdf' && <Icon name="book" size="sm" />}
                        {lesson.type === 'slides' && <Icon name="exams" size="sm" />}
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-foreground font-heading leading-snug line-clamp-2">
                          {lesson.title}
                        </h5>
                        <span className="text-[9px] text-muted-foreground mt-0.5 block">{lesson.duration}</span>
                      </div>
                    </div>
                    {lesson.completed && (
                      <Icon name="success" size="sm" className="text-emerald-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources tab */}
        {activeTab === 'resources' && (
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-foreground font-heading">Handouts & Reference Material</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/20 border border-border/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="book" className="text-primary" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Course Textbook Syllabus.pdf</h5>
                    <span className="text-[10px] text-muted-foreground">PDF file | 12.4 MB</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">Download</Button>
              </div>

              <div className="p-4 rounded-lg bg-muted/20 border border-border/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="exams" className="text-amber" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Integration Practice Sheets</h5>
                    <span className="text-[10px] text-muted-foreground">Slides file | 4.8 MB</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">Download</Button>
              </div>
            </div>
          </div>
        )}

        {/* Assignments tab */}
        {activeTab === 'assignments' && (
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-foreground font-heading">Course Assignments</h4>
            <div className="flex flex-col gap-3">
              {courseAssignments.map((a) => (
                <div key={a.id} className="p-4 rounded-lg bg-muted/20 border border-border/25 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-foreground">{a.title}</h5>
                    <div className="flex items-center gap-3 mt-1.5 text-muted-foreground text-[10px]">
                      <span>Due: {a.dueDate}</span>
                      <span>Score Limit: {a.maxScore}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={a.status === 'GRADED' ? 'success' : a.status === 'SUBMITTED' ? 'info' : 'warning'}>
                      {a.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => router.push('/student/assignments')}>
                      Open Portal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes tab */}
        {activeTab === 'quizzes' && (
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-foreground font-heading">Quizzes Center</h4>
            <div className="flex flex-col gap-3">
              {courseQuizzes.map((q) => (
                <div key={q.id} className="p-4 rounded-lg bg-muted/20 border border-border/25 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-foreground">{q.title}</h5>
                    <span className="text-muted-foreground text-[10px] mt-1 block">Time Limit: {q.timeLimitMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {q.completed ? (
                      <Badge variant="success">Completed ({q.score}%)</Badge>
                    ) : (
                      <Button variant="primary" size="sm" className="text-xs" onClick={() => router.push('/student/quizzes')}>
                        Attempt
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussions tab */}
        {activeTab === 'discussions' && (
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-6">
            <h4 className="text-sm font-bold text-foreground font-heading">Course Discussion Forum</h4>
            
            {/* New post form */}
            <form onSubmit={handlePostDiscussion} className="flex flex-col gap-3 pb-4 border-b border-border/40">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Ask a question or post a discussion note to instructors and classmates..."
                className="w-full h-20 p-3 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
              />
              <Button type="submit" variant="primary" size="sm" className="self-end text-xs">
                Post Thread
              </Button>
            </form>

            {/* Feed */}
            <div className="flex flex-col gap-4">
              {discussionPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg bg-muted/20 border border-border/20 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-foreground">{post.author}</span>
                        <span className="text-[9px] text-muted-foreground ml-2">({post.role})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{post.date}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 leading-relaxed pl-8">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
