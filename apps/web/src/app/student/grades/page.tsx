'use client';
 

import React from 'react';
import {
  PortalLayout,
  Icon,
  Badge,
  ChartWidget,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockCourses, mockAssignments, studentGPA } from '../../../services/studentData';

export default function StudentGradesPage() {
  const [gpa, setGpa] = React.useState<any>(null);
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      studentService.getGPA(),
      studentService.getAssignments(),
    ]).then(([gpaData, assignmentsData]) => {
      setGpa(gpaData || studentGPA);
      setAssignments(assignmentsData.length > 0 ? assignmentsData : mockAssignments);
      setLoading(false);
    });
  }, []);

  const getCourseCode = (courseId: string) => {
    const c = mockCourses.find((x) => x.id === courseId);
    return c ? c.code : 'MATH-101';
  };

  const gradedAssignments = assignments.filter((a) => a.status === 'GRADED');

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Academic Transcript & Grades"
      pageDescription="Monitor overall GPAs, course record cards, and weight distributions."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading academic transcript...</span>
        </div>
      ) : (
        <>
          {/* 1. GPAs summary */}
          <div className="grid md:grid-cols-3 gap-6 select-none">
            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Cumulative GPA</span>
              <div className="text-3xl font-black text-primary font-heading mt-2">{gpa.overallGPA}</div>
              <span className="text-[10px] text-muted-foreground mt-2 block">Calculated from 42 completed credits.</span>
            </div>

            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Term GPA Target</span>
              <div className="text-3xl font-black text-amber font-heading mt-2">{gpa.targetGPA}</div>
              <span className="text-[10px] text-muted-foreground mt-2 block">Dean's honor list target score.</span>
            </div>

            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Active Courses</span>
                <div className="text-xl font-bold text-foreground mt-2">3 Classes Enrolled</div>
              </div>
              <span className="text-[10px] text-emerald-500 mt-2 font-bold block flex items-center gap-1">
                <Icon name="success" size="sm" /> Academic standing: Excellent
              </span>
            </div>
          </div>

          {/* 2. Semester GPA progression chart */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartWidget
                title="GPA Progression History (Semesters 1 - 4)"
                type="line"
                data={gpa.history || []}
              />
            </div>

            <div className="lg:col-span-1 p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                Grading Scale Spec
              </h4>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between border-b border-border/30 pb-1">
                  <span className="font-semibold text-foreground">A (93% - 100%)</span>
                  <span className="text-muted-foreground">4.0 GPA points</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-1">
                  <span className="font-semibold text-foreground">A- (90% - 92%)</span>
                  <span className="text-muted-foreground">3.7 GPA points</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-1">
                  <span className="font-semibold text-foreground">B+ (87% - 89%)</span>
                  <span className="text-muted-foreground">3.3 GPA points</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-1">
                  <span className="font-semibold text-foreground">B (83% - 86%)</span>
                  <span className="text-muted-foreground">3.0 GPA points</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Detailed Graded Assignments Table */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-foreground font-heading">Graded Workbooks & Portfolios</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-border/65 text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Course</th>
                    <th className="py-3 px-4 font-bold">Assignment</th>
                    <th className="py-3 px-4 font-bold">Score</th>
                    <th className="py-3 px-4 font-bold">Grade</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gradedAssignments.map((a) => (
                    <tr key={a.id} className="border-b border-border/30 hover:bg-muted/15">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {getCourseCode(a.courseId)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{a.title}</td>
                      <td className="py-3 px-4 font-bold text-foreground">{a.score} / {a.maxScore}</td>
                      <td className="py-3 px-4 font-black text-primary font-heading">{a.grade}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">Graded</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </PortalLayout>
  );
}
