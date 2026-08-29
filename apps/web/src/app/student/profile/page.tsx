'use client';
 

import React from 'react';
import {
  PortalLayout,
  Button,
} from '@eduverse/ui';
import api from '../../../services/api';

export default function StudentProfilePage() {
  const [profile, setProfile] = React.useState({
    name: 'Sophia Johnson',
    email: 'student@eduverse.com',
    studentId: 'EV-2026-8942',
    department: 'Department of Mathematical Sciences',
    advisor: 'Dr. Emily Watson',
  });

  // Settings states
  const [theme, setTheme] = React.useState('system');
  const [language, setLanguage] = React.useState('en');
  const [compactMode, setCompactMode] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [pwSuccess, setPwSuccess] = React.useState(false);
  const [pwError, setPwError] = React.useState('');

  React.useEffect(() => {
    api.get<any>('/users/me').then((res) => {
      if (res.data) {
        setProfile((prev) => ({
          ...prev,
          email: res.data.email,
        }));
      }
    });
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    try {
      setPwError('');
      await api.post('/users/change-password', {
        currentPassword: oldPassword,
        newPassword: newPassword,
      });
      setPwSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err?.message || 'Failed to update password.');
    }
  };

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="My Profile & System Preferences"
      pageDescription="Configure your personal information, localizations settings, and accessibility parameters."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Details (left 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Credentials */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
            <h4 className="text-sm font-bold text-foreground font-heading pb-2 border-b border-border/40">
              Personal Information
            </h4>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                SJ
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-heading">{profile.name}</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                  Student ID: {profile.studentId}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs mt-2">
              <div>
                <span className="text-muted-foreground block">Email Address</span>
                <span className="font-semibold text-foreground mt-0.5 block">{profile.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Department</span>
                <span className="font-semibold text-foreground mt-0.5 block">{profile.department}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Faculty Advisor</span>
                <span className="font-semibold mt-0.5 block text-primary font-bold">{profile.advisor}</span>
              </div>
            </div>
          </div>

          {/* Card: Change Password */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-foreground font-heading pb-2 border-b border-border/40">
              Security Console
            </h4>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                  />
                </div>
              </div>

              {pwSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-500 font-medium">
                  Password updated successfully!
                </div>
              )}

              {pwError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500 font-medium">
                  {pwError}
                </div>
              )}

              <Button type="submit" variant="primary" size="sm" className="self-end text-xs h-9 px-5" disabled={!oldPassword || !newPassword}>
                Update Password
              </Button>
            </form>
          </div>
        </div>

        {/* System Settings & Accessibility Options (right col) */}
        <div className="lg:col-span-1 p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-5 select-none">
          <h4 className="text-sm font-bold text-foreground font-heading pb-2 border-b border-border/40">
            System Preferences
          </h4>

          {/* Theme selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground">Application Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`py-1.5 text-xs rounded border capitalize font-semibold transition-all ${
                    theme === t
                      ? 'bg-primary border-primary text-primary-foreground shadow'
                      : 'border-border/60 hover:bg-muted/30 text-muted-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-bold text-muted-foreground">Language Locale</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (ES)</option>
              <option value="ar">العربية (AR)</option>
            </select>
          </div>

          {/* Accessibility Toggles */}
          <div className="flex flex-col gap-3 mt-4 border-t border-border/40 pt-4">
            <h5 className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              Accessibility Settings
            </h5>
            
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span>Compact Layout View</span>
              <input
                type="checkbox"
                checked={compactMode}
                onChange={() => setCompactMode(!compactMode)}
                className="rounded border-border text-primary bg-background focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span>High Contrast Text</span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={() => setHighContrast(!highContrast)}
                className="rounded border-border text-primary bg-background focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span>Reduced Motion Effects</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={() => setReducedMotion(!reducedMotion)}
                className="rounded border-border text-primary bg-background focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
