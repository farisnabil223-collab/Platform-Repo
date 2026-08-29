'use client';

import React, { useEffect, useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import CourseCard from '../../components/ui/CourseCard';
import { coursesRepository } from '../../repositories/CoursesRepository';
import wishlistService from '../../services/wishlistService';
import { Button } from '@eduverse/ui';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = () => {
    setLoading(true);
    const savedIds = wishlistService.getWishlist();
    coursesRepository.getAll().then((allCourses) => {
      const matched = allCourses.filter((c) => savedIds.includes(c.id));
      setWishlistItems(matched);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleToggle = (courseId: string) => {
    // If toggled from Wishlist Page, we remove it
    wishlistService.removeFromWishlist(courseId);
    // Reload UI state
    loadWishlist();
  };

  return (
    <PublicLayout>
      <div className="space-y-10 select-none animate-fade-in">
        <SectionHeader
          badge="Favorites"
          title="Your Learning Wishlist"
          subtitle="Saved courses and syllabus outline drafts you are planning to purchase or study."
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 bg-slate-900 border border-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((course) => (
              <div key={course.id} className="relative">
                <CourseCard course={course} />
                {/* Override wishlisting toggle inside page context */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => handleToggle(course.id)}
                    className="p-2 rounded-full bg-slate-800 text-red-500 border border-red-500/20 hover:bg-slate-950 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} className="fill-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 space-y-4 max-w-md mx-auto">
            <Heart className="mx-auto text-slate-600" size={24} />
            <div>
              <h4 className="text-sm font-bold text-white font-heading">Wishlist is Empty</h4>
              <p className="text-xs text-slate-400 mt-1">Explore our course catalogue to save your favorite lectures.</p>
            </div>
            <Link href="/courses" className="block pt-2">
              <Button variant="primary" className="text-xs px-4 py-2">Browse Catalogue</Button>
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
