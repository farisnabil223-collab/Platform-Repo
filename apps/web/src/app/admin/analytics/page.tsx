'use client';
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent, ChartWidget, Badge, Button } from '@eduverse/ui';
import { linkedChildren, ChildProfile } from '../../../services/parentData';

export default function AdminAnalyticsPage() {
  const [metric, setMetric] = React.useState<'ACADEMIC' | 'FINANCIAL' | 'ATTENDANCE'>('ACADEMIC');
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);

  const scorecards = [
    { name: 'Academic Health', standing: 'Excellent', level: 'success' },
    { name: 'Financial Health', standing: 'Stable', level: 'info' },
    { name: 'Platform Health', standing: 'Optimal (14ms)', level: 'success' },
    { name: 'Security Health', standing: 'Zero Alerts', level: 'success' },
  ];

  const chartData = [
    { label: 'Week 1', value: 78 },
    { label: 'Week 2', value: 82 },
    { label: 'Week 3', value: 89 },
    { label: 'Week 4', value: 94 },
  ];

  const handleExport = (format: string) => {
    alert(`Compiling analytical report templates. Downloading ${format} spreadsheet file...`);
  };

  const selectedRisk = React.useMemo(() => {
    if (!selectedStudentId) return null;
    const student = linkedChildren.find((c) => c.id === selectedStudentId);
    if (!student) return null;

    return {
      name: student.name,
      risk: student.standing === 'HIGH' ? 'HIGH RISK' : 'SAFE STANDING',
      confidence: student.standing === 'HIGH' ? 91 : 95,
      factors: student.standing === 'HIGH'
        ? ['Attendance Rate ↓ (88.5%)', 'Missing Assignments ↑ (3 cases)', 'Late Arrivals Recorded (4 periods)']
        : ['Consistent Attendance (96.2%)', 'Zero Missing Homeworks', 'GPA in standing threshold (3.85)'],
    };
  }, [selectedStudentId]);

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Business Intelligence Cockpit"
      pageDescription="Access global institutional analytics, audit scheduler reports, and analyze student dropout risk factors."
    >
      {/* Executive Scorecards */}
      <div className="grid md:grid-cols-4 gap-6 select-none">
        {scorecards.map((sc, idx) => (
          <div key={idx} className="p-5 bg-card border border-border/60 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{sc.name}</span>
              <h3 className="text-sm font-black font-heading mt-1.5 flex items-center gap-2 text-card-foreground">
                {sc.standing}
              </h3>
            </div>
            <span className="text-[9px] text-muted-foreground mt-2 block">
              Status: <span className="font-bold text-primary font-heading">{sc.level.toUpperCase()}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Analytics Chart & Report Scheduler (left 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6 select-none">
          <Card className="bg-card border border-border/60">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-bold text-card-foreground font-heading">Institutional Growth Metrics</CardTitle>
              <div className="flex gap-1.5">
                {['ACADEMIC', 'FINANCIAL', 'ATTENDANCE'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m as any)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                      metric === m ? 'bg-primary text-primary-foreground' : 'bg-muted/10 border border-border/40 text-muted-foreground'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ChartWidget
                title={`${metric} Progression Trends (4 Weeks)`}
                type="line"
                data={chartData}
              />
            </CardContent>
          </Card>

          {/* Drill-down student risks list */}
          <Card className="bg-card border border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-card-foreground font-heading">Predictive Dropout Risks (Drill-Down Matrix)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto border-t border-border/40 pt-4">
              <table className="min-w-full text-xs text-left">
                <thead className="text-muted-foreground uppercase tracking-wider font-bold">
                  <tr>
                    <th className="pb-2.5">Student Name</th>
                    <th className="pb-2.5">Grade level</th>
                    <th className="pb-2.5 text-center">Missing Homework</th>
                    <th className="pb-2.5 text-right">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {linkedChildren.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`cursor-pointer hover:bg-muted/10 transition-all ${
                        selectedStudentId === student.id ? 'bg-muted/20' : ''
                      }`}
                    >
                      <td className="py-2.5 text-card-foreground font-bold font-heading">{student.name}</td>
                      <td className="py-2.5 text-muted-foreground">{student.grade}</td>
                      <td className="py-2.5 text-center font-semibold">{student.missingAssignments}</td>
                      <td className="py-2.5 text-right">
                        <Badge variant={student.standing === 'HIGH' ? 'error' : 'success'}>
                          {student.standing === 'HIGH' ? 'HIGH RISK' : 'LOW RISK'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Action / Detail sidebar panels (right 1 col) */}
        <div className="lg:col-span-1 flex flex-col gap-6 select-none">
          {/* Report scheduler */}
          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
              Drag-and-Drop Report Scheduler
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-muted/10 border border-border/40 rounded-lg">
                <span>Daily Administrative PDF</span>
                <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="text-[10px] h-7 px-2.5 font-heading">Schedule</Button>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-muted/10 border border-border/40 rounded-lg">
                <span>Weekly Financial CSV</span>
                <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} className="text-[10px] h-7 px-2.5 font-heading">Export</Button>
              </div>
            </div>
          </div>

          {/* Explainable Predictions panel */}
          <div className="p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
              Explainable Risk Advisor
            </h4>
            {selectedRisk ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-card-foreground font-heading">{selectedRisk.name}</span>
                  <Badge variant={selectedRisk.risk === 'HIGH RISK' ? 'error' : 'success'}>{selectedRisk.risk}</Badge>
                </div>
                <div className="text-[10px] text-primary font-bold font-heading">
                  Forecast Confidence: {selectedRisk.confidence}%
                </div>
                <div className="flex flex-col gap-1.5 pt-2.5 border-t border-border/40">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Main Risk Factors:</span>
                  {selectedRisk.factors.map((factor, idx) => (
                    <span key={idx} className="text-[10px] text-foreground">• {factor}</span>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground">Select a student row to inspect explainable risk factor trees.</span>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
