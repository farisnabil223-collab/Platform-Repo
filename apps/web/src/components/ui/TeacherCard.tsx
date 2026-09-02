'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Users } from 'lucide-react';
import { Avatar } from '@eduverse/ui';

interface TeacherCardProps {
  teacher: {
    id: string;
    slug: string;
    name: string;
    avatar?: string;
    bio: string;
    specialties: string[];
    rating: number;
    reviewsCount: number;
    studentsCount: number;
    experienceYears: number;
  };
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const specialties = teacher.specialties && teacher.specialties.length > 0 ? teacher.specialties : ['المادة الأكاديمية'];
  const rating = teacher.rating || 5.0;
  const reviewsCount = teacher.reviewsCount || 0;
  const studentsCount = teacher.studentsCount || 0;
  const experienceYears = teacher.experienceYears || 5;

  return (
    <div className="glass-panel-interactive rounded-2xl text-card-foreground overflow-hidden flex flex-col justify-between h-[340px] shadow-xl p-5">
      <div className="flex flex-col gap-4">
        {/* Profile Header */}
        <div className="flex items-center gap-3">
          <Avatar
            src={teacher.avatar}
            alt={teacher.name}
            fallback={teacher.name}
            size="lg"
            className="h-12 w-12 rounded-2xl border border-primary/40 shrink-0"
          />
          <div>
            <Link href={`/teachers/${teacher.slug}`}>
              <h3 className="text-sm font-extrabold font-heading text-foreground hover:text-primary cursor-pointer transition-colors leading-snug">
                {teacher.name}
              </h3>
            </Link>
            <span className="text-[10px] text-teal font-bold block mt-0.5">
              {experienceYears} Years Experience
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {teacher.bio || 'مدرس أكاديمي متخصص لإعداد ونشر المناهج والتطبيقات التعليمية الشاملة.'}
        </p>

        {/* Specialties Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {specialties.map((spec) => (
            <span
              key={spec}
              className="text-[9px] bg-teal/10 px-2.5 py-0.5 rounded-full text-teal border border-teal/20 font-bold"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Footer statistics */}
      <div className="border-t border-border pt-4 mt-4 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-amber fill-amber" />
          <span className="font-extrabold text-amber">{rating.toFixed(1)} ({reviewsCount})</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={12} className="text-teal" />
          <span>{studentsCount} scholars</span>
        </div>
        <Link
          href={`/teachers/${teacher.slug}`}
          className="text-teal hover:underline font-extrabold transition-colors"
        >
          View Mentor &rarr;
        </Link>
      </div>
    </div>
  );
};

export default TeacherCard;
