'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon, Badge } from '@eduverse/ui';
import { teacherLessonsService } from '../../../../../services/teacherLessonsService';
import { teacherCoursesService } from '../../../../../services/teacherCoursesService';

export default function CourseLessonsTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Lesson creation fields
  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [duration, setDuration] = React.useState('45 mins');
  const [status, setStatus] = React.useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  // File Upload Pipeline mock states
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState(false);
  const uploadTimerRef = React.useRef<any>(null);

  const fetchLessons = () => {
    setLoading(true);
    teacherCoursesService.getCourseById(courseId).then((data) => {
      if (data && data.modules) {
        const list = data.modules.flatMap((m: any) =>
          m.lessons?.map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: `${l.estimatedDuration || 45} mins`,
            status: 'PUBLISHED',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          })) || []
        );
        setLessons(list);
      } else {
        setLessons([
          { id: 'l1', title: 'Lesson 1.1: Foundations & Limits computations', duration: '45 mins', status: 'PUBLISHED' },
          { id: 'l2', title: 'Lesson 1.2: Riemann Integrals and bounds definitions', duration: '60 mins', status: 'DRAFT' },
        ]);
      }
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchLessons();
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    };
  }, [courseId]);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      await teacherLessonsService.createLesson(courseId, { title, estimatedDuration: parseInt(duration) || 45 });
      fetchLessons();
    } catch (err) {
      setLessons((prev) => [
        ...prev,
        { id: Math.random().toString(), title, duration, status },
      ]);
    }
    setTitle('');
    setShowModal(false);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await teacherLessonsService.deleteLesson(lessonId);
      fetchLessons();
    } catch (err) {
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    }
  };

  const handleTogglePublish = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId ? { ...l, status: l.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' } : l
      )
    );
  };

  const handleFileUpload = (fileName: string) => {
    setUploadingFile(fileName);
    setUploadProgress(0);
    setUploadError(false);

    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);

    uploadTimerRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(uploadTimerRef.current);
          return 100;
        }
        // Occasional transient error simulation at 60%
        if (prev === 60 && Math.random() > 0.7) {
          clearInterval(uploadTimerRef.current);
          setUploadError(true);
          return 60;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCancelUpload = () => {
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    setUploadProgress(null);
    setUploadingFile(null);
    setUploadError(false);
  };

  const handleRetryUpload = () => {
    if (uploadingFile) {
      handleFileUpload(uploadingFile);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Pipeline Dashboard */}
      {uploadingFile && (
        <div className="p-4 bg-card border border-border/60 rounded-xl flex flex-col gap-3 select-none">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">Uploading: {uploadingFile}</span>
            {uploadProgress !== null && !uploadError && (
              <span className="font-mono text-primary font-bold">{uploadProgress}%</span>
            )}
            {uploadError && <span className="text-destructive font-bold">Failed</span>}
          </div>

          {!uploadError ? (
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress || 0}%` }}
              />
            </div>
          ) : (
            <div className="text-[10px] text-destructive font-medium">
              Transient upload failure. Max file size validation (50MB) and network status checked.
            </div>
          )}

          <div className="flex justify-end gap-2 text-[10px] mt-1">
            {uploadError ? (
              <>
                <button onClick={handleCancelUpload} className="text-muted-foreground hover:underline font-bold">Cancel</button>
                <button onClick={handleRetryUpload} className="text-primary hover:underline font-bold">Retry Upload</button>
              </>
            ) : (
              <button onClick={handleCancelUpload} className="text-destructive hover:underline font-bold">Cancel</button>
            )}
          </div>
        </div>
      )}

      {/* Header and Creator */}
      <div className="flex justify-between items-center select-none pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Syllabus Lessons</h4>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)} className="text-xs h-9 px-4 gap-1">
          <span className="font-bold">+</span> Add Lesson
        </Button>
      </div>

      {/* Lessons List */}
      {loading ? (
        <div className="p-6 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading lessons index...</span>
        </div>
      ) : lessons.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/60 rounded-xl bg-card">
          <span className="text-xs text-muted-foreground">No lessons currently mapped.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lessons.map((l, index) => (
            <div key={l.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all select-none">
              <div className="flex gap-3 items-center">
                <span className="font-mono text-[10px] text-muted-foreground font-bold">{index + 1}.</span>
                <div>
                  <h5 className="text-xs font-bold text-foreground font-heading">{l.title}</h5>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                    <span>Duration: {l.duration}</span>
                    <Badge variant={l.status === 'PUBLISHED' ? 'success' : 'warning'}>{l.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => handleFileUpload(`lesson_${index + 1}_slides.pdf`)}
                  className="text-primary hover:underline font-bold"
                >
                  Upload Slide
                </button>
                <button
                  onClick={() => handleTogglePublish(l.id)}
                  className="text-primary hover:underline font-bold"
                >
                  {l.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDeleteLesson(l.id)}
                  className="text-destructive hover:underline font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-card border-border text-card-foreground shadow-2xl">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-card-foreground text-base font-bold font-heading">Add Lesson Module</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Specify name and duration slots.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Lesson Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lesson 1.3: Fundamental Theorem of Calculus"
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Estimated Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-xs h-9 px-4 border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="text-xs h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
                    disabled={!title}
                  >
                    Save Lesson
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
