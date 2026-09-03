export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'slides';
  url: string;
  completed: boolean;
  notes?: string;
  bookmarked?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  courseId: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  grade?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  submissionHistory?: { date: string; fileName: string }[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  completed?: boolean;
  score?: number;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  courseId: string;
  instructions: string[];
  result?: { score: number; maxScore: number; grade: string };
}

export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  instructorEmail: string;
  instructorAvatar?: string;
  progress: number;
  category: 'Science' | 'Mathematics' | 'Humanities' | 'Tech';
  status: 'ACTIVE' | 'COMPLETED';
  lessons: Lesson[];
  syllabus: string;
  attendancePercent: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  pinned?: boolean;
  read?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'recipient';
  text: string;
  timestamp: string;
  attachment?: { name: string; url: string; size: string };
}

export interface ChatConversation {
  id: string;
  recipientName: string;
  recipientRole: string;
  recipientAvatar?: string;
  lastMessage: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export const mockCourses: Course[] = [
  {
    id: 'calculus-1',
    title: 'الرياضيات والتفاضل والتكامل',
    code: 'MATH-101',
    instructor: 'د. سارة أحمد',
    instructorEmail: 'sara@eduverse.com',
    progress: 75,
    category: 'الرياضيات',
    status: 'ACTIVE',
    syllabus: 'أساسيات ومفاهيم التفاضل والتكامل والتطبيقات العملية.',
    attendancePercent: 96.5,
    lessons: [
      { id: 'l1', title: 'Introduction to Limits & Continuity', duration: '45 mins', type: 'video', url: '/lessons/limits.mp4', completed: true },
      { id: 'l2', title: 'Limits Definition & Rules Document', duration: '15 pages', type: 'pdf', url: '/lessons/limits_handout.pdf', completed: true },
      { id: 'l3', title: 'The Derivative: Definition & Tangents', duration: '50 mins', type: 'video', url: '/lessons/derivative_tangents.mp4', completed: true },
      { id: 'l4', title: 'Differentiation Rules & Techniques Slides', duration: '24 slides', type: 'slides', url: '/lessons/differentiation_rules.pdf', completed: true },
      { id: 'l5', title: 'Integration: Riemann Sums & Fundamentals', duration: '60 mins', type: 'video', url: '/lessons/riemann_sums.mp4', completed: false, bookmarked: true },
      { id: 'l6', title: 'Integrals and Area Calculations Study', duration: '12 pages', type: 'pdf', url: '/lessons/integrals_area.pdf', completed: false },
    ],
  },
  {
    id: 'quantum-physics',
    title: 'الفيزياء الحديثة والكهربية',
    code: 'PHYS-202',
    instructor: 'د. طارق علي',
    instructorEmail: 'tarek@eduverse.com',
    progress: 40,
    category: 'العلوم والفيزياء',
    status: 'ACTIVE',
    syllabus: 'شرح الفيزياء الحديثة والميكانيكا والكهربية المتقدمة.',
    attendancePercent: 92.0,
    lessons: [
      { id: 'lp1', title: 'Blackbody Radiation & Quantum Origins', duration: '40 mins', type: 'video', url: '/lessons/blackbody.mp4', completed: true },
      { id: 'lp2', title: 'Wave-Particle Duality Handout Notes', duration: '8 pages', type: 'pdf', url: '/lessons/duality.pdf', completed: true },
      { id: 'lp3', title: 'Schrödinger Wave Equation Derivation', duration: '55 mins', type: 'video', url: '/lessons/schrodinger.mp4', completed: false },
      { id: 'lp4', title: 'Infinite Square Well Quantization', duration: '32 slides', type: 'slides', url: '/lessons/square_well.pdf', completed: false },
    ],
  },
  {
    id: 'computer-systems',
    title: 'أساسيات البرمجة ونظم التشغيل',
    code: 'CS-301',
    instructor: 'أ. محمد عبد الله',
    instructorEmail: 'm.abdallah@eduverse.com',
    progress: 90,
    category: 'تكنولوجيا المعلومات',
    status: 'ACTIVE',
    syllabus: 'شرح هندسة الحاسب ونظم التشغيل والبرمجة باللغات الحديثة.',
    attendancePercent: 98.0,
    lessons: [
      { id: 'lc1', title: 'Assembly Syntax & CPU Pipeline Logic', duration: '55 mins', type: 'video', url: '/lessons/cpu_pipeline.mp4', completed: true },
      { id: 'lc2', title: 'Cache Memory Mapping & Hierarchy PDF', duration: '18 pages', type: 'pdf', url: '/lessons/cache_memory.pdf', completed: true },
      { id: 'lc3', title: 'Virtual Memory & Page Replacement slides', duration: '40 slides', type: 'slides', url: '/lessons/virtual_memory.pdf', completed: true },
      { id: 'lc4', title: 'Kernel Thread Scheduler Policies', duration: '50 mins', type: 'video', url: '/lessons/scheduler.mp4', completed: false },
    ],
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Problem Set 4: Definite Integrals',
    courseId: 'calculus-1',
    dueDate: '2026-08-05',
    status: 'PENDING',
    maxScore: 100,
  },
  {
    id: 'a2',
    title: 'Limits & Derivatives Diagnostic Review',
    courseId: 'calculus-1',
    dueDate: '2026-07-20',
    status: 'GRADED',
    score: 95,
    maxScore: 100,
    grade: 'A',
    feedback: 'Excellent limit proofs. Watch out for sign conventions in derivative chains.',
    submissionHistory: [{ date: '2026-07-19 14:20', fileName: 'Limits_Diagnostic_Final.pdf' }],
  },
  {
    id: 'a3',
    title: 'Schrödinger Derivation and Application Homework',
    courseId: 'quantum-physics',
    dueDate: '2026-08-10',
    status: 'SUBMITTED',
    maxScore: 50,
    submissionHistory: [{ date: '2026-07-28 09:15', fileName: 'Schrodinger_Assignment_Sophia.pdf' }],
  },
  {
    id: 'a4',
    title: 'L1/L2 Cache Prefetch Simulator Implementation',
    courseId: 'computer-systems',
    dueDate: '2026-07-15',
    status: 'GRADED',
    score: 48,
    maxScore: 50,
    grade: 'A',
    feedback: 'Simulation statistics match specs perfectly. Cache hit calculations are correct.',
    submissionHistory: [{ date: '2026-07-14 23:45', fileName: 'cache_simulator_v2.tar.gz' }],
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Integration by Substitution Quiz',
    courseId: 'calculus-1',
    timeLimitMinutes: 15,
    questions: [
      { id: 'q1_1', text: 'What is the integral of 2x * e^(x^2) dx using u-substitution?', options: ['e^(x^2) + C', '2e^(x^2) + C', 'x^2 * e^x + C', '1/2 * e^(x^2) + C'], correctIndex: 0 },
      { id: 'q1_2', text: 'Which substitution is appropriate for integral of x / (x^2 + 1) dx?', options: ['u = x', 'u = x^2 + 1', 'u = 1/x', 'u = sqrt(x)'], correctIndex: 1 },
      { id: 'q1_3', text: 'What is the derivative of substitution parameter u relative to x?', options: ['du/dx', 'dx/du', 'u\'(y)', '0'], correctIndex: 0 },
    ],
  },
  {
    id: 'q2',
    title: 'Photoelectric Effect Fundamentals',
    courseId: 'quantum-physics',
    timeLimitMinutes: 10,
    completed: true,
    score: 80,
    questions: [
      { id: 'q2_1', text: 'Who proposed the mathematical explanation of photoelectric effects?', options: ['Max Planck', 'Albert Einstein', 'Niels Bohr', 'Louis de Broglie'], correctIndex: 1 },
      { id: 'q2_2', text: 'The kinetic energy of photoelectrons is independent of light intensity.', options: ['True', 'False'], correctIndex: 0 },
    ],
  },
];

export const mockExams: Exam[] = [
  {
    id: 'e1',
    title: 'Midterm Examination: Differential Calculus',
    date: '2026-08-12',
    time: '09:00 - 11:30',
    location: 'Syllabus Auditorium B',
    courseId: 'calculus-1',
    instructions: [
      'Bring scientific calculator only. Graphing models are strictly prohibited.',
      'A formula sheet will be provided. No personal notes permitted.',
      'Show full derivation workflows for each derivative step.',
    ],
  },
  {
    id: 'e2',
    title: 'Systems & Operating Kernels Midterm',
    date: '2026-07-22',
    time: '14:00 - 16:00',
    location: 'Engineering Science Room 402',
    courseId: 'computer-systems',
    instructions: [],
    result: { score: 92, maxScore: 100, grade: 'A' },
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'an1',
    title: 'Midterm Exam Schedule Released',
    content: 'The official schedule for all mid-semester exams has been finalized. Calculus is scheduled for August 12 in Auditorium B. Review instructions inside the exam portal block.',
    date: '2026-07-28',
    author: 'Registrar Academic Affairs',
    pinned: true,
  },
  {
    id: 'an2',
    title: 'Physics Lab Session Shift Notice',
    content: 'Dr. Arthur Feynman’s modern wave lab scheduled for this Wednesday will be moved to the Engineering annex room 112 to permit calibration tests.',
    date: '2026-07-27',
    author: 'Physics Department Staff',
    pinned: false,
    read: false,
  },
];

export const mockConversations: ChatConversation[] = [
  {
    id: 'c1',
    recipientName: 'Dr. Emily Watson',
    recipientRole: 'Calculus Instructor',
    unreadCount: 1,
    lastMessage: 'Let me look at your derivative formulas tomorrow.',
    messages: [
      { id: 'm1_1', sender: 'student', text: 'Hello Dr. Emily. I was confused by calculus problem sheet question 3.', timestamp: '14:00' },
      { id: 'm1_2', sender: 'recipient', text: 'Hi Sophia. Remember to apply the chain rule parameters before simplification.', timestamp: '14:15' },
      { id: 'm1_3', sender: 'student', text: 'Ah, I see it now. I forgot to take the derivative of the inner quotient.', timestamp: '14:20' },
      { id: 'm1_4', sender: 'recipient', text: 'Let me look at your derivative formulas tomorrow.', timestamp: '14:25', attachment: { name: 'Chain_Rule_Examples.pdf', url: '#', size: '1.2 MB' } },
    ],
  },
  {
    id: 'c2',
    recipientName: 'Alex Mercer',
    recipientRole: 'Science classmate',
    unreadCount: 0,
    lastMessage: 'Are we studying together at the library?',
    messages: [
      { id: 'm2_1', sender: 'recipient', text: 'Are we studying together at the library?', timestamp: 'Yesterday' },
    ],
  },
];

export const studentGPA = {
  overallGPA: 3.82,
  completedCredits: 42,
  targetGPA: 4.0,
  history: [
    { label: 'Semester 1', value: 3.65 },
    { label: 'Semester 2', value: 3.75 },
    { label: 'Semester 3', value: 3.85 },
    { label: 'Semester 4', value: 3.92 },
  ],
};
