'use client';
/* eslint-disable no-undef */

import React from 'react';
import {
  PortalLayout,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@eduverse/ui';
import { subjectsService, SubjectItem } from '../../../services/subjectsService';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = React.useState<SubjectItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // New subject form
  const [form, setForm] = React.useState({
    code: '',
    name: '',
    slug: '',
    description: '',
    gradeLevel: 'الصف الثالث الثانوي',
    category: 'Science',
    creditHours: 3,
    weeklyHours: 4,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    const data = await subjectsService.getSubjects();
    setSubjects(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name) return;

    setIsSubmitting(true);
    try {
      await subjectsService.createSubject({
        code: form.code,
        name: form.name,
        slug: form.slug || form.code.toLowerCase(),
        description: form.description,
        gradeLevel: form.gradeLevel,
        category: form.category,
        creditHours: form.creditHours,
        weeklyHours: form.weeklyHours,
      });

      setForm({
        code: '',
        name: '',
        slug: '',
        description: '',
        gradeLevel: 'الصف الثالث الثانوي',
        category: 'Science',
        creditHours: 3,
        weeklyHours: 4,
      });
      setShowModal(false);
      fetchSubjects();
      alert(`تم إضافة مادة "${form.name}" بنجاح! تم إنشاء قسم خاص بها للطلاب في المنصة وإتاحتها للمدرسين.`);
    } catch (err) {
      alert('حدث خطأ أثناء إضافة المادة الدراسية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id: string, name: string) => {
    if (confirm(`هل أنت تأكد من حذف مادة "${name}" من المنصة؟`)) {
      await subjectsService.deleteSubject(id);
      fetchSubjects();
    }
  };

  const filtered = React.useMemo(() => {
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjects, search]);

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="إدارة المواد الدراسية في المنصة (Platform Subjects Registry)"
      pageDescription="إنشاء وتعديل المواد الدراسية، فتح أقسام المواد للطلاب، وتحديد المواد المتاحة للمدرسين."
    >
      <div className="flex flex-col gap-6 select-none max-w-5xl font-heading">
        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-card border border-border/60 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">إجمالي المواد الفعالة</span>
              <h3 className="text-xl font-black text-card-foreground font-heading mt-1">{subjects.length} مادة دراسية</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">نشطة 100%</span>
          </div>

          <div className="p-5 bg-card border border-border/60 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">سيكشن الطلاب تلقائي</span>
              <h3 className="text-xl font-black text-teal font-heading mt-1">مفعل لكل المناهج</h3>
            </div>
            <span className="text-xs text-teal font-bold bg-teal/10 px-3 py-1 rounded border border-teal/20">Auto Section</span>
          </div>

          <div className="p-5 bg-card border border-border/60 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">ربط المدرسين والمواد</span>
              <h3 className="text-xl font-black text-primary font-heading mt-1">تحديد المسموح للمدرس</h3>
            </div>
            <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded border border-primary/20">RBAC Subjects</span>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-border/40">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث بكود المادة أو اسمها..."
              className="w-full px-4 py-2 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
            />
          </div>

          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="text-xs h-9 px-4 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0"
          >
            <span className="font-bold text-sm">+</span> إنشاء مادة جديدة في المنصة
          </Button>
        </div>

        {/* Subjects List Grid */}
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse text-xs">
            جاري تحميل المواد الدراسية...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-xl bg-card">
            <span className="text-xs text-muted-foreground">لا توجد مواد دراسية مطابقة حالياً.</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="p-5 bg-card border border-border/60 rounded-xl hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase font-mono">
                      {s.code}
                    </span>
                    <Badge variant="success">{s.category}</Badge>
                  </div>

                  <h4 className="text-sm font-bold text-foreground font-heading mt-1">{s.name}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{s.description}</p>
                </div>

                <div className="flex flex-col gap-2 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>المرحلة المستهدفة:</span>
                    <strong className="text-foreground font-bold">{s.gradeLevel}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الساعات المعتمدة:</span>
                    <span className="text-primary font-bold">{s.creditHours} ساعات أسبوعياً</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_WEB_URL || 'https://eduverse-n0ta5zjea-farisnabil223-2417.vercel.app'}/subjects/${s.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-teal hover:underline font-bold"
                    >
                      معاينة قسم الطلاب ↗
                    </a>
                    <button
                      onClick={() => handleDeleteSubject(s.id, s.name)}
                      className="text-[10px] text-destructive hover:underline font-bold"
                    >
                      حذف المادة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-lg w-full bg-card border-border text-card-foreground shadow-2xl">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-card-foreground text-base font-bold font-heading">
                  إضافة وإنشاء مادة جديدة في المنصة
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  أدخل كود المادة، الاسم بالعربية، التصنيف، والمرحلة الدراسية لإنشاء سيكشن أوتوماتيكي للطلاب.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleCreateSubject} className="space-y-4 font-heading text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-card-foreground">كود المادة *</label>
                      <input
                        type="text"
                        required
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        placeholder="MATH / PHYS / CS"
                        className="p-2.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-foreground"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-card-foreground">اسم المادة بالعربية *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="مثال: الرياضيات التطبيقية"
                        className="p-2.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-card-foreground">التصنيف (Category) *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="p-2.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                      >
                        <option value="Mathematics">Mathematics (الرياضيات)</option>
                        <option value="Science">Science (العلوم والفيزياء والكيمياء)</option>
                        <option value="Technology">Technology (الحاسب والبرمجة)</option>
                        <option value="Languages">Languages (اللغات)</option>
                        <option value="Humanities">Humanities (الإنسانيات والعلوم الاجتماعية)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-card-foreground">المرحلة الدراسية *</label>
                      <select
                        value={form.gradeLevel}
                        onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                        className="p-2.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                      >
                        <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                        <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                        <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                        <option value="جميع المراحل الدراسية">جميع المراحل الدراسية</option>
                        <option value="مستوى جامعي">مستوى جامعي</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-card-foreground">وصف المادة والمنهج</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="أدخل ملخص المنهج والمحتوى الدراسـي..."
                      className="p-2.5 h-20 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-xs h-9 px-4"
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="text-xs h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      disabled={isSubmitting || !form.code || !form.name}
                    >
                      حفظ وإنشاء المادة
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
