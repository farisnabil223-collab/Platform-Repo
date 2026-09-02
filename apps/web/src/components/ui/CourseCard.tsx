'use client';

import React from 'react';
import Link from 'next/link';
import Rating from './Rating';
import PriceBadge from './PriceBadge';
import WishlistButton from './WishlistButton';
import { Avatar } from '@eduverse/ui';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    code: string;
    description: string;
    image?: string;
    instructorName: string;
    instructorAvatar?: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewsCount: number;
    studentsCount: number;
    gradeLevel: string;
  };
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getFallbackImage = (code: string) => {
    if (code.startsWith('MATH')) {
      return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80';
    }
    if (code.startsWith('PHYS')) {
      return 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
  };

  const imageUrl = course.image || getFallbackImage(course.code);

  return (
    <div className="glass-panel-interactive group relative rounded-2xl overflow-hidden flex flex-col justify-between h-[390px] shadow-xl">
      {/* Cover / Image */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-95"
          onError={(e) => {
            (e.currentTarget as any).src = getFallbackImage(course.code);
          }}
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Wishlist Heart Overlay */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton courseId={course.id} />
        </div>

        <span className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-xl px-2.5 py-0.5 rounded-full text-[9px] font-black text-teal border border-teal/30 uppercase tracking-wider">
          {course.category}
        </span>

        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white/90">
          {course.code}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Avatar src={course.instructorAvatar} alt={course.instructorName} size="sm" className="h-5 w-5 text-[8px]" />
              {course.instructorName}
            </span>
            <span className="bg-primary/10 text-primary px-2 py-0.2 rounded border border-primary/20 font-bold">{course.gradeLevel}</span>
          </div>

          <Link href={`/courses/${course.slug}`}>
            <h3 className="text-sm font-extrabold font-heading text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-1 cursor-pointer leading-snug">
              {course.title}
            </h3>
          </Link>

          <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Rating Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Rating value={course.rating} />
            <span className="text-[10px] text-amber font-extrabold">
              {course.rating.toFixed(1)} ({course.reviewsCount})
            </span>
          </div>
          <span className="text-[9px] font-black text-teal bg-teal/10 border border-teal/20 px-2 py-0.2 rounded-full">
            +500 XP
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/40 flex items-center justify-between">
        <PriceBadge price={course.price} originalPrice={course.originalPrice} />
        <Link href={`/courses/${course.slug}`} className="text-[10px] font-extrabold text-teal hover:underline transition-colors flex items-center gap-1">
          Start Quest &rarr;
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
