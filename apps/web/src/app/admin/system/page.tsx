'use client';
 

import React from 'react';
import { PortalLayout, StatisticWidget, Badge } from '@eduverse/ui';

export default function AdminSystemPage() {
  const nodes = [
    { name: 'Core NestJS REST API Server', status: 'ONLINE', latency: '12ms', type: 'Node.js' },
    { name: 'PostgreSQL Database Engine', status: 'ONLINE', latency: '4ms', type: 'Prisma' },
    { name: 'Redis Cache & Pub/Sub', status: 'ONLINE', latency: '1ms', type: 'In-Memory' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Cluster Infrastructure Health"
      pageDescription="Verify API latency benchmarks, database connection counts, and Redis memory parameters."
    >
      <div className="flex flex-col gap-6 select-none max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          <StatisticWidget
            title="Database Connections"
            value="14 active"
            description="Peak limit: 100 links"
            trend={{ value: 'Safe', type: 'up' }}
          />
          <StatisticWidget
            title="Redis Cache Hit Rate"
            value="94.2%"
            description="Saves database query load"
            trend={{ value: 'Optimal', type: 'up' }}
          />
          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Global Latency Average</span>
              <h3 className="text-lg font-black font-heading mt-1 flex items-center gap-2">
                17ms
                <Badge variant="success">Fast</Badge>
              </h3>
            </div>
            <span className="text-[9px] text-muted-foreground mt-2 block">Refreshed every 10 seconds.</span>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {nodes.map((node, idx) => (
            <div key={idx} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-start gap-4 hover:border-primary/20 transition-all shadow-sm">
              <div>
                <h4 className="text-xs font-bold text-card-foreground font-heading">{node.name}</h4>
                <span className="text-[10px] text-muted-foreground mt-1 block">Type: {node.type} • Latency: {node.latency}</span>
              </div>
              <Badge variant="success">{node.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
