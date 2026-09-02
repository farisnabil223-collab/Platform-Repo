'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '../../../components/PublicLayout';
import Rating from '../../../components/ui/Rating';
import ReviewCard from '../../../components/ui/ReviewCard';
import WishlistButton from '../../../components/ui/WishlistButton';
import { coursesRepository } from '../../../repositories/CoursesRepository';
import { reviewsRepository } from '../../../repositories/ReviewsRepository';
import { useAuthStore, Button, Card } from '@eduverse/ui';
import { Play, BookOpen, Clock, Award, ShieldAlert, ChevronDown, ChevronUp, PlayCircle, X } from 'lucide-react';
import { analytics } from '../../../utils/analytics';

interface Params {
  slug: string;
}

export default function CourseDetailsPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    coursesRepository.getBySlug(resolvedParams.slug).then((data) => {
      setCourse(data);
      setLoading(false);
      if (data) {
        document.title = `${data.title} | EduVerse`;
        analytics.trackEvent('course_open', { code: data.code, title: data.title });
      }
    });
  }, [resolvedParams.slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      setReviewError('Review content is required');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const authorName = user?.name || 'Verified Student';
      const newReview = await reviewsRepository.submitReview(course.id, {
        authorName,
        rating: reviewRating,
        content: reviewContent,
      });

      if (newReview) {
        setReviewSuccess(true);
        setReviewContent('');
        setCourse((prev: any) => ({
          ...prev,
          reviews: [
            {
              id: newReview.id || Math.random().toString(),
              authorName,
              rating: reviewRating,
              content: reviewContent,
              date: new Date().toLocaleDateString(),
              isVerifiedPurchase: true,
              helpfulCount: 0,
            },
            ...prev.reviews,
          ],
        }));
        analytics.trackEvent('review_submitted', { courseId: course.id, rating: reviewRating });
      } else {
        setReviewError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      setReviewError('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500">Loading course outline...</span>
        </div>
      </PublicLayout>
    );
  }

  if (!course) {
    return (
      <PublicLayout>
        <div className="py-20 text-center space-y-4">
          <ShieldAlert className="mx-auto text-red-500" size={32} />
          <h2 className="text-xl font-bold font-heading text-white">Course Not Found</h2>
          <p className="text-xs text-slate-400">The requested learning syllabus does not exist.</p>
          <Button variant="primary" onClick={() => router.push('/courses')}>Back to Catalog</Button>
        </div>
      </PublicLayout>
    );
  }

  const handleEnroll = () => {
    const isFree = course.price === 0;
    analytics.trackEvent('enroll_click', { code: course.code, price: course.price });
    if (!isAuthenticated) {
      // Defer auth first
      if (isFree) {
        router.push(`/register?redirect=/courses/${course.slug}&action=enroll-free`);
      } else {
        router.push(`/register?redirect=/checkout&course=${course.slug}`);
      }
    } else {
      // Authenticated
      if (isFree) {
        // Enroll immediately
        router.push('/student/dashboard?enrolled=' + course.id);
      } else {
        router.push(`/checkout?course=${course.slug}`);
      }
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-12 select-none">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-1.5 font-heading">
          <span className="hover:text-foreground cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span>/</span>
          <span className="hover:text-foreground cursor-pointer" onClick={() => router.push('/courses')}>Courses</span>
          <span>/</span>
          <span className="text-primary font-bold">{course.code}</span>
        </div>

        {/* Dynamic Cover Section */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Details (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <span className="text-[9px] bg-teal/10 text-teal px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-teal/20 font-heading">
                {course.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-foreground tracking-tight leading-snug">
                {course.title}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Quick stats banner */}
            <div className="flex flex-wrap items-center gap-6 p-4 bg-card border border-border rounded-2xl text-[11px] text-muted-foreground shadow-sm">
              <div className="flex items-center gap-1">
                <Rating value={course.rating} size={12} />
                <span className="text-foreground font-bold">{course.rating.toFixed(1)}</span>
                <span>({course.reviewsCount} reviews)</span>
              </div>
              <div>•</div>
              <div>{course.studentsCount.toLocaleString()} students enrolled</div>
              <div>•</div>
              <div>{course.credits} Credits</div>
              <div>•</div>
              <div>{course.gradeLevel} Level</div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-wider">Course Overview</h3>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {course.longDescription}
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-wider">Requirements</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {course.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum / Lessons */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-wider">Curriculum Outline</h3>
              <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-card">
                {course.lessons.map((lesson: any, index: number) => {
                  const isOpen = activeAccordion === lesson.id;
                  return (
                    <div key={lesson.id} className="bg-card">
                      <div
                        onClick={() => setActiveAccordion(isOpen ? null : lesson.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground font-heading text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-xs font-bold text-card-foreground font-heading">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground font-semibold">{lesson.duration}</span>
                          {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                        </div>
                      </div>
                      
                      {isOpen && (
                        <div className="p-4 border-t border-border text-xs text-muted-foreground bg-muted/30 space-y-3 animate-accordion-down">
                          <p>Estimated reading and assessment content for this lesson block.</p>
                          {lesson.preview && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewVideo(lesson.title);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-teal hover:underline"
                            >
                              <PlayCircle size={12} /> Watch Free Preview Lecture
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-wider">Student Reviews</h3>
              
              {course.reviews.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No reviews yet. Be the first to review this course!</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {course.reviews.map((rev: any) => (
                    <ReviewCard key={rev.id} review={rev} />
                  ))}
                </div>
              )}

              {/* Write a Review Block */}
              <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-card-foreground uppercase tracking-wider font-heading">Write a Course Review</h4>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewSuccess && (
                      <p className="text-xs text-teal font-bold">Review submitted successfully! It will appear publicly once approved.</p>
                    )}
                    {reviewError && (
                      <p className="text-xs text-destructive font-bold">{reviewError}</p>
                    )}
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`text-lg transition-transform hover:scale-110 ${star <= reviewRating ? 'text-amber' : 'text-muted-foreground/30'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Review Content</label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Share your learning experience..."
                        className="w-full h-24 bg-background border border-input rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground transition-colors"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="px-4 py-2 text-xs font-bold w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    You must be signed in to leave a review.{' '}
                    <Link href={`/register?redirect=/courses/${course.slug}`} className="text-primary hover:underline font-bold">
                      Sign Up / Login
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Panel (Right Column) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <Card className="bg-card border border-border text-card-foreground p-6 rounded-3xl space-y-6 shadow-xl relative">
              <div className="absolute top-4 right-4">
                <WishlistButton courseId={course.id} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground font-heading">Course Investment</span>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-black font-heading text-card-foreground">
                    {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <>
                      <span className="text-base text-muted-foreground line-through font-semibold">
                        ${course.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        -{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                  {course.price > 0 && <span className="text-[10px] text-muted-foreground font-semibold">one-time payment</span>}
                </div>
              </div>

              <div className="space-y-3 text-[11px] text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Play size={12} className="text-primary" />
                  <span>Interactive learning videos & slides</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={12} className="text-primary" />
                  <span>Syllabus homework and quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-primary" />
                  <span>Access on desktop, tablet, and mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={12} className="text-primary" />
                  <span>Grading certificate upon completion</span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleEnroll}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl shadow-sm"
              >
                {course.price === 0 ? 'Start Learning' : 'Enroll in Course'}
              </Button>
            </Card>

            {/* Quick Instructor Bio Summary */}
            <Card className="bg-card border border-border p-4 rounded-2xl flex gap-3 hover:border-primary/40 transition-colors shadow-sm">
              <div className="h-10 w-10 bg-primary/10 text-primary font-bold text-xs flex items-center justify-center rounded-full shrink-0">
                {course.instructorAvatar || course.instructorName.charAt(0)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-card-foreground font-heading">
                  Instructed by {course.instructorName}
                </h4>
                <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                  Stanford Doctorate faculty teaching advanced mathematical computation and analysis models.
                </p>
                <Link
                  href={`/teachers/${course.instructorId}`}
                  className="text-[9px] text-primary hover:underline font-bold block pt-1"
                >
                  View Profile &rarr;
                </Link>
              </div>
            </Card>
          </div>

        </div>

      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full relative shadow-2xl">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Close Preview"
            >
              <X size={16} />
            </button>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Free Lecture Preview</span>
                <h4 className="text-sm font-bold font-heading text-white">{previewVideo}</h4>
              </div>
              {/* Simulated video player */}
              <div className="aspect-video w-full bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative p-6 text-center text-slate-500">
                <PlayCircle className="text-indigo-600 animate-pulse mb-3" size={48} />
                <span className="text-xs text-slate-400 font-bold font-heading">Simulated Lecture Playing...</span>
                <span className="text-[10px] text-slate-600 mt-1 max-w-sm">This interface demonstrates full lesson video streaming without cookies or signups.</span>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400 hover:bg-slate-800 font-bold"
                >
                  Dismiss Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Structured JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            'name': course.title,
            'description': course.description,
            'provider': {
              '@type': 'Organization',
              'name': 'EduVerse',
              'sameAs': 'https://eduverse.com'
            }
          })
        }}
      />
    </PublicLayout>
  );
}
