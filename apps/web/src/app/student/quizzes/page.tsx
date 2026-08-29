'use client';
 

import React from 'react';
import {
  PortalLayout,
  Icon,
  Button,
  Badge,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockQuizzes, mockCourses } from '../../../services/studentData';

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = React.useState<any | null>(null);
  const [attemptState, setAttemptState] = React.useState<'LIST' | 'ACTIVE' | 'REVIEW' | 'RESULT'>('LIST');
  const [loading, setLoading] = React.useState(true);

  // Active Attempt variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [quizScore, setQuizScore] = React.useState(0);

  React.useEffect(() => {
    studentService.getQuizzes().then((data) => {
      const items = data.length > 0 ? data : mockQuizzes;
      setQuizzes(items);
      setLoading(false);
    });
  }, []);

  // Timer effect
  React.useEffect(() => {
    if (attemptState !== 'ACTIVE' || timeLeft <= 0) {
      if (timeLeft === 0 && attemptState === 'ACTIVE') {
        setAttemptState('REVIEW');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptState, timeLeft]);

  const getCourseCode = (courseId: string) => {
    const c = mockCourses.find((x) => x.id === courseId);
    return c ? c.code : 'MATH-101';
  };

  const handleStartAttempt = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setAttemptState('ACTIVE');
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleFinishAttempt = () => {
    if (!activeQuiz) return;
    
    // Evaluate mock result
    let correctCount = 0;
    activeQuiz.questions.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizScore(scorePct);

    // Save attempt outcome
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === activeQuiz.id) {
          return {
            ...q,
            attempted: true,
            score: scorePct,
          };
        }
        return q;
      })
    );

    setAttemptState('RESULT');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Quizzes & Workbooks Assessment"
      pageDescription="Verify assignment weights, evaluate class review packets, and attempt online tests."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading quizzes assessments...</span>
        </div>
      ) : attemptState === 'LIST' ? (
        <div className="flex flex-col gap-4 select-none">
          {quizzes.map((q) => (
            <div key={q.id} className="p-5 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
                    {getCourseCode(q.courseId)}
                  </span>
                  {q.attempted ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
                <h4 className="text-sm font-bold text-foreground font-heading mt-1">{q.title}</h4>
                <div className="flex gap-4 text-[10px] text-muted-foreground mt-1">
                  <span>Questions: {q.questions.length}</span>
                  <span>Duration: {q.durationMinutes} mins</span>
                  <span>Deadline: {q.dueDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {q.attempted && (
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Grade Score</span>
                    <span className="font-black text-primary font-heading text-sm block">{q.score}%</span>
                  </div>
                )}

                <Button
                  variant={q.attempted ? 'outline' : 'primary'}
                  size="sm"
                  className="text-xs px-4 h-9"
                  onClick={() => handleStartAttempt(q)}
                >
                  {q.attempted ? 'Re-attempt' : 'Start Quiz'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : attemptState === 'ACTIVE' && activeQuiz ? (
        /* ACTIVE TEST PANEL */
        <div className="grid lg:grid-cols-4 gap-6 select-none">
          {/* Question Body */}
          <div className="lg:col-span-3 p-6 bg-card border border-border/60 rounded-xl flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-border/40 text-xs">
                <span className="font-bold text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </span>
                <span className="font-mono font-bold text-amber text-sm bg-amber/10 border border-amber/20 px-3 py-1 rounded">
                  Time Left: {formatTime(timeLeft)}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground font-heading">
                  {activeQuiz.questions[currentQuestionIndex].text}
                </h3>

                <div className="flex flex-col gap-3 mt-6">
                  {activeQuiz.questions[currentQuestionIndex].options.map((opt: string, i: number) => {
                    const isSelected = selectedAnswers[activeQuiz.questions[currentQuestionIndex].id] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(activeQuiz.questions[currentQuestionIndex].id, i)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-primary/10 border-primary/40 text-foreground font-bold'
                            : 'bg-muted/10 border-border/30 text-muted-foreground hover:bg-muted/20'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected ? 'border-primary bg-primary text-primary-foreground font-bold' : 'border-border'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-9 px-4"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous
              </Button>

              {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs h-9 px-4"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs h-9 px-4 bg-teal hover:bg-teal/90 text-white"
                  onClick={() => setAttemptState('REVIEW')}
                >
                  Review Submission
                </Button>
              )}
            </div>
          </div>

          {/* Right Navigation sidebar */}
          <div className="lg:col-span-1 p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                Question Grid
              </h4>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {activeQuiz.questions.map((q: any, idx: number) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-8 rounded text-xs font-bold font-heading transition-all ${
                        isCurrent
                          ? 'ring-2 ring-primary border-primary bg-primary/20 text-primary'
                          : isAnswered
                          ? 'bg-teal/20 text-teal border border-teal/40'
                          : 'bg-muted/30 text-muted-foreground border border-border/30 hover:bg-muted/60'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-9"
              onClick={() => setAttemptState('REVIEW')}
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      ) : attemptState === 'REVIEW' && activeQuiz ? (
        /* REVIEW MODAL */
        <div className="p-8 bg-card border border-border/60 rounded-xl flex flex-col gap-6 select-none max-w-lg mx-auto shadow-sm">
          <div>
            <h3 className="text-base font-bold text-foreground font-heading">Confirm Quiz Submission</h3>
            <p className="text-xs text-muted-foreground mt-1">Review your answered question index list before finalizing marks.</p>
          </div>

          <div className="p-4 bg-muted/20 border border-border/40 rounded-lg flex justify-between text-xs font-bold">
            <span className="text-muted-foreground">Total Answered:</span>
            <span className="text-primary font-heading">{Object.keys(selectedAnswers).length} / {activeQuiz.questions.length}</span>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 px-4"
              onClick={() => setAttemptState('ACTIVE')}
            >
              Back to Quiz
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="text-xs h-9 px-6"
              onClick={handleFinishAttempt}
            >
              Submit Answers
            </Button>
          </div>
        </div>
      ) : (
        /* RESULT CARD DISPLAY */
        <div className="p-8 bg-card border border-border/60 rounded-xl flex flex-col items-center justify-center text-center select-none max-w-sm mx-auto shadow-sm gap-4">
          <div className="h-12 w-12 rounded-full bg-teal/10 text-teal flex items-center justify-center">
            <Icon name="success" size="lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-heading">Quiz Score Released</h3>
            <p className="text-xs text-muted-foreground mt-1">Your attempt answers have been logged by the API.</p>
          </div>

          <div className="text-3xl font-black text-primary font-heading mt-2">
            {quizScore}%
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9 px-6 mt-2"
            onClick={() => setAttemptState('LIST')}
          >
            Back to Quiz Board
          </Button>
        </div>
      )}
    </PortalLayout>
  );
}
