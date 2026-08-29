'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon, Badge } from '@eduverse/ui';
import { teacherQuizzesService } from '../../../../../services/teacherQuizzesService';

export default function CourseQuizzesTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Quiz Builder Modal states
  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [duration, setDuration] = React.useState('15');
  const [questions, setQuestions] = React.useState<{ text: string; options: string[]; correctOption: number }[]>([
    { text: 'What is the limit of sin(x)/x as x approaches 0?', options: ['0', '1', 'Infinity', 'Undefined'], correctOption: 1 },
  ]);

  const fetchQuizzes = () => {
    setLoading(true);
    setQuizzes([
      { id: 'q1', title: 'Calculus Quiz 1: Limit Computations', duration: 15, questionsCount: 5, attemptsCount: 14 },
      { id: 'q2', title: 'Calculus Quiz 2: Derivatives Shortcuts', duration: 20, questionsCount: 10, attemptsCount: 9 },
    ]);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      await teacherQuizzesService.createQuiz(courseId, { title, durationMinutes: parseInt(duration), questions });
      fetchQuizzes();
    } catch (err) {
      // Local state fallback update
      setQuizzes((prev) => [
        ...prev,
        { id: Math.random().toString(), title, duration: parseInt(duration), questionsCount: questions.length, attemptsCount: 0 },
      ]);
    }
    setTitle('');
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center select-none pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Active Quizzes</h4>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)} className="text-xs h-9 px-4 gap-1">
          <span className="font-bold">+</span> Create Quiz
        </Button>
      </div>

      {/* Quizzes List */}
      {loading ? (
        <div className="p-6 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading quizzes...</span>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/60 rounded-xl bg-card">
          <span className="text-xs text-muted-foreground">No quizzes currently created.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {quizzes.map((q) => (
            <div key={q.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-all select-none">
              <div>
                <h5 className="text-xs font-bold text-foreground font-heading">{q.title}</h5>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-1">
                  <span>Questions: {q.questionsCount}</span>
                  <span>Duration: {q.duration} mins</span>
                  <span>Attempts Completed: {q.attemptsCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-primary hover:underline font-bold text-xs">Preview</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Builder Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-card border-border text-card-foreground shadow-2xl">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-card-foreground text-base font-bold font-heading">Create Quiz Assessment</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Specify title limits and add sample multiple-choice questions.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Quiz Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Midterm 1 Calculus Quiz"
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
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
                    Save Quiz
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
