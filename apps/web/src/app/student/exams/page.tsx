'use client';
 

import React from 'react';
import {
  PortalLayout,
  Badge,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockExams, mockCourses } from '../../../services/studentData';

export default function StudentExamsPage() {
  const [exams, setExams] = React.useState<any[]>([]);
  const [selectedExam, setSelectedExam] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    studentService.getExams().then((data) => {
      const items = data.length > 0 ? data : mockExams;
      setExams(items);
      if (items.length > 0) {
        setSelectedExam(items[0]);
      }
      setLoading(false);
    });
  }, []);

  const getCourseCode = (courseId: string) => {
    const c = mockCourses.find((x) => x.id === courseId);
    return c ? c.code : 'MATH-101';
  };

  const upcomingExams = exams.filter((e) => !e.result);
  const examHistory = exams.filter((e) => e.result);

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Exams & Midterms"
      pageDescription="Verify room slots, read exam instructions, and view final scores."
    >
      {loading ? (
        <div className="flex justify-center p-12 animate-pulse">
          <span className="text-xs text-muted-foreground">Loading exams lists...</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side: Exams List */}
          <div className="lg:col-span-1 flex flex-col gap-6 select-none">
            {/* Upcoming */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
                Upcoming Exams
              </h4>
              {upcomingExams.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedExam(e)}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                    selectedExam?.id === e.id
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-card border-border/60 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded font-bold">
                      {getCourseCode(e.courseId)}
                    </span>
                    <Badge variant="warning">Scheduled</Badge>
                  </div>
                  <h5 className="text-xs font-bold text-foreground font-heading line-clamp-1">{e.title}</h5>
                  <span className="text-[10px] text-muted-foreground">Date: {e.date} | Room: {e.location}</span>
                </button>
              ))}
            </div>

            {/* Graded History */}
            <div className="flex flex-col gap-3 mt-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
                Graded Exams History
              </h4>
              {examHistory.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedExam(e)}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                    selectedExam?.id === e.id
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-card border-border/60 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded font-bold">
                      {getCourseCode(e.courseId)}
                    </span>
                    <Badge variant="success">Graded</Badge>
                  </div>
                  <h5 className="text-xs font-bold text-foreground font-heading line-clamp-1">{e.title}</h5>
                  {e.result && (
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1 w-full">
                      <span>Grade: {e.result.grade}</span>
                      <span className="font-semibold text-primary">{e.result.score} / {e.result.maxScore}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Detail instructions pane */}
          <div className="lg:col-span-2">
            {selectedExam ? (
              <div className="flex flex-col gap-6">
                {/* Overview Details */}
                <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
                  <div className="flex justify-between items-start pb-3 border-b border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        {getCourseCode(selectedExam.courseId)} Exam Card
                      </span>
                      <h3 className="text-lg font-bold text-foreground font-heading mt-1">
                        {selectedExam.title}
                      </h3>
                    </div>
                    {selectedExam.result ? (
                      <Badge variant="success">Result Graded</Badge>
                    ) : (
                      <Badge variant="warning">Room Assigned</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs select-none">
                    <div>
                      <span className="text-muted-foreground block font-bold">Scheduled Date</span>
                      <span className="font-semibold mt-0.5 block">{selectedExam.date}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-bold">Duration Slot</span>
                      <span className="font-semibold mt-0.5 block">{selectedExam.time}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-bold">Test Location</span>
                      <span className="font-semibold mt-0.5 block text-primary font-bold">{selectedExam.location}</span>
                    </div>
                  </div>
                </div>

                {/* Instructions checklist */}
                {selectedExam.instructions && selectedExam.instructions.length > 0 && (
                  <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                      Syllabus Exam Checklist Instructions
                    </h4>
                    <div className="flex flex-col gap-3">
                      {selectedExam.instructions.map((inst: string, idx: number) => (
                        <div key={idx} className="flex gap-3 text-xs text-foreground/80 leading-normal p-2.5 rounded bg-muted/20 border border-border/20">
                          <span className="font-bold text-primary shrink-0">{idx + 1}.</span>
                          <span>{inst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result overview if Graded */}
                {selectedExam.result && (
                  <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                      Grade summary
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Calculated Grade:</span>
                      <span className="font-black text-primary font-heading text-lg">{selectedExam.result.grade}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Score Received:</span>
                      <span className="font-bold text-foreground">{selectedExam.result.score} / {selectedExam.result.maxScore} points</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="text-xs text-muted-foreground">Select an exam to begin.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
