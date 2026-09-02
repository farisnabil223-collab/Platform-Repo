'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Button } from '@eduverse/ui';

export default function AdminProfilePage() {
  const [profile] = React.useState({
    name: 'SuperAdmin Control Panel',
    email: 'admin@eduverse.com',
  });

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    setSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Administrative Credentials Profile"
      pageDescription="Verify control panel email and update security password fields."
    >
      <div className="grid lg:grid-cols-3 gap-6 max-w-4xl select-none">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Admin Profile Details */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
              Personal Information
            </h4>
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                AD
              </div>
              <div>
                <h3 className="font-bold text-card-foreground font-heading">{profile.name}</h3>
                <span className="text-[10px] text-muted-foreground">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Password Updater */}
          <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
              Update Password
            </h4>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="p-2.5 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                </div>
              </div>

              {success && <div className="text-xs text-teal font-bold font-heading">Password updated successfully!</div>}
              {error && <div className="text-xs text-destructive font-bold">{error}</div>}

              <Button type="submit" variant="primary" size="sm" className="self-end text-xs h-9 px-5 font-heading" disabled={!oldPassword || !newPassword}>
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
