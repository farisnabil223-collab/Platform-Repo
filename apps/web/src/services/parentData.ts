export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  className: string;
  status: string;
  gpa: string;
  overallGPA: string;
  attendanceRate: string;
  absenceCount: number;
  lateCount: number;
  missingAssignments: number;
  standing: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const linkedChildren: ChildProfile[] = [
  {
    id: '8092ca8a-8a14-49c0-9993-bb5255476a26',
    name: 'Sophia Johnson',
    avatar: 'SJ',
    grade: 'Grade 11',
    className: 'Class 11-A',
    status: 'ACTIVE',
    gpa: '3.85',
    overallGPA: '3.80',
    attendanceRate: '96.2%',
    absenceCount: 2,
    lateCount: 1,
    missingAssignments: 0,
    standing: 'LOW',
  },
  {
    id: '7092ca8a-8a14-49c0-9993-bb5255476a26',
    name: 'Liam Johnson',
    avatar: 'LJ',
    grade: 'Grade 8',
    className: 'Class 8-C',
    status: 'ACTIVE',
    gpa: '3.12',
    overallGPA: '3.20',
    attendanceRate: '88.5%',
    absenceCount: 6,
    lateCount: 4,
    missingAssignments: 3,
    standing: 'HIGH',
  },
];

export const mockTimelineEvents = {
  '8092ca8a-8a14-49c0-9993-bb5255476a26': [
    { time: '08:30', title: 'Attendance Marked', desc: 'Recorded Present in Homeroom.', type: 'attendance' },
    { time: '10:20', title: 'Lesson Completed', desc: 'Completed "Derivatives Rules" video lesson.', type: 'academic' },
    { time: '13:00', title: 'Assignment Published', desc: 'Calculus Worksheet 4 due next Friday.', type: 'academic' },
    { time: '16:15', title: 'Assignment Submitted', desc: 'Uploaded Calculus Worksheet 4.', type: 'academic' },
    { time: '18:10', title: 'Teacher Feedback', desc: 'Emily Watson left a remark on Algebra Set.', type: 'feedback' },
  ],
  '7092ca8a-8a14-49c0-9993-bb5255476a26': [
    { time: '08:45', title: 'Late Arrival Recorded', desc: 'Marked Late for Homeroom period.', type: 'attendance' },
    { time: '11:15', title: 'Missing Homework Notice', desc: 'History Essay has passed its deadline.', type: 'alert' },
    { time: '14:30', title: 'Grade Released', desc: 'Scored B- (80%) on Science quiz.', type: 'academic' },
  ],
};

export const mockApprovals = [
  { id: '1', title: 'Museum of Fine Arts Field Trip', description: 'Transportation by bus, entry fee $15.', status: 'PENDING', childName: 'Sophia Johnson', date: 'August 12, 2026' },
  { id: '2', title: 'Science Lab Safety Waiver', description: 'Consent for chemistry lab experiments.', status: 'APPROVED', childName: 'Liam Johnson', date: 'July 20, 2026' },
];
