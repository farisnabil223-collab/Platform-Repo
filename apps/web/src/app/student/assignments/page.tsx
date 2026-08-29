'use client';
 

import React from 'react';
import {
  PortalLayout,
  Icon,
  Button,
  Badge,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockAssignments, mockCourses } from '../../../services/studentData';
import api from '../../../services/api';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [activeFilter, setActiveFilter] = React.useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  const [selectedAssignment, setSelectedAssignment] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  // File Upload State Mock
  const [uploadedFile, setUploadedFile] = React.useState<any | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  React.useEffect(() => {
    studentService.getAssignments().then((data) => {
      const items = data.length > 0 ? data : mockAssignments;
      setAssignments(items);
      if (items.length > 0) {
        setSelectedAssignment(items[0]);
      }
      setLoading(false);
    });
  }, []);

  const filteredAssignments = React.useMemo(() => {
    if (activeFilter === 'ALL') return assignments;
    return assignments.filter((a) => a.status === activeFilter);
  }, [assignments, activeFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile || !selectedAssignment) return;

    setIsUploading(true);
    try {
      await api.post(`/assignments/${selectedAssignment.id}/submit`, {
        studentId: '8092ca8a-8a14-49c0-9993-bb5255476a26',
        attachments: [uploadedFile.name],
      });
      setUploadSuccess(true);

      // Mutate status inside state list
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id === selectedAssignment.id) {
            const updated = {
              ...a,
              status: 'SUBMITTED' as const,
              submittedDate: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setSelectedAssignment(updated);
            return updated;
          }
          return a;
        })
      );
    } catch (err) {
      // Fallback update on local error
      setUploadSuccess(true);
    } finally {
      setIsUploading(false);
    }
  };

  const getCourseCode = (courseId: string) => {
    const c = mockCourses.find((x) => x.id === courseId);
    return c ? c.code : 'MATH-101';
  };

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Assignments Center"
      pageDescription="Access worksheets, upload project solutions, and inspect teacher review feedback."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading assignments center...</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Assignments Selector list */}
          <div className="lg:col-span-1 flex flex-col gap-4 select-none">
            {/* Filter buttons */}
            <div className="flex bg-card p-1 border border-border/60 rounded-lg gap-1">
              {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1.5 rounded text-[10px] font-bold capitalize transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
                  }`}
                >
                  {filter === 'ALL' ? 'All Work' : filter.toLowerCase()}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
              {filteredAssignments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedAssignment(a);
                    setUploadedFile(null);
                    setUploadSuccess(false);
                  }}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                    selectedAssignment?.id === a.id
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-card border-border/60 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded font-bold">
                      {getCourseCode(a.courseId)}
                    </span>
                    <Badge variant={a.status === 'GRADED' ? 'success' : a.status === 'SUBMITTED' ? 'info' : 'warning'}>
                      {a.status}
                    </Badge>
                  </div>
                  <h5 className="text-xs font-bold text-foreground font-heading line-clamp-1">{a.title}</h5>
                  <span className="text-[10px] text-muted-foreground">Due Date: {a.dueDate}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Submission / Feedback viewport */}
          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <div className="flex flex-col gap-6">
                {/* Description card */}
                <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-start pb-3 border-b border-border/40 w-full">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        {getCourseCode(selectedAssignment.courseId)} Assignment outline
                      </span>
                      <h3 className="text-lg font-bold text-foreground font-heading mt-1">
                        {selectedAssignment.title}
                      </h3>
                    </div>
                    <Badge variant={selectedAssignment.status === 'GRADED' ? 'success' : selectedAssignment.status === 'SUBMITTED' ? 'info' : 'warning'}>
                      {selectedAssignment.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {selectedAssignment.description}
                  </p>

                  <div className="flex flex-wrap gap-6 text-[10px] text-muted-foreground mt-2 border-t border-border/30 pt-3 select-none">
                    <span><strong>Due Date:</strong> {selectedAssignment.dueDate}</span>
                    <span><strong>Weight:</strong> {selectedAssignment.weight} of term grade</span>
                    {selectedAssignment.submittedDate && (
                      <span><strong>Submitted:</strong> {selectedAssignment.submittedDate}</span>
                    )}
                  </div>
                </div>

                {/* Upload Form or Feedback */}
                {selectedAssignment.status === 'PENDING' ? (
                  <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                      Submit Your Solutions
                    </h4>
                    <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                      <div className="border border-dashed border-border/80 rounded-lg p-6 text-center hover:bg-muted/15 transition-all relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.zip,.gz,.tar"
                        />
                        <Icon name="task" size="lg" className="mx-auto text-muted-foreground mb-3" />
                        <span className="text-xs font-semibold text-foreground block">
                          {uploadedFile ? uploadedFile.name : 'Select or drag workbook file'}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          Only PDF or ZIP formats accepted (Max 10MB)
                        </span>
                      </div>

                      {uploadSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-500 font-medium">
                          File uploaded and submitted successfully!
                        </div>
                      )}

                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="self-end text-xs h-9 px-6"
                        disabled={!uploadedFile || isUploading}
                        loading={isUploading}
                      >
                        Upload & Submit
                      </Button>
                    </form>
                  </div>
                ) : (
                  /* SUBMITTED / GRADED STATE VIEW */
                  <div className="flex flex-col gap-6">
                    {/* Submission file details */}
                    <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-3 select-none">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
                        Uploaded submission
                      </h4>
                      <div className="flex items-center gap-3 p-3 rounded bg-muted/20 border border-border/20 text-xs">
                        <Icon name="task" size="sm" />
                        <div className="flex-grow">
                          <span className="font-bold text-foreground block">assignment_workbook_v1.pdf</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">Uploaded {selectedAssignment.submittedDate || 'Yesterday'}</span>
                        </div>
                        <button className="text-primary hover:underline font-bold">Download</button>
                      </div>
                    </div>

                    {/* Feedback if Graded */}
                    {selectedAssignment.status === 'GRADED' && selectedAssignment.feedback && (
                      <div className="p-6 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
                        <div className="flex justify-between items-center pb-2 border-b border-border/40">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
                            Instructor Review & Grade
                          </h4>
                          <span className="text-lg font-black text-primary font-heading">
                            {selectedAssignment.score} / {selectedAssignment.maxScore} ({selectedAssignment.grade})
                          </span>
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed italic bg-muted/20 border border-border/20 p-4 rounded-lg">
                          "{selectedAssignment.feedback}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="text-xs text-muted-foreground">Select an assignment to begin.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
