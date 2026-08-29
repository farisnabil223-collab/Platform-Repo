'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Icon } from '@eduverse/ui';

export default function CourseDiscussionsTab() {
  const params = useParams();
  const courseId = params.id as string;
  const [posts, setPosts] = React.useState<any[]>([
    { id: '1', studentName: 'Sophia Johnson', content: 'What textbook sections correspond to integral substitutions?', date: 'Just now', replies: [] },
  ]);

  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Discussions Board</h4>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="p-5 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center w-full border-b border-border/30 pb-2">
              <span className="font-bold text-xs text-foreground font-heading">{post.studentName}</span>
              <span className="text-[9px] text-muted-foreground">{post.date}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{post.content}</p>
            <div className="flex justify-end gap-2 text-[10px] mt-2">
              <button className="text-primary hover:underline font-bold">Reply Post</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
