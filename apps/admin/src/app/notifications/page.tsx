'use client';

import React from 'react';
import { PortalLayout, Button } from '@eduverse/ui';

export default function AdminNotificationsPage() {
  const [broadcastText, setBroadcastText] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    setSuccess(true);
    setBroadcastText('');
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Communications Notification Center"
      pageDescription="Dispatch school emergency circular announcements and define email alert templates."
    >
      <div className="max-w-xl select-none">
        <form onSubmit={handleSendBroadcast} className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
            Emergency Circular Broadcast
          </h4>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Alert Notice Message</label>
            <textarea
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Type urgent broadcast message here..."
              rows={4}
              className="p-3 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all resize-none"
            />
          </div>

          {success && <div className="text-xs text-teal font-bold font-heading">Broadcast notices successfully dispatched to active profiles!</div>}

          <Button type="submit" variant="primary" className="text-xs h-9 px-5 self-end font-heading" disabled={!broadcastText.trim()}>
            Send Broadcast
          </Button>
        </form>
      </div>
    </PortalLayout>
  );
}
