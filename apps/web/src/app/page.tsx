'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '../components/PublicLayout';
import SectionHeader from '../components/ui/SectionHeader';
import CourseCard from '../components/ui/CourseCard';
import TeacherCard from '../components/ui/TeacherCard';
import SubjectCard from '../components/ui/SubjectCard';
import FAQAccordion from '../components/ui/FAQAccordion';
import Rating from '../components/ui/Rating';
import { coursesRepository } from '../repositories/CoursesRepository';
import { teachersRepository } from '../repositories/TeachersRepository';
import { subjectsRepository } from '../repositories/SubjectsRepository';
import { pricingRepository } from '../repositories/PricingRepository';
import { testimonialsRepository } from '../repositories/TestimonialsRepository';
import { Button, Card } from '@eduverse/ui';
import { Search, GraduationCap, Users, BookOpen, Check, Flame, Zap, Sparkles, ArrowRight } from 'lucide-react';

const INITIAL_COURSES = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    code: 'MATH-101',
    slug: 'calculus-i-limits-integration',
    title: 'الرياضيات والتفاضل والتكامل',
    description: 'أساسيات ومفاهيم التفاضل والتكامل والتطبيقات العملية.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    instructorName: 'د. سارة أحمد',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    category: 'الرياضيات',
    price: 49.99,
    rating: 4.9,
    reviewsCount: 145,
    studentsCount: 1420,
    gradeLevel: 'الثانوية العامة - الجامعات',
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    code: 'PHYS-202',
    slug: 'quantum-physics-modern-wave-mechanics',
    title: 'الفيزياء الحديثة والكهربية',
    description: 'شرح الفيزياء الحديثة والميكانيكا والكهربية المتقدمة.',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    instructorName: 'د. طارق علي',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'العلوم والفيزياء',
    price: 79.99,
    rating: 4.8,
    reviewsCount: 88,
    studentsCount: 850,
    gradeLevel: 'الثانوية العامة - الجامعات',
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    code: 'CS-301',
    slug: 'systems-architecture-operating-systems',
    title: 'أساسيات البرمجة ونظم التشغيل',
    description: 'شرح هندسة الحاسب ونظم التشغيل والبرمجة باللغات الحديثة.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    instructorName: 'أ. محمد عبد الله',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'تكنولوجيا المعلومات',
    price: 0,
    rating: 5.0,
    reviewsCount: 210,
    studentsCount: 2100,
    gradeLevel: 'المستوى المتقدم',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>(INITIAL_COURSES);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      coursesRepository.getFeatured(),
      teachersRepository.getAll(),
      subjectsRepository.getAll(),
      pricingRepository.getAll(),
      testimonialsRepository.getAll(),
    ]).then(([featuredCourses, allTeachers, allSubjects, allPlans, allTestimonials]) => {
      if (featuredCourses && featuredCourses.length > 0) setCourses(featuredCourses);
      if (allTeachers && allTeachers.length > 0) setTeachers(allTeachers.slice(0, 3));
      if (allSubjects) setSubjects(allSubjects);
      if (allPlans) setPlans(allPlans.slice(0, 3));
      if (allTestimonials) setTestimonials(allTestimonials);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const faqItems = [
    { question: 'What is EduVerse Youth Matrix?', answer: 'EduVerse is the #1 gamified learning ecosystem designed specifically for students aged 14+. It turns studying into an engaging quest with daily XP rewards, streaks, certified professors, and live peer study lounges.' },
    { question: 'Can I start learning for free?', answer: 'Yes! Create a free student profile to claim 500 XP immediately, access our open video modules, and preview any course.' },
    { question: 'How do XP levels and streaks work?', answer: 'Every video you watch, quiz you solve, or assignment you submit earns you XP points. Maintain a daily study streak (🔥) to unlock special badges and level up your student rank.' },
    { question: 'Can parents monitor my progress?', answer: 'Yes! Parents can link their profile using your unique Student Code to inspect attendance, GPA progress, and exam calendars.' },
  ];

  return (
    <PublicLayout>
      <div className="space-y-24 select-none">
        
        {/* 🚀 HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center text-center py-16 md:py-28 max-w-5xl mx-auto space-y-8 animate-fade-in">
          
          {/* Animated Background Glow Accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Gamified Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-black tracking-widest uppercase font-heading shadow-sm">
            <Flame size={14} className="text-amber fill-amber" /> #1 GAMIFIED LEARNING PLATFORM FOR TEENS (14+)
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-heading leading-tight text-foreground max-w-4xl">
            Master Any Subject.{' '}
            <span className="bg-gradient-to-r from-primary via-amber to-teal bg-clip-text text-transparent drop-shadow-sm">
              Level Up Your Mind ⚡
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn studying into an engaging quest. Earn daily <span className="text-primary font-bold">XP rewards</span>, maintain your <span className="text-amber font-bold">🔥 7-day streak</span>, learn from top certified professors, and collaborate in live peer lounges.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto flex items-center gap-2 p-2 bg-card border border-border rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300 shadow-sm">
            <Search className="absolute left-4 text-muted-foreground shrink-0" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, physics, coding, math, teachers..."
              className="w-full pl-12 pr-4 py-2.5 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <Zap size={14} className="fill-primary-foreground" /> Search
            </button>
          </form>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs py-3 px-8 rounded-2xl shadow-sm hover:scale-105 transition-all flex items-center gap-2 font-heading">
                <Sparkles size={15} /> Claim 500 Free XP & Register <ArrowRight size={14} />
              </button>
            </Link>
            <Link href="/courses">
              <button className="bg-card hover:bg-muted text-foreground font-bold text-xs py-3 px-7 rounded-2xl border border-border transition-all flex items-center gap-1.5">
                <BookOpen size={14} className="text-teal" /> Browse Courses
              </button>
            </Link>
          </div>

          {/* Gamified Core Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 border-t border-border w-full text-foreground max-w-3xl">
            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center hover:border-primary/40 transition-all shadow-sm">
              <span className="text-xl sm:text-3xl font-black font-heading text-primary">
                12,000+
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Active Scholars</span>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center hover:border-teal/40 transition-all shadow-sm">
              <span className="text-xl sm:text-3xl font-black font-heading text-teal">
                850K+
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Quests Solved</span>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center hover:border-amber/40 transition-all shadow-sm">
              <span className="text-xl sm:text-3xl font-black font-heading text-amber">
                98.4%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Mastery Rate</span>
            </div>
          </div>
        </section>

        {/* 📚 FEATURED COURSES SECTION */}
        <section className="space-y-6">
          <SectionHeader
            badge="Featured Quests"
            title="Popular Curriculum Modules"
            subtitle="Acquire real-world capabilities. Inspect curriculum structures, watch preview videos, and earn XP badges."
            viewAllLink="/courses"
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-card border border-border rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>

        {/* 👨‍🏫 POPULAR TEACHERS SECTION */}
        <section className="space-y-6">
          <SectionHeader
            badge="Certified Mentors"
            title="Learn From Expert Instructors"
            subtitle="Study directly from doctorate faculty, master researchers, and top academic creators."
            viewAllLink="/teachers"
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-card border border-border rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </section>

        {/* 🏷️ SUBJECTS/CATEGORIES SECTION */}
        <section className="space-y-6">
          <SectionHeader
            badge="Academic Tracks"
            title="Browse Subjects & Specialties"
            subtitle="Navigate your desired academic track. Inspect target grade levels, topics, and video lessons."
            viewAllLink="/subjects"
          />

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-card border border-border rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </section>

        {/* ⚙️ 5. PLATFORM EXPERIENCES */}
        <section className="space-y-6">
          <SectionHeader
            badge="Ecosystem Features"
            title="One Portal. Three Tailored Experiences."
            subtitle="Whether you are a student leveling up, a teacher creating interactive rubrics, or a parent tracking GPA, we have built features for you."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-base font-extrabold font-heading text-card-foreground">Student Quest Matrix</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Attend interactive video sessions, complete assignments with instant rubrics, level up your XP rank, and track your GPA growth graphs.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm hover:border-teal/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-teal/10 text-teal border border-teal/20 flex items-center justify-center font-bold">
                <Users size={24} />
              </div>
              <h3 className="text-base font-extrabold font-heading text-card-foreground">Parent Progress Portal</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Securely link children using their student code. Check attendance check-ins, verify test calendars, communicate with mentors, and pay invoices.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm hover:border-amber/40 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-amber/10 text-amber border border-amber/20 flex items-center justify-center font-bold">
                <BookOpen size={24} />
              </div>
              <h3 className="text-base font-extrabold font-heading text-card-foreground">Mentor Studio Builders</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Design syllabus paths, upload lesson files (videos, slides, PDFs), draft question banks, grade homework sets, and trace class analytics dashboards.
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="space-y-12">
          <SectionHeader
            badge="Testimonials"
            title="Trusted by Students and Parents Worldwide"
            subtitle="Read verified reviews from active community participants who have transformed their learning tracks."
          />

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-card border border-border rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.id} className="bg-card border border-border text-card-foreground p-6 rounded-2xl flex flex-col justify-between h-[180px] shadow-sm">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-3 mt-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-card-foreground font-heading">{t.name}</h4>
                      <span className="text-[9px] text-muted-foreground">{t.role}</span>
                    </div>
                    <div className="ml-auto">
                      <Rating value={t.rating} size={10} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* PRICING SECTION */}
        <section className="space-y-12">
          <SectionHeader
            badge="Pricing"
            title="Transparent Pricing for Every Learning Goal"
            subtitle="Choose a plan that fits your schedule. Access individual courses, specialized bundles, or full annual passes."
            viewAllLink="/pricing"
            viewAllText="View Full Plans & FAQs"
          />

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-card border border-border rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-card border rounded-2xl p-6 flex flex-col justify-between h-[420px] shadow-sm ${
                    plan.popular ? 'border-primary shadow-sm' : 'border-border'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-extrabold font-heading text-card-foreground uppercase tracking-wider">{plan.name}</h3>
                      {plan.popular && (
                        <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                          Popular
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-baseline gap-1 text-card-foreground">
                      <span className="text-3xl font-black font-heading">{plan.price}</span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        / {plan.period === 'one-time' ? 'lifetime' : plan.period}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">{plan.description}</p>
                    
                    <ul className="space-y-2 text-[10px] text-card-foreground pt-2 border-t border-border">
                      {(plan.features || []).slice(0, 4).map((f: string) => (
                        <li key={f} className="flex items-start gap-1.5">
                          <Check size={12} className="text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href='/pricing' className="block w-full pt-4">
                    <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full text-xs font-bold py-2 shadow-sm">
                      {plan.ctaText}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ SECTION */}
        <section className="space-y-12">
          <SectionHeader
            badge="FAQs"
            title="Frequently Asked Questions"
            subtitle="Got questions? We have answers. Learn about registration, course materials, and subscription plans."
          />
          <FAQAccordion items={faqItems} />
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="bg-card border border-border p-8 md:p-12 rounded-3xl text-center space-y-6 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-teal/5 opacity-80 pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-black font-heading text-card-foreground tracking-tight">
            Ready to Begin Your Educational Journey?
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create a free student profile, check our teacher directory, or became an instructor and build your own classroom workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button variant="primary" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-6 shadow-sm font-heading">
                Create Free Account
              </Button>
            </Link>
            <Link href="/become-instructor">
              <Button variant="outline" className="text-foreground border-border hover:bg-muted text-xs py-2.5 px-6">
                Become Instructor
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
