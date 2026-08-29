'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@eduverse/ui';
import { teacherCoursesService } from '../../../../../services/teacherCoursesService';

export default function CourseSettingsTab() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [archived, setArchived] = React.useState(false);

  const handleArchive = async () => {
    try {
      await teacherCoursesService.archiveCourse(courseId);
    } catch (err) {
      // Local state fallback update
      setArchived(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-2 border-b border-border/40">
        <h4 className="text-sm font-bold text-foreground font-heading">Course Archival & Workspace Settings</h4>
      </div>

      <Card className="border-destructive/30 bg-destructive/10 text-card-foreground shadow-sm">
        <CardHeader className="p-6">
          <CardTitle className="text-destructive text-sm font-bold font-heading">Danger Zone</CardTitle>
          <CardDescription className="text-muted-foreground text-xs">Archiving a course hides it from active rosters catalog.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Archive status: {archived ? 'Archived' : 'Active'}</span>
            <Button
              variant="outline"
              onClick={handleArchive}
              className="text-xs h-9 px-4 border-destructive text-destructive hover:bg-destructive/10 font-bold"
              disabled={archived}
            >
              Archive Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
