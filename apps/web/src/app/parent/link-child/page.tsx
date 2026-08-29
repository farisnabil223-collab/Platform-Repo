'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortalLayout, Card, Button, Input } from '@eduverse/ui';
import { UserPlus, CheckCircle2 } from 'lucide-react';

export default function LinkChildPage() {
  const router = useRouter();
  const [studentCode, setStudentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) return;

    setLoading(true);
    setError('');

    // Simulate verification
    setTimeout(() => {
      if (studentCode.toUpperCase() === 'EV-2026-8942') {
        setSuccess(true);
        setLoading(false);
      } else {
        setError('Student code not found. Please verify the code (e.g., try "EV-2026-8942").');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Link Student Profile"
      pageDescription="Establish guardian relationship tracking by inputting your student's unique institutional code."
    >
      <div className="max-w-md select-none animate-fade-in">
        {success ? (
          <Card className="bg-card border border-border p-6 rounded-2xl text-center space-y-4 shadow-xl">
            <CheckCircle2 className="mx-auto text-teal" size={48} />
            <div>
              <h3 className="text-sm font-bold font-heading text-card-foreground">Student Linked Successfully!</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                You can now view attendance check-ins, homework schedules, and grade progress files.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => router.push('/parent/dashboard')}
                className="w-full text-xs font-bold font-heading"
              >
                Go to Parent Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <form onSubmit={handleLink} className="space-y-4">
              <div className="flex items-center gap-2 text-primary pb-2 border-b border-border/40">
                <UserPlus size={16} />
                <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-card-foreground">Link New Dependent</h3>
              </div>
              
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <Input
                type="text"
                label="Student Registration Code"
                placeholder="EV-2026-8942"
                required
                value={studentCode}
                onChange={(e: any) => setStudentCode(e.target.value)}
                fullWidth
                className="bg-background border-input text-foreground font-mono text-center text-sm focus-visible:ring-ring"
              />

              <div className="text-[10px] text-muted-foreground leading-normal bg-muted/20 p-3 rounded-xl border border-border/40">
                <span className="font-bold text-foreground uppercase tracking-wider block mb-1">Guardian Consent Notice:</span>
                Linking student profiles requires authorization from the school administration board. Registered student codes can be found on student identification cards.
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                loading={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2 shadow-sm font-heading"
              >
                Verify & Link Student
              </Button>
            </form>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
