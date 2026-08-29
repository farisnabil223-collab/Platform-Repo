'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon, Badge } from '@eduverse/ui';
import { teacherAssignmentsService } from '../../../../../services/teacherAssignmentsService';

export default function CourseAssignmentsTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Grading states
  const [gradingSub, setGradingSub] = React.useState<any | null>(null);
  const [score, setScore] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  const fetchAssignments = () => {
    setLoading(true);
    // Fetch mock/real assignments
    setAssignments([
      { id: 'a1', title: 'Calculus Assignment 1: Limit Computations', dueDate: '2026-08-05', weight: '10%' },
      { id: 'a2', title: 'Calculus Assignment 2: Riemann Integrals Outline', dueDate: '2026-08-12', weight: '15%' },
    ]);
    setSubmissions([
      { id: 's1', studentName: 'Sophia Johnson', email: 'student@eduverse.com', submittedAt: 'Yesterday at 14:02', status: 'PENDING', score: null, feedback: '' },
      { id: 's2', studentName: 'Liam Davies', email: 'liam.davies@eduverse.com', submittedAt: 'Today at 09:12', status: 'GRADED', score: 92, feedback: 'Excellent analytical proofs.' },
    ]);
    setSelectedAssignment({ id: 'a1', title: 'Calculus Assignment 1: Limit Computations', dueDate: '2026-08-05', weight: '10%' });
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub || !score) return;

    try {
      await teacherAssignmentsService.gradeSubmission(gradingSub.id, {
        score: parseInt(score),
        feedback,
        grade: parseInt(score) >= 90 ? 'A' : 'B',
      });
    } catch (err) {
      // Local state fallback update
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === gradingSub.id
            ? { ...s, status: 'GRADED', score: parseInt(score), feedback }
            : s
        )
      );
    }
    setGradingSub(null);
    setScore('');
    setFeedback('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Homework List */}
      <div className="lg:col-span-1 flex flex-col gap-4 select-none">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
          Assignment List
        </h4>
        {loading ? (
          <div className="p-4 text-center animate-pulse">
            <span className="text-xs text-muted-foreground">Loading homework...</span>
          </div>
        ) : (
          assignments.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAssignment(a)}
              className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                selectedAssignment?.id === a.id
                  ? 'bg-primary/10 border-primary/40'
                  : 'bg-card border-border/60 hover:bg-muted/30'
              }`}
            >
              <h5 className="text-xs font-bold text-foreground font-heading">{a.title}</h5>
              <span className="text-[10px] text-muted-foreground">Due: {a.dueDate} | Weight: {a.weight}</span>
            </button>
          ))
        )}
      </div>

      {/* Right: Submissions List */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {selectedAssignment ? (
          <>
            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground font-heading">{selectedAssignment.title} Submissions</h3>
              <p className="text-[10px] text-muted-foreground">Review student PDF sheets and submit grading points.</p>
            </div>

            <div className="flex flex-col gap-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all select-none">
                  <div className="flex gap-3 items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {sub.studentName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground font-heading">{sub.studentName}</h5>
                      <span className="text-[10px] text-muted-foreground block">Uploaded: {sub.submittedAt}</span>
                      {sub.status === 'GRADED' && (
                        <span className="text-[10px] text-primary font-bold block mt-1 font-heading">Score: {sub.score}% | Feedback: "{sub.feedback}"</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={sub.status === 'GRADED' ? 'success' : 'warning'}>{sub.status}</Badge>
                    <button
                      onClick={() => {
                        setGradingSub(sub);
                        setScore(sub.score ? String(sub.score) : '');
                        setFeedback(sub.feedback || '');
                      }}
                      className="text-primary hover:underline font-bold text-xs"
                    >
                      {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-xl bg-card">
            <span className="text-xs text-muted-foreground">Select an assignment to begin.</span>
          </div>
        )}
      </div>

      {/* Grading Modal overlay */}
      {gradingSub && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-card border-border text-card-foreground shadow-2xl">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-card-foreground text-base font-bold font-heading">Grade Student Submission</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Student: {gradingSub.studentName}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Score Received (0 - 100%)</label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="e.g. 95"
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Feedback Comments</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write grading feedback remarks..."
                    className="p-2.5 h-20 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setGradingSub(null)}
                    className="text-xs h-9 px-4 border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="text-xs h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
                    disabled={!score}
                  >
                    Submit Grade
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
