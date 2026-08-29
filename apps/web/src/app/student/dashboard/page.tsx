'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortalLayout } from '@eduverse/ui';
import { coursesRepository } from '../../../repositories/CoursesRepository';
import { mockExams } from '../../../services/studentData';
import { PlayCircle, Clock, Award, AlertTriangle, Star, Flame, Zap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesRepository.getAll().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const continueLearning = courses.filter((c) => c.status === 'ACTIVE' && c.progress > 0);
  const recommendedCourses = courses.filter((c) => c.progress === 0 || c.id === 'quantum-physics');
  const recentlyViewed = courses.slice(0, 2);
  const popularCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 2);
  const exams = mockExams.slice(0, 2);

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Student Quest Central"
      pageDescription="Track your XP level, maintain your daily streak, and master your subjects."
    >
      {loading ? (
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-primary font-bold tracking-widest uppercase font-heading">Loading Student Matrix...</span>
        </div>
      ) : (
        <div className="space-y-8 select-none animate-fade-in text-foreground">

          {/* 🚀 1. GAMIFIED STUDENT HERO BANNER */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-card border border-border shadow-2xl backdrop-blur-xl text-card-foreground">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
              
              {/* Left Column: Greeting & Level Bar */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber/10 text-amber border border-amber/20 font-heading flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber animate-spin" /> Level 14 Scholar
                  </span>
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber/10 text-amber border border-amber/20 font-heading flex items-center gap-1">
                    <Flame size={12} className="text-amber fill-amber" /> 7 Day Streak!
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-primary via-amber to-teal bg-clip-text text-transparent">Sophia! 👋</span>
                </h2>
                
                <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                  You are only <span className="text-amber font-bold">1,550 XP</span> away from unlocking <span className="text-teal font-bold">Level 15 (Master Physicist)</span>. Keep the momentum going!
                </p>

                {/* Level Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><Zap size={12} className="text-amber" /> XP: 3,450 / 5,000</span>
                    <span className="text-teal font-bold">69% Completed</span>
                  </div>
                  <div className="h-3 w-full bg-muted/60 rounded-full p-0.5 border border-border/40">
                    <div className="h-full bg-gradient-to-r from-primary via-teal to-amber rounded-full transition-all duration-1000 shadow-sm" style={{ width: '69%' }} />
                  </div>
                </div>
              </div>

              {/* Right Column: Badges & Rewards */}
              <div className="md:col-span-1 bg-card p-4 rounded-2xl border border-border shadow-sm space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 font-heading">
                  <Award size={14} className="text-amber" /> Unlocked Badges
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-amber/10 border border-amber/20 flex flex-col items-center gap-1 hover:scale-105 transition-transform cursor-pointer">
                    <span className="text-lg">🏆</span>
                    <span className="text-[9px] font-bold text-amber">Top Quizzer</span>
                  </div>
                  <div className="p-2 rounded-xl bg-teal/10 border border-teal/20 flex flex-col items-center gap-1 hover:scale-105 transition-transform cursor-pointer">
                    <span className="text-lg">⚡</span>
                    <span className="text-[9px] font-bold text-teal">Fast Solver</span>
                  </div>
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center gap-1 hover:scale-105 transition-transform cursor-pointer">
                    <span className="text-lg">🧠</span>
                    <span className="text-[9px] font-bold text-primary">Physics Pro</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 🎯 2. DAILY QUESTS & XP REWARDS */}
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber flex items-center gap-1.5 font-heading">
                <Zap size={14} className="text-amber" /> Today's Quests (+350 XP Total)
              </h3>
              <span className="text-[10px] text-muted-foreground">Resets in 6h 30m</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teal shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground font-heading">Watch 1 Physics Video Module</h5>
                    <span className="text-[10px] text-teal font-bold">Completed • +100 XP Earned</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground font-heading">Score 80%+ on Practice Quiz</h5>
                    <span className="text-[10px] text-amber font-bold">+250 XP Reward</span>
                  </div>
                </div>
                <button className="text-[10px] px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-heading transition-all shadow-sm">
                  Start Quiz
                </button>
              </div>
            </div>
          </div>

          {/* 📚 3. CONTINUE LEARNING (Cyber Cards) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-heading">
                <PlayCircle size={15} className="text-teal" /> Active Quests & Courses
              </h3>
              <Link href="/student/courses" className="text-[11px] text-teal hover:underline font-bold flex items-center gap-1">
                View All Courses <ArrowRight size={12} />
              </Link>
            </div>
            
            {continueLearning.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {continueLearning.map((c) => (
                  <div
                    key={c.id}
                    className="bg-card p-5 rounded-2xl border border-border text-card-foreground shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between h-[180px] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 font-bold uppercase tracking-wider font-heading">
                          {c.code}
                        </span>
                        <span className="text-[10px] text-teal font-bold bg-teal/10 px-2 py-0.5 rounded-full border border-teal/20">
                          {c.progress}% Completed
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground font-heading mt-1 line-clamp-1 group-hover:text-primary transition-colors">{c.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border/30">
                      <div className="h-2 w-full bg-muted border border-border/20 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-primary to-teal rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span className="truncate">Instructor: {c.instructorName}</span>
                        <button
                          onClick={() => router.push('/student/courses')}
                          className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-heading transition-all flex items-center gap-1 shrink-0 shadow-sm"
                        >
                          Resume <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-card border border-border rounded-2xl text-xs text-muted-foreground shadow-sm">
                No active courses in progress. Go to the Catalog to start a new quest.
              </div>
            )}
          </div>

          {/* 🌟 4. RECOMMENDED & EXAMS (Grid Layout) */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Recommended & Popular */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Recommended Courses */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-heading">
                  <Award size={15} className="text-teal" /> Recommended For You
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {recommendedCourses.map((c) => (
                    <div
                      key={c.id}
                      className="bg-card p-4 rounded-xl border border-border text-card-foreground shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between h-[140px]"
                    >
                      <div>
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold uppercase font-heading">
                          {c.category}
                        </span>
                        <h4 className="text-xs font-bold text-foreground font-heading mt-2 line-clamp-1">{c.title}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">{c.description}</p>
                      </div>
                      <Link href={`/courses/${c.slug}`} className="text-[10px] font-bold text-teal hover:underline transition-colors pt-2 flex items-center gap-1">
                        Explore Syllabus <ArrowRight size={10} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Courses */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-heading">
                  <Star size={15} className="text-amber fill-amber" /> Community Top Picks
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {popularCourses.map((c) => (
                    <div
                      key={c.id}
                      className="bg-card p-4 rounded-xl border border-border text-card-foreground shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between h-[140px]"
                    >
                      <div>
                        <span className="text-[9px] bg-amber/10 text-amber border border-amber/20 px-2 py-0.5 rounded-md font-bold uppercase font-heading">
                          ★ {c.rating.toFixed(1)} Rating
                        </span>
                        <h4 className="text-xs font-bold text-foreground font-heading mt-2 line-clamp-1">{c.title}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">{c.description}</p>
                      </div>
                      <Link href={`/courses/${c.slug}`} className="text-[10px] font-bold text-teal hover:underline transition-colors pt-2 flex items-center gap-1">
                        Explore Syllabus <ArrowRight size={10} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Recently Viewed & Upcoming Exams */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Recently Viewed */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-heading">
                  <Clock size={15} className="text-muted-foreground" /> Recently Viewed
                </h3>
                <div className="bg-card p-4 rounded-2xl border border-border text-card-foreground shadow-sm divide-y divide-border/30 space-y-3">
                  {recentlyViewed.map((c) => (
                    <div key={c.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-foreground font-heading line-clamp-1">{c.title}</h5>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">{c.code} • {c.instructorName}</span>
                      </div>
                      <Link href={`/courses/${c.slug}`} className="text-[10px] font-bold text-teal hover:underline shrink-0">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-heading">
                  <AlertTriangle size={15} className="text-destructive" /> Scheduled Exams
                </h3>
                <div className="bg-card p-4 rounded-2xl border border-border text-card-foreground shadow-sm space-y-3">
                  {exams.map((ex) => (
                    <div key={ex.id} className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground font-heading truncate pr-2">{ex.title}</span>
                        <span className="text-[9px] text-destructive bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20 uppercase font-bold shrink-0">
                          Exam
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>Date: {ex.date}</span>
                        <span>Time: {ex.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </PortalLayout>
  );
}

