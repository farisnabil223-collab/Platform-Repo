'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import PublicLayout from '../../../components/PublicLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea } from '@eduverse/ui';
import { CheckCircle2, BookOpen } from 'lucide-react';

export default function InstructorApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      specialties: '',
      bio: '',
      qualifications: '',
    },
  });

  const onSubmit = (_data: any) => {
    setLoading(true);
    // Simulate application processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fade-in select-none">
          <CheckCircle2 className="mx-auto text-emerald-400" size={56} />
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-heading text-white">Application Submitted!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your academic profile and qualifications details are currently under administrator review.
            </p>
          </div>
          <Card className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-amber-400 font-bold">PENDING APPROVAL</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed">
              We will notify you via email inside 3-5 business days concerning your instructor workspace credentials.
            </div>
          </Card>
          <div className="pt-2">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Return to Landing Page
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-lg mx-auto py-10 select-none animate-fade-in">
        <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
          <CardHeader className="p-6 text-center border-b border-slate-850">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black font-heading text-xl mx-auto mb-3">
              <BookOpen size={20} />
            </div>
            <CardTitle className="text-white text-xl font-bold font-heading">Become an Instructor</CardTitle>
            <p className="text-xs text-slate-400 mt-1">Submit your academic details to apply for faculty credentials.</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <Input
                type="text"
                label="Full Name"
                placeholder="Dr. Sarah Jenkins"
                required
                error={errors.fullName?.message}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('fullName', { required: 'Full name is required.' })}
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="sarah.jenkins@university.edu"
                required
                error={errors.email?.message}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('email', { required: 'Email address is required.' })}
              />

              <Input
                type="text"
                label="Specialties / Domain (Comma separated)"
                placeholder="E.g., Quantum Computing, Relativistic Mechanics"
                required
                error={errors.specialties?.message}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('specialties', { required: 'Specialties are required.' })}
              />

              <Textarea
                label="Biography Summary"
                placeholder="Briefly summarize your teaching background and research focus..."
                required
                error={errors.bio?.message}
                rows={3}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('bio', { required: 'Biography summary is required.' })}
              />

              <Textarea
                label="Qualifications & Degrees"
                placeholder="E.g., Ph.D. in Theoretical Physics (MIT)"
                required
                error={errors.qualifications?.message}
                rows={2}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('qualifications', { required: 'Qualifications list is required.' })}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 shadow-md text-sm py-2.5 font-bold"
                disabled={loading}
                loading={loading}
              >
                Submit Faculty Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
