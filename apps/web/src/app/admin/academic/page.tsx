'use client';
 

import React from 'react';
import { PortalLayout, Card, CardHeader, CardTitle, CardContent, Badge } from '@eduverse/ui';

export default function AdminAcademicPage() {
  const courses = [
    { id: '1', title: 'Calculus III (Honors)', code: 'MATH-301', teacher: 'Dr. Emily Watson' },
    { id: '2', title: 'Electromagnetic Field Theory', code: 'PHYS-402', teacher: 'Professor Arthur' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="Academic Structure & Curriculums"
      pageDescription="Register degree programs, organize class subjects, and map faculty course ownership."
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl select-none">
        {courses.map((c) => (
          <Card key={c.id} className="bg-card border border-border/60">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-card-foreground text-xs font-bold font-heading">{c.title}</CardTitle>
                  <span className="text-[10px] text-muted-foreground">{c.code}</span>
                </div>
                <Badge variant="primary">Published</Badge>
              </div>
            </CardHeader>
            <CardContent className="border-t border-border/40 pt-3 text-xs flex justify-between">
              <span className="text-muted-foreground">Course Instructor:</span>
              <span className="font-semibold text-card-foreground">{c.teacher}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}
