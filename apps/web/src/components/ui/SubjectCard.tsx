'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';

interface SubjectCardProps {
  subject: {
    id: string;
    slug: string;
    name: string;
    description: string;
    courseCount: number;
    teachersCount: number;
    grades: string[];
  };
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <div className="glass-panel-interactive rounded-2xl text-card-foreground overflow-hidden flex flex-col justify-between h-[250px] shadow-xl p-5">
      <div>
        <div className="flex justify-between items-start mb-2">
          <Link href={`/subjects/${subject.slug}`}>
            <h3 className="text-base font-extrabold font-heading text-foreground hover:text-teal cursor-pointer transition-colors leading-snug">
              {subject.name}
            </h3>
          </Link>
          <span className="text-[9px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 font-extrabold uppercase tracking-wider">
            {subject.courseCount} {subject.courseCount === 1 ? 'Course' : 'Courses'}
          </span>
        </div>

        <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-3">
          {subject.description}
        </p>

        {/* Grades targets list */}
        <div className="flex flex-wrap gap-1 mt-3">
          {subject.grades.slice(0, 3).map((g) => (
            <span
              key={g}
              className="text-[9px] bg-muted px-2 py-0.5 rounded-md text-foreground border border-border font-bold"
            >
              {g}
            </span>
          ))}
          {subject.grades.length > 3 && (
            <span className="text-[9px] text-muted-foreground self-center pl-1 font-bold">
              +{subject.grades.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-amber" />
          <span>{subject.teachersCount} Instructors</span>
        </div>
        <Link
          href={`/subjects/${subject.slug}`}
          className="text-teal hover:underline font-extrabold transition-colors flex items-center gap-1"
        >
          Browse Track <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
};

export default SubjectCard;
