'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TeacherCourseWorkspaceEntry() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  React.useEffect(() => {
    router.replace(`/teacher/courses/${courseId}/overview`);
  }, [courseId, router]);

  return (
    <div className="p-12 text-center animate-pulse">
      <span className="text-xs text-muted-foreground">Redirecting to overview panel...</span>
    </div>
  );
}
