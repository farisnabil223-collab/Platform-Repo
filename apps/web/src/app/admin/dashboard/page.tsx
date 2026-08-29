'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, StatisticWidget, Card, CardHeader, CardTitle, CardContent, Badge, Button, Icon } from '@eduverse/ui';

export default function AdminDashboardPage() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const items = [
      { name: 'Sophia Johnson', category: 'User (Student)', link: '/admin/users' },
      { name: 'Dr. Emily Watson', category: 'User (Teacher)', link: '/admin/users' },
      { name: 'Calculus III', category: 'Course', link: '/admin/academic' },
      { name: 'Tuition Invoice #102', category: 'Ticket/Financial', link: '/admin/financial' },
    ];
    return items.filter((x) => x.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Executive Administration Console"
      pageDescription="Access central logs, configure feature flags, manage tenants, and verify platform health indicators."
    >
      {/* Search Prompt Shortcut */}
      <div className="p-4 bg-card border border-border/60 rounded-xl flex items-center justify-between select-none shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-bold text-foreground font-heading">Cmd + K</span>
          <span>to trigger Global Unified Search Engine</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)} className="text-xs h-8 font-heading">
          Search Platform
        </Button>
      </div>

      {/* Global Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full overflow-hidden flex flex-col text-card-foreground shadow-2xl">
            <div className="p-4 border-b border-border/60 flex gap-2 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, courses, invoices, tickets..."
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Esc</button>
            </div>
            <div className="p-4 flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {searchResults.length === 0 ? (
                <span className="text-xs text-muted-foreground">Type to search platform index...</span>
              ) : (
                searchResults.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.link}
                    className="p-2.5 hover:bg-muted/20 rounded-lg flex justify-between items-center text-xs text-foreground transition-all"
                  >
                    <span>{res.name}</span>
                    <Badge variant="info">{res.category}</Badge>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Widgets */}
      <div className="grid md:grid-cols-4 gap-6 select-none">
        <StatisticWidget
          title="Active Tenants"
          value="4 Institutions"
          description="schools & colleges"
          trend={{ value: '100% OK', type: 'up' }}
        />
        <StatisticWidget
          title="Total Users Registered"
          value="1,452 users"
          description="842 Students, 110 Teachers"
          trend={{ value: '+12% MoM', type: 'up' }}
        />
        <StatisticWidget
          title="Platform Uptime"
          value="99.98%"
          description="Redis, Postgres active"
          trend={{ value: 'Healthy', type: 'up' }}
        />
        <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between select-none">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Security Alerts</span>
            <h3 className="text-lg font-black font-heading mt-1 flex items-center gap-2">
              Status: 
              <Badge variant="success">Safe</Badge>
            </h3>
          </div>
          <span className="text-[9px] text-muted-foreground mt-2 block">Zero suspicious login activities registered today.</span>
        </div>
      </div>

      {/* System Health Statuses */}
      <div className="grid lg:grid-cols-3 gap-6 select-none">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-card border border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-card-foreground font-heading">Recent Administrative Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center p-3 bg-muted/10 border border-border/40 rounded-xl">
                <div>
                  <span className="font-bold text-card-foreground font-heading">Tenant Updated</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Faculty listing saved for University of Algebra.</p>
                </div>
                <span className="text-[9px] text-muted-foreground">10 mins ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
              Service API Latencies
            </h4>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Core REST Engine:</span>
                <span className="font-bold text-teal font-heading">14ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prisma Postgres Link:</span>
                <span className="font-bold text-teal font-heading">8ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
