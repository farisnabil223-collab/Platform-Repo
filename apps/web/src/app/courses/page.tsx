'use client';

import React, { useEffect, useState, useMemo } from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import CourseCard from '../../components/ui/CourseCard';
import { coursesRepository } from '../../repositories/CoursesRepository';
import { teachersRepository } from '../../repositories/TeachersRepository';
import { Search, BookOpen } from 'lucide-react';

const INITIAL_COURSES = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    code: 'MATH-101',
    slug: 'calculus-i-limits-integration',
    title: 'Calculus I: Limits & Integration',
    description: 'Master single-variable Calculus from the ground up. Limits, derivatives, integration techniques.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Emily Watson',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    category: 'Mathematics',
    price: 49.99,
    rating: 4.9,
    reviewsCount: 145,
    studentsCount: 1420,
    gradeLevel: 'Grade 11 - University',
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    code: 'PHYS-202',
    slug: 'quantum-physics-modern-wave-mechanics',
    title: 'Quantum Physics: Modern Wave Mechanics',
    description: 'Delve into the subatomic world with Wave Functions, Heisenberg Uncertainty Principle.',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Arthur Feynman',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    category: 'Science',
    price: 79.99,
    rating: 4.8,
    reviewsCount: 88,
    studentsCount: 850,
    gradeLevel: 'Grade 12 - University',
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    code: 'CS-301',
    slug: 'systems-architecture-operating-systems',
    title: 'Systems Architecture & Operating Systems',
    description: 'Explore modern Operating Systems: kernel design, process scheduling, concurrency.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Prof. Linus Torvalds',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'Technology',
    price: 0,
    rating: 5.0,
    reviewsCount: 210,
    studentsCount: 2100,
    gradeLevel: 'University Level',
  },
];

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>(INITIAL_COURSES);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTeacher, setSelectedTeacher] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    Promise.all([
      coursesRepository.getAll(),
      teachersRepository.getAll(),
    ]).then(([allCourses, allTeachers]) => {
      if (allCourses && allCourses.length > 0) setCourses(allCourses);
      if (allTeachers && allTeachers.length > 0) setTeachers(allTeachers);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = ['All', 'Science', 'Mathematics', 'Humanities', 'Tech'];
  const grades = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const prices = ['All', 'Free', 'Paid'];

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || c.category === selectedCategory;
        const matchesTeacher =
          selectedTeacher === 'All' || c.instructorId === selectedTeacher;
        const matchesGrade =
          selectedGrade === 'All' || c.gradeLevel === selectedGrade;
        
        let matchesPrice = true;
        if (selectedPrice === 'Free') {
          matchesPrice = c.price === 0;
        } else if (selectedPrice === 'Paid') {
          matchesPrice = c.price > 0;
        }

        return matchesSearch && matchesCategory && matchesTeacher && matchesGrade && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: popularity by studentsCount
        return b.studentsCount - a.studentsCount;
      });
  }, [courses, search, selectedCategory, selectedTeacher, selectedGrade, selectedPrice, sortBy]);

  // Paginated Courses
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedTeacher('All');
    setSelectedGrade('All');
    setSelectedPrice('All');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <PublicLayout>
      <div className="space-y-10 select-none">
        <SectionHeader
          badge="Courses Directory"
          title="Explore Our Lectures & Workshops"
          subtitle="Browse academic modules anonymously. Apply filters to narrow down by level, price, and category."
        />

        {/* Filter Controls Bar */}
        <div className="p-5 bg-card border border-border rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by code or title..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Deep Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border">
            {/* Category Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Subject Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Teacher Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => {
                  setSelectedTeacher(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none"
              >
                <option value="All">All Teachers</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Grade Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Target Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Price Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Cost Type</label>
              <select
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none"
              >
                {prices.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={resetFilters}
              className="text-[10px] text-primary hover:underline font-bold"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-card border border-border rounded-2xl" />
            ))}
          </div>
        ) : paginatedCourses.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {paginatedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 border border-border rounded-xl text-xs text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  &larr; Prev
                </button>
                <span className="text-xs text-muted-foreground font-bold font-heading">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-border rounded-xl text-xs text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-16 text-center border border-dashed border-border rounded-2xl bg-card">
            <BookOpen className="mx-auto text-muted-foreground mb-3" size={24} />
            <p className="text-xs text-muted-foreground">No courses match your active search filters.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
