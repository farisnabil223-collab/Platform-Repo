'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import {
  PortalLayout,
  StatisticWidget,
  ActivityWidget,
  ChartWidget,
  QuickActionsWidget,
  CommandPalette,
} from '@eduverse/ui';

export default function AdminPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const user = {
    name: 'Console Administrator',
    email: 'admin@eduverse.com',
    permissions: ['all'],
  };

  const activities = [
    { id: '1', title: 'Admin Login Detected', time: 'Just now', description: 'Admin console accessed from IP 192.168.1.14.' },
    { id: '2', title: 'Tuition Scheduler Complete', time: '3 hrs ago', description: 'Tuition invoice generation engine finished.' },
  ];

  const apiMetrics = [
    { label: '09:00', value: 142 },
    { label: '12:00', value: 180 },
    { label: '15:00', value: 245 },
    { label: '18:00', value: 198 },
    { label: '21:00', value: 120 },
  ];

  const quickActions = [
    {
      id: 'palette',
      label: 'Open Command Palette',
      description: 'Trigger Cmd+K search box.',
      action: () => setCommandPaletteOpen(true),
    },
    {
      id: 'logs',
      label: 'Flush System Logs',
      description: 'Wipe development level cache logs.',
      action: () => alert('Flushing telemetry database log buffers...'),
    },
  ];

  const commands = [
    { id: 'c1', label: 'Go to User Admin', category: 'Navigation', action: () => alert('Navigating to user management...') },
    { id: 'c2', label: 'Open Billing Gate', category: 'Navigation', action: () => alert('Navigating to billing gateway...') },
    { id: 'c3', label: 'System Health Diagnostics', category: 'Operation', action: () => alert('Triggering network diagnostics check...') },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Administrative Console"
      pageDescription="Monitor platform performance metrics, backend connection telemetry, and security access logs."
    >
      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatisticWidget
          title="Telemetry Registrations"
          value="142 users"
          description="Database registrations count."
          trend={{ value: '+12 today', type: 'up' }}
        />
        <StatisticWidget
          title="API Gateway Latency"
          value="42ms"
          description="Average response time across nodes."
          trend={{ value: 'Stable', type: 'neutral' }}
        />
        <StatisticWidget
          title="System Health State"
          value="99.9%"
          description="Operational uptime average."
          trend={{ value: 'Healthy', type: 'up' }}
        />
      </div>

      {/* Layout Main */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ChartWidget
            title="API Request Latency Profile (24 Hours)"
            type="line"
            data={apiMetrics}
          />
          <QuickActionsWidget actions={quickActions} />
        </div>
        <div className="flex flex-col gap-6">
          <ActivityWidget title="Admin Activity logs" activities={activities} />
        </div>
      </div>

      {/* Keyboard Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />
    </PortalLayout>
  );
}
