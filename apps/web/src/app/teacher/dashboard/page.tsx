'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PortalLayout,
  Button,
  StatisticWidget,
  ActivityWidget,
  AnnouncementWidget,
  ChartWidget,
  QuickActionsWidget,
  Icon,
} from '@eduverse/ui';
import { teacherService } from '../../../services/teacherService';
import { teacherCoursesService } from '../../../services/teacherCoursesService';

export default function TeacherDashboardPage() {
  const router = useRouter();
  
  // Teacher Courses State with Enrolled Students & Prices
  const [courses, setCourses] = React.useState([
    {
      id: 'c1',
      title: 'كورس الرياضيات للثانوية العامة - التفاضل والتكامل',
      code: 'MATH-101',
      price: 350, // EGP
      enrolledCount: 142,
      lessonsCount: 18,
      status: 'PUBLISHED',
      category: 'الرياضيات',
    },
    {
      id: 'c2',
      title: 'كورس الفيزياء الطبية والميكانيكا',
      code: 'PHYS-201',
      price: 450, // EGP
      enrolledCount: 89,
      lessonsCount: 12,
      status: 'PUBLISHED',
      category: 'الفيزياء',
    },
    {
      id: 'c3',
      title: 'كورس الكيمياء العضوية الشامل',
      code: 'CHEM-301',
      price: 300, // EGP
      enrolledCount: 210,
      lessonsCount: 24,
      status: 'PUBLISHED',
      category: 'الكيمياء',
    },
  ]);

  // Modal State for Adding Lessons directly
  const [selectedCourseForLesson, setSelectedCourseForLesson] = React.useState<any | null>(null);
  const [lessonForm, setLessonForm] = React.useState({
    title: '',
    type: 'VIDEO',
    videoUrl: '',
    description: '',
    duration: '45',
  });

  const [loading, setLoading] = React.useState(false);

  // Compute Total Metrics
  const totalEnrolledStudents = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const totalEarnings = courses.reduce((sum, c) => sum + c.enrolledCount * c.price, 0);

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title) {
      alert('يرجى كتابة عنوان الدرس');
      return;
    }

    // Increment lessons count for the targeted course
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourseForLesson.id ? { ...c, lessonsCount: c.lessonsCount + 1 } : c))
    );

    alert(`تم رفع وإضافة الدرس "${lessonForm.title}" بنجاح إلى كورس ${selectedCourseForLesson.title}`);
    setSelectedCourseForLesson(null);
    setLessonForm({ title: '', type: 'VIDEO', videoUrl: '', description: '', duration: '45' });
  };

  const quickActions = [
    {
      id: 'create-course',
      label: 'إنشاء كورس جديد (Create Course)',
      description: 'إضافة كورس جديد وتحديد سعره للطلاب.',
      action: () => router.push('/teacher/courses'),
    },
    {
      id: 'grade',
      label: 'تصحيح الواجبات (Gradebook)',
      description: 'مراجعة وتقييم إجابات الطلاب.',
      action: () => router.push('/teacher/gradebook'),
    },
  ];

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="لوحة تحكم المدرس - Teacher Dashboard"
      pageDescription="متابعة عدد الطلاب المشتركين بكورساتك، حساب الأرباح والإيرادات، وإضافة الدروس والمحتوى التعليمي."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground font-heading">جاري تحميل بيانات المدرس...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-8 select-none">
          {/* Top KPI Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Total Enrolled Students */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col gap-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold font-heading">إجمالي الطلاب المشتركين</span>
                <span className="text-lg">👥</span>
              </div>
              <div className="text-2xl font-black text-foreground font-heading">{totalEnrolledStudents} طالب</div>
              <span className="text-[11px] text-emerald-400 font-bold">موزعين على {courses.length} كورسات</span>
            </div>

            {/* Total Revenue & Profit */}
            <div className="bg-card border border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-col gap-2 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-card to-card">
              <div className="flex justify-between items-center text-emerald-400">
                <span className="text-xs font-bold font-heading">إجمالي الأرباح والإيرادات</span>
                <span className="text-lg">💰</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-heading">
                {totalEarnings.toLocaleString()} ج.م
              </div>
              <span className="text-[11px] text-muted-foreground font-bold">محسوبة تلقائياً من اشتراكات الطلاب</span>
            </div>

            {/* Active Courses */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col gap-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold font-heading">الكورسات المتاحة</span>
                <span className="text-lg">📚</span>
              </div>
              <div className="text-2xl font-black text-foreground font-heading">{courses.length} كورس</div>
              <span className="text-[11px] text-teal font-bold">جاهزة ومتاحة للتسجيل</span>
            </div>

            {/* Average Course Price */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col gap-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold font-heading">متوسط سعر الكورس</span>
                <span className="text-lg">🏷️</span>
              </div>
              <div className="text-2xl font-black text-foreground font-heading">
                {Math.round(courses.reduce((sum, c) => sum + c.price, 0) / courses.length)} ج.م
              </div>
              <span className="text-[11px] text-muted-foreground font-bold">لكل طالب يشترك في الكورس</span>
            </div>
          </div>

          {/* Detailed Course Breakdown & Profit Table */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-3 pb-3 border-b border-border/40">
              <div>
                <h3 className="text-base font-bold text-card-foreground font-heading">
                  إحصائيات الكورسات وعدد الطلاب والأرباح
                </h3>
                <p className="text-xs text-muted-foreground">
                  جدول توضيحي لعدد الطلاب المسجلين بكل كورس على حدة وحساب الأرباح المحققة من كل طالب.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/teacher/courses')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                + إنشاء كورس جديد
              </Button>
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-xl">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-muted/20 text-muted-foreground uppercase tracking-wider font-bold border-b border-border/60">
                  <tr>
                    <th className="py-3 px-4">الكورس / المادة</th>
                    <th className="py-3 px-4">سعر الكورس للطالب</th>
                    <th className="py-3 px-4">عدد الطلاب المسجلين</th>
                    <th className="py-3 px-4">عدد الدروس المرفوعة</th>
                    <th className="py-3 px-4 text-emerald-400">إجمالي الأرباح المحققة</th>
                    <th className="py-3 px-4 text-right">إدارة المحتوى والدروس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-heading">
                  {courses.map((course) => {
                    const courseProfit = course.enrolledCount * course.price;
                    return (
                      <tr key={course.id} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-card-foreground text-xs">{course.title}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{course.code} • {course.category}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {course.price} ج.م <span className="text-[10px] text-muted-foreground">/ طالب</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs">
                            👤 {course.enrolledCount} طالب
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          🎬 {course.lessonsCount} درس
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                          {courseProfit.toLocaleString()} ج.م
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCourseForLesson(course)}
                            className="text-[11px] h-7 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 font-bold"
                          >
                            + تنزيل / إضافة درس
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Lesson Modal */}
          {selectedCourseForLesson && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <div>
                    <h3 className="text-base font-bold text-card-foreground font-heading">تنزيل درس جديد للكورس</h3>
                    <p className="text-xs text-emerald-400 font-bold">{selectedCourseForLesson.title}</p>
                  </div>
                  <button onClick={() => setSelectedCourseForLesson(null)} className="text-muted-foreground hover:text-foreground font-bold text-sm">✕</button>
                </div>

                <form onSubmit={handleAddLessonSubmit} className="flex flex-col gap-4 text-xs font-heading">
                  <div>
                    <label className="block mb-1 font-bold text-card-foreground">عنوان الدرس *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الدرس الأول - مقدمة وتطبيقات عملية"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 font-bold text-card-foreground">نوع المحتوى *</label>
                      <select
                        value={lessonForm.type}
                        onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="VIDEO">فيديو شاور/مسجل (Video)</option>
                        <option value="PDF">ملف PDF / مذكرة</option>
                        <option value="QUIZ">اختبار / امتحان قصير</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-card-foreground">المدة المتوقعة (بالدقائق)</label>
                      <input
                        type="number"
                        placeholder="45"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-card-foreground">رابط الفيديو أو الملف (Embed / Cloud storage link)</label>
                    <input
                      type="url"
                      placeholder="https://vimeo.com/example أو رابط اليوتيوب/السيرفر"
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-card-foreground">وصف الدرس والتعليمات للطلاب</label>
                    <textarea
                      rows={3}
                      placeholder="اكتب نبذة أو ملاحظات هامة للطلاب قبل البدء في مشاهدة الدرس..."
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border/40">
                    <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCourseForLesson(null)}>إلغاء</Button>
                    <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                      رفع وتأكيد الدرس
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Quick Actions & Shortcut Tools */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuickActionsWidget actions={quickActions} />
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
