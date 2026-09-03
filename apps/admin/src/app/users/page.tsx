'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Button, Badge } from '@eduverse/ui';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { subjectsService, SubjectItem } from '../../services/subjectsService';
import { teachersRepository } from '../../../../../apps/web/src/repositories/TeachersRepository';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subject?: string;
  bio?: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>([
    { id: '1', name: 'Sophia Johnson', email: 'sophia@example.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '2', name: 'د. طارق علي', email: 'tarek@example.com', role: 'TEACHER', subject: 'الفيزياء', status: 'ACTIVE' },
    { id: '3', name: 'د. سارة أحمد', email: 'sara@example.com', role: 'TEACHER', subject: 'الرياضيات', status: 'ACTIVE' },
  ]);

  const [platformSubjects, setPlatformSubjects] = React.useState<SubjectItem[]>([]);
  const [showCreateTeacherModal, setShowCreateTeacherModal] = React.useState(false);
  const [importPreview, setImportPreview] = React.useState<any[] | null>(null);
  const [avatarInputMode, setAvatarInputMode] = React.useState<'upload' | 'url'>('upload');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [newTeacherForm, setNewTeacherForm] = React.useState({
    name: '',
    email: '',
    subject: 'الرياضيات',
    password: '',
    phone: '',
    bio: '',
    avatar: '',
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewTeacherForm((prev) => ({ ...prev, avatar: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('eduverse_admin_users');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
          }
        }
      } catch (e) {
        // Ignore fallback
      }
    }

    subjectsService.getSubjects().then((items) => {
      setPlatformSubjects(items);
      if (items.length > 0 && items[0].name) {
        setNewTeacherForm((prev) => ({ ...prev, subject: items[0].name }));
      }
    });
  }, []);

  const handleBulkAction = (action: string) => {
    alert(`Applying action: ${action} to selected accounts.`);
  };

  const handleCreateTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name || !newTeacherForm.email || !newTeacherForm.password) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const teacherSlug = newTeacherForm.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-') || `tch-${Date.now()}`;

    const newTeacherId = `t_${Date.now()}`;
    const avatarUrl = newTeacherForm.avatar.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
    const teacherBio = newTeacherForm.bio.trim() || `مدرس واستشاري مادة ${newTeacherForm.subject} المعين من الإدارة العليا.`;

    teachersRepository.saveTeacher({
      id: newTeacherId,
      slug: teacherSlug,
      name: newTeacherForm.name,
      email: newTeacherForm.email,
      avatar: avatarUrl,
      bio: teacherBio,
      detailedBio: teacherBio,
      specialties: [newTeacherForm.subject],
      qualifications: [`بكالوريوس وتخصص ${newTeacherForm.subject}`, 'معتمد رسمياً من الإدارة التعليمية'],
      certificates: ['شهادة اعتماد التدريس الرقمي من المنصة'],
      experienceYears: 8,
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      verifiedBadge: true,
      subject: newTeacherForm.subject,
    });

    const newTeacher: UserItem = {
      id: newTeacherId,
      name: newTeacherForm.name,
      email: newTeacherForm.email,
      role: 'TEACHER',
      subject: newTeacherForm.subject,
      status: 'ACTIVE',
      bio: teacherBio,
      avatar: avatarUrl,
    };

    subjectsService.setTeacherAllowedSubjects(newTeacherForm.email, [newTeacherForm.subject]);

    const updatedUsers = [newTeacher, ...users];
    setUsers(updatedUsers);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eduverse_admin_users', JSON.stringify(updatedUsers));
      } catch (e) {
        // Ignore fallback
      }
    }

    setShowCreateTeacherModal(false);
    setNewTeacherForm({ name: '', email: '', subject: platformSubjects[0]?.name || 'الرياضيات', password: '', phone: '', bio: '', avatar: '' });
    alert(`تم إنشاء حساب المدرس "${newTeacherForm.name}" بنجاح وتأكيده في كادر المنصة!`);
  };

  const handleCsvImportSimulate = () => {
    setImportPreview([
      { name: 'أحمد محمود', email: 'ahmed@example.com', role: 'STUDENT', status: 'VALID' },
      { name: 'د. محمد كامل', email: 'm.kamel@example.com', role: 'TEACHER', status: 'VALID' },
    ]);
  };

  const handleCommitImport = () => {
    if (!importPreview) return;
    setUsers((prev) => [
      ...prev,
      ...importPreview.map((x, idx) => ({ id: (prev.length + idx + 1).toString(), name: x.name, email: x.email, role: x.role, status: 'ACTIVE' })),
    ]);
    setImportPreview(null);
  };

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Identity & Access Directory - إدارة الحسابات والمدرسين"
      pageDescription="إدارة حسابات المنصة، إنشاء وإضافة المدرسين الجدد وتفعيل لوحة التحكم الخاصة بكل مدرس."
    >
      <div className="flex flex-col gap-6 select-none max-w-5xl">
        {/* Actions Bar */}
        <div className="flex gap-2 flex-wrap pb-3 border-b border-border/40 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateTeacherModal(true)}
              className="text-xs h-8 font-heading bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              + إنشاء حساب مدرس جديد (Create Teacher)
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('INVITE')} className="text-xs h-8 font-heading">Bulk Invite</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('RESET')} className="text-xs h-8">Reset Password</Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleCsvImportSimulate} className="text-xs h-8">Import CSV File</Button>
        </div>

        {/* Create Teacher Modal */}
        {showCreateTeacherModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border/80 rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <h3 className="text-base font-bold text-card-foreground font-heading">إضافة وفتح حساب مدرس جديد</h3>
                <button onClick={() => setShowCreateTeacherModal(false)} className="text-muted-foreground hover:text-foreground font-bold text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateTeacherSubmit} className="flex flex-col gap-4 text-xs font-heading">
                <div>
                  <label className="block mb-1 font-bold text-card-foreground">اسم المدرس ثلاثي *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. محمد علي"
                    value={newTeacherForm.name}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-card-foreground">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@eduverse.com"
                    value={newTeacherForm.email}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-bold text-card-foreground">المادة / التخصص *</label>
                    <select
                      value={newTeacherForm.subject}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    >
                      {platformSubjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-card-foreground">رقم الهاتف</label>
                    <input
                      type="text"
                      placeholder="01012345678"
                      value={newTeacherForm.phone}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-card-foreground">الوصف والنبذة التعريفية للمدرس (يظهر في الكارت والبروفايل)</label>
                  <textarea
                    rows={2}
                    placeholder="مثال: استشاري مادة الفيزياء والكهربية، خبير تدريس الثانوية العامة لأكثر من 10 سنوات."
                    value={newTeacherForm.bio}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block font-bold text-card-foreground">الصورة الشخصية للمدرس (Avatar)</label>
                    <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-lg text-[11px]">
                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('upload')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          avatarInputMode === 'upload'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        رفع من الجهاز
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('url')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          avatarInputMode === 'url'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        رابط URL
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/60 rounded-xl">
                    <div className="relative group shrink-0">
                      <div className="w-14 h-14 rounded-full border-2 border-emerald-500/40 bg-background overflow-hidden flex items-center justify-center shadow-inner">
                        {newTeacherForm.avatar ? (
                          <img
                            src={newTeacherForm.avatar}
                            alt="معاينة الصورة"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground/60" />
                        )}
                      </div>
                      {newTeacherForm.avatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewTeacherForm((prev) => ({ ...prev, avatar: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md transition-transform transform hover:scale-110"
                          title="إزالة الصورة"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {avatarInputMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                            id="admin-teacher-avatar-file-input"
                          />
                          <label
                            htmlFor="admin-teacher-avatar-file-input"
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-dashed border-emerald-500/50 text-emerald-700 dark:text-emerald-300 rounded-lg cursor-pointer transition-colors text-xs font-semibold text-center"
                          >
                            <Upload className="w-4 h-4 shrink-0" />
                            <span>{newTeacherForm.avatar ? 'تغيير الصورة من الجهاز' : 'اختر صورة من جهازك (Browse)'}</span>
                          </label>
                          <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, WEBP بحجم يصل إلى 5MB</p>
                        </div>
                      ) : (
                        <div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/... (أو اتركه فارغاً)"
                              value={newTeacherForm.avatar}
                              onChange={(e) => setNewTeacherForm({ ...newTeacherForm, avatar: e.target.value })}
                              className="w-full pl-3 pr-8 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                            />
                            <LinkIcon className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">أدخل رابط صورة مباشر من الإنترنت</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-card-foreground">كلمة السر الأولية للمدرس *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newTeacherForm.password}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-border/40">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateTeacherModal(false)}>إلغاء</Button>
                  <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">تأكيد وإنشاء الحساب</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Roster Table */}
        <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
          <table className="min-w-full text-xs text-left font-heading">
            <thead className="bg-muted/20 text-muted-foreground uppercase tracking-wider font-bold border-b border-border/60">
              <tr>
                <th className="py-3 px-4">الاسم</th>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">الدور / Role</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-right">معاينة داشبورد المدرس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3 px-4 text-card-foreground font-bold font-heading">
                    {u.name}
                    {u.subject && <span className="mr-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{u.subject}</span>}
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 font-bold font-heading">
                    {u.role === 'TEACHER' ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">مدرس (TEACHER)</span>
                    ) : (
                      <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{u.role}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">{u.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role === 'TEACHER' && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_WEB_URL || 'https://eduverse-n0ta5zjea-farisnabil223-2417.vercel.app'}/teacher/dashboard`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                      >
                        فتح داشبورد المدرس والأرباح ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
