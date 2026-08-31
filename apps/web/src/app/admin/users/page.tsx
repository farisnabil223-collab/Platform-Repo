'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, quotes */

import React from 'react';
import { PortalLayout, Button, Badge } from '@eduverse/ui';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subject?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>([
    { id: '1', name: 'Sophia Johnson', email: 'sophia@example.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: '2', name: 'Dr. Emily Watson', email: 'emily@example.com', role: 'TEACHER', subject: 'الفيزياء', status: 'ACTIVE' },
  ]);

  const [showCreateTeacherModal, setShowCreateTeacherModal] = React.useState(false);
  const [importPreview, setImportPreview] = React.useState<any[] | null>(null);
  const [newTeacherForm, setNewTeacherForm] = React.useState({
    name: '',
    email: '',
    subject: 'الرياضيات',
    password: '',
    phone: '',
  });

  const handleBulkAction = (action: string) => {
    alert(`Applying action: ${action} to selected accounts.`);
  };

  const handleCreateTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name || !newTeacherForm.email || !newTeacherForm.password) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newTeacher = {
      id: (users.length + 1).toString(),
      name: newTeacherForm.name,
      email: newTeacherForm.email,
      role: 'TEACHER',
      subject: newTeacherForm.subject,
      status: 'ACTIVE',
    };

    setUsers((prev) => [newTeacher, ...prev]);
    setShowCreateTeacherModal(false);
    setNewTeacherForm({ name: '', email: '', subject: 'الرياضيات', password: '', phone: '' });
    alert(`تم إنشاء حساب المدرس بنجاح! يمكنه الآن تسجيل الدخول وحساب أرباحه.`);
  };

  const handleCsvImportSimulate = () => {
    // Simulate CSV Preview
    setImportPreview([
      { name: 'أحمد محمود', email: 'ahmed@example.com', role: 'STUDENT', status: 'VALID' },
      { name: 'د. طارق علي', email: 'tarek@example.com', role: 'TEACHER', status: 'VALID' },
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
      pageTitle="Identity & Access Directory - إداره الحسابات والمدرسين"
      pageDescription="إدارة حسابات المنصة، إنشاء وإضافة المدرسين الجدد وتفعيل لوحة التحكم الخاصة بكل مدرس."
    >
      <div className="flex flex-col gap-6 select-none max-w-5xl">
        {/* Actions Bar */}
        <div className="flex gap-2 flex-wrap pb-3 border-b border-border/40 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" size="sm" onClick={() => setShowCreateTeacherModal(true)} className="text-xs h-8 font-heading bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              + إنشاء حساب مدرس جديد (Create Teacher)
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('INVITE')} className="text-xs h-8 font-heading">Bulk Invite</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('RESET')} className="text-xs h-8">Reset Password</Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleCsvImportSimulate} className="text-xs h-8">Import CSV File</Button>
        </div>

        {/* Create Teacher Modal */}
        {showCreateTeacherModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border/80 rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <h3 className="text-base font-bold text-card-foreground font-heading">إضافة وفتح حساب مدرس جديد</h3>
                <button onClick={() => setShowCreateTeacherModal(false)} className="text-muted-foreground hover:text-foreground font-bold text-sm">✕</button>
              </div>

              <form onSubmit={handleCreateTeacherSubmit} className="flex flex-col gap-4 text-xs">
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
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="الرياضيات">الرياضيات</option>
                      <option value="الفيزياء">الفيزياء</option>
                      <option value="الكيمياء">الكيمياء</option>
                      <option value="الأحياء">الأحياء</option>
                      <option value="اللغة العربية">اللغة العربية</option>
                      <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                      <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
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

        {/* Import Preview Modal / Panel */}
        {importPreview && (
          <div className="p-5 bg-card border border-border rounded-xl flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-card-foreground font-heading">CSV Import Preview & Dry-Run Validation</h4>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleCommitImport} className="text-xs h-8 font-heading">Commit Import</Button>
                <Button variant="outline" size="sm" onClick={() => setImportPreview(null)} className="text-xs h-8">Rollback / Cancel</Button>
              </div>
            </div>
            <div className="overflow-x-auto border border-border/60 rounded-lg">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-muted/15 text-muted-foreground uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {importPreview.map((x, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 text-card-foreground font-bold font-heading">{x.name}</td>
                      <td className="py-2 px-4">{x.email}</td>
                      <td className="py-2 px-4 font-bold text-primary font-heading">{x.role}</td>
                      <td className="py-2 px-4 text-teal font-bold font-heading">{x.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Lifecycle Roster Table */}
        <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-muted/15 text-muted-foreground uppercase tracking-wider font-bold border-b border-border/60">
              <tr>
                <th className="py-3 px-4">الاسم</th>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">الدور / Role</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
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
                        href="/teacher/dashboard"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                      >
                        معاينة داشبورد المدرس ↗
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
