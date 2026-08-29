'use client';
 

import React from 'react';
import {
  PortalLayout,
  Icon,
  Badge,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockCourses } from '../../../services/studentData';

export default function StudentAttendancePage() {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    studentService.getCourses().then((data) => {
      setCourses(data.length > 0 ? data : mockCourses);
      setLoading(false);
    });
  }, []);

  const attendanceLogs = [
    { date: '2026-07-28', courseCode: 'MATH-101', status: 'PRESENT', remark: 'Regular session' },
    { date: '2026-07-28', courseCode: 'PHYS-202', status: 'PRESENT', remark: 'Regular session' },
    { date: '2026-07-27', courseCode: 'MATH-101', status: 'PRESENT', remark: 'Regular session' },
    { date: '2026-07-27', courseCode: 'CS-301', status: 'PRESENT', remark: 'Regular session' },
    { date: '2026-07-23', courseCode: 'PHYS-202', status: 'EXCUSED_ABSENT', remark: 'Medical permit submitted' },
    { date: '2026-07-22', courseCode: 'CS-301', status: 'LATE', remark: 'Delayed by transit check' },
    { date: '2026-07-20', courseCode: 'MATH-101', status: 'PRESENT', remark: 'Regular session' },
  ];

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Attendance Logs"
      pageDescription="Monitor class hours check-ins, excused absence records, and credit rules limits."
    >
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card border border-border/30 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* 1. Statistics Summary Grid */}
          <div className="grid md:grid-cols-3 gap-6 select-none">
            {courses.map((c) => {
              const attendanceVal = c.attendancePercent ?? 98;
              const isWarning = attendanceVal < 95;
              return (
                <div key={c.id} className="p-6 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col justify-between h-[160px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-bold">
                        {c.code}
                      </span>
                      <Badge variant={isWarning ? 'warning' : 'success'}>
                        {isWarning ? 'Review Needed' : 'Good Standing'}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-foreground font-heading mt-3">{c.title}</h4>
                  </div>
                  <div className="flex justify-between items-baseline mt-4">
                    <span className="text-[10px] text-muted-foreground">Attendance Quota:</span>
                    <span className={`text-xl font-black ${isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {attendanceVal}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Absence warning alert card */}
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-foreground/80 leading-relaxed flex items-start gap-3 select-none">
            <Icon name="warning" className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-foreground mb-1">Absence Warnings & Compliance Policy</h4>
              <p>
                University academic affairs require a minimum of <strong>90.0%</strong> attendance to qualify for course credits.
                If your attendance in any module drops below 92%, you will receive an automated registrar notice.
                Excused absences require uploading certified medical notes within 5 operational days.
              </p>
            </div>
          </div>

          {/* 3. Session Logs Table */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-foreground font-heading">Session Check-In History</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-border/65 text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Course Code</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((log, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/15">
                      <td className="py-3 px-4 text-foreground font-medium">{log.date}</td>
                      <td className="py-3 px-4 font-semibold text-muted-foreground">{log.courseCode}</td>
                      <td className="py-3 px-4">
                        <Badge variant={log.status === 'PRESENT' ? 'success' : log.status === 'LATE' ? 'warning' : 'error'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{log.remark}</td>
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
