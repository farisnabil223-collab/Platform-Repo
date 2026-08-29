'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import {
  PortalLayout,
  Button,
  Icon,
  Badge,
} from '@eduverse/ui';

export default function TeacherQuestionBankPage() {
  const [search, setSearch] = React.useState('');
  const [questions, setQuestions] = React.useState<any[]>([
    { id: 'q1', text: 'Find the limit of (1+x)^(1/x) as x approaches 0.', category: 'Mathematics', tag: 'Calculus I', difficulty: 'HARD' },
    { id: 'q2', text: 'Define the Heisenberg Uncertainty Principle formula.', category: 'Physics', tag: 'Quantum Theory', difficulty: 'MEDIUM' },
  ]);

  const filtered = questions.filter((q) => q.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Question Bank Repository"
      pageDescription="Organize, tag, and reuse academic test questions across multiple quizzes."
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center select-none pb-4 border-b border-border/40">
        <div className="relative flex-grow max-w-md w-full">
          <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions text..."
            className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          />
        </div>

        <Button variant="primary" className="text-xs h-9 px-4 gap-1.5 shrink-0">
          <span className="font-bold">+</span> Add Question
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((q) => (
          <div key={q.id} className="p-4 bg-card border border-border/60 rounded-xl flex justify-between items-center gap-4 select-none hover:border-primary/20 transition-all">
            <div>
              <p className="text-xs font-bold text-foreground font-heading">{q.text}</p>
              <div className="flex gap-3 text-[10px] text-muted-foreground mt-1.5 items-center">
                <span>Category: <strong>{q.category}</strong></span>
                <span>Tag: <strong>{q.tag}</strong></span>
                <Badge variant={q.difficulty === 'HARD' ? 'error' : 'warning'}>{q.difficulty}</Badge>
              </div>
            </div>

            <button className="text-primary hover:underline font-bold text-xs shrink-0">Reuse</button>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
