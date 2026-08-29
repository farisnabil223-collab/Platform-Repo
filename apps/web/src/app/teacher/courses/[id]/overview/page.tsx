'use client';
 

import React from 'react';
import { useParams } from 'next/navigation';
import { teacherCoursesService } from '../../../../../services/teacherCoursesService';

export default function CourseOverviewTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    teacherCoursesService.getCourseById(courseId).then((data) => {
      setCourse(data || {
        id: courseId,
        code: 'MATH-101',
        title: 'Calculus I',
        description: 'Limits, derivative computations, integration theory, and basic Riemann sums.',
      });
      setLoading(false);
    });
  }, [courseId]);

  const instructors = [
    { name: 'Dr. Emily Watson', role: 'Main Instructor', email: 'emily.watson@eduverse.com' },
  ];

  const studentRoster = [
    { id: '1', name: 'Sophia Johnson', email: 'student@eduverse.com', registrationDate: '2026-07-28' },
    { id: '2', name: 'Liam Davies', email: 'liam.davies@eduverse.com', registrationDate: '2026-07-27' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className="p-6 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading overview...</span>
        </div>
      ) : (
        <>
          {/* Syllabus Description */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-3 shadow-sm">
            <h4 className="text-sm font-bold text-foreground font-heading">Course Syllabus Description</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {course.description || 'Welcome to this syllabus. Review instructions and lesson materials under the tab options.'}
            </p>
          </div>

          {/* Roster & Faculty list */}
          <div className="grid md:grid-cols-2 gap-6 select-none">
            {/* Instructors */}
            <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 shadow-sm">
              <h4 className="text-sm font-bold text-foreground font-heading pb-2 border-b border-border/40">
                Course Instructors
              </h4>
              <div className="flex flex-col gap-3">
                {instructors.map((inst, i) => (
                  <div key={i} className="flex gap-3 items-center text-xs p-2.5 rounded bg-muted/20 border border-border/20">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      EW
                    </div>
                    <div>
                      <h5 className="font-bold text-foreground font-heading">{inst.name}</h5>
                      <span className="text-[9px] text-muted-foreground font-semibold">{inst.role} | {inst.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 shadow-sm">
              <h4 className="text-sm font-bold text-foreground font-heading pb-2 border-b border-border/40">
                Enrolled Students ({studentRoster.length})
              </h4>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px]">
                {studentRoster.map((stud) => (
                  <div key={stud.id} className="flex justify-between items-center text-xs p-2.5 rounded bg-muted/20 border border-border/20">
                    <div className="flex gap-3 items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {stud.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-foreground font-heading">{stud.name}</h5>
                        <span className="text-[9px] text-muted-foreground block">{stud.email}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-muted-foreground">Joined: {stud.registrationDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
