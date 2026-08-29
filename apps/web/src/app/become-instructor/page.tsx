'use client';

import React from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import { Card, Button } from '@eduverse/ui';
import { Award, BookOpen, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function BecomeInstructorLanding() {
  return (
    <PublicLayout>
      <div className="space-y-16 select-none max-w-4xl mx-auto py-10 animate-fade-in">
        <SectionHeader
          badge="Teach on EduVerse"
          title="Share Your Knowledge. Empower Students Globally."
          subtitle="Join our certified community of doctorate instructors, kernel developers, and researchers. Create courses and manage online classrooms."
        />

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-heading text-white">Why Teach on EduVerse?</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              We provide you with advanced tools to build dynamic course syllabi, upload videos, design auto-graded quizzes, and track classroom metrics. Reach thousands of university and high school students who are actively searching for study tracks.
            </p>
            <div className="pt-2">
              <Link href="/become-instructor/apply">
                <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-500 font-bold px-6 py-2.5 text-xs shadow-md">
                  Submit Instructor Application &rarr;
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-800 p-4 space-y-2">
              <Award className="text-indigo-400" size={20} />
              <h4 className="text-xs font-bold font-heading text-white">Academic Trust</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Only certified educators are approved to build classrooms.</p>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4 space-y-2">
              <Users className="text-indigo-400" size={20} />
              <h4 className="text-xs font-bold font-heading text-white">Global Reach</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Publish to students across multiple grade ranges.</p>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4 space-y-2">
              <BookOpen className="text-indigo-400" size={20} />
              <h4 className="text-xs font-bold font-heading text-white">Rich Toolset</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Auto-graded assignments, slide viewer integrations.</p>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4 space-y-2">
              <Clock className="text-indigo-400" size={20} />
              <h4 className="text-xs font-bold font-heading text-white">Earn Revenue</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Sell courses individually or join our monthly revenue pool.</p>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
