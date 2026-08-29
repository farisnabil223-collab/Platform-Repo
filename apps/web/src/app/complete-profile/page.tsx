'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import PublicLayout from '../../components/PublicLayout';
import { useAuthStore, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@eduverse/ui';
import { UserCheck } from 'lucide-react';

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const email = searchParams.get('email') || 'student@eduverse.com';
  const role = searchParams.get('role') || 'STUDENT';
  const redirect = searchParams.get('redirect') || '';
  const course = searchParams.get('course') || '';

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      grade: 'Grade 11',
      school: '',
      city: '',
      learningGoal: '',
      language: 'English',
      studentCode: '', // optional integration code
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    // Simulate updating backend user profiles
    setTimeout(() => {
      const userProfile = {
        name: `${data.firstName} ${data.lastName}`,
        email: email,
        role: role as 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN',
        permissions: [],
      };

      // Set auth state
      login(userProfile, 'mock-access-token-' + Math.random().toString());
      setLoading(false);

      // Handle redirect flow
      if (course) {
        if (redirect) {
          router.push(`${redirect}?course=${course}`);
        } else {
          router.push(`/courses/${course}`);
        }
      } else if (redirect) {
        router.push(redirect);
      } else {
        // Fallback: Dashboard
        if (role === 'TEACHER') {
          router.push('/teacher/dashboard');
        } else if (role === 'PARENT') {
          router.push('/parent/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }
    }, 1500);
  };

  const gradeOptions = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University', 'Professional'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Mandarin'];

  return (
    <PublicLayout>
      <div className="max-w-xl mx-auto py-10 select-none animate-fade-in">
        <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
          <CardHeader className="p-6 text-center border-b border-slate-850">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black font-heading text-xl mx-auto mb-3">
              <UserCheck size={20} />
            </div>
            <CardTitle className="text-white text-xl font-bold font-heading">Complete Your Profile</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Onboard details to customize your classes and learning dashboard recommendation paths.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="First Name"
                  placeholder="Sophia"
                  required
                  error={errors.firstName?.message}
                  fullWidth
                  className="bg-slate-950 border-slate-800 text-white"
                  {...register('firstName', { required: 'First name is required.' })}
                />
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Johnson"
                  required
                  error={errors.lastName?.message}
                  fullWidth
                  className="bg-slate-950 border-slate-800 text-white"
                  {...register('lastName', { required: 'Last name is required.' })}
                />
              </div>

              <Input
                type="text"
                label="Phone Number"
                placeholder="+1 (555) 019-2834"
                error={errors.phone?.message}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('phone')}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Academic Grade</label>
                  <select
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                    {...register('grade')}
                  >
                    {gradeOptions.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Preferred Language</label>
                  <select
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                    {...register('language')}
                  >
                    {languageOptions.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="School Name (Optional)"
                  placeholder="Lincoln High School"
                  fullWidth
                  className="bg-slate-950 border-slate-800 text-white"
                  {...register('school')}
                />
                <Input
                  type="text"
                  label="City / Region"
                  placeholder="San Francisco"
                  fullWidth
                  className="bg-slate-950 border-slate-800 text-white"
                  {...register('city')}
                />
              </div>

              <Input
                type="text"
                label="Learning Goal"
                placeholder="E.g., Master college algebra concepts to prepare for physics studies"
                fullWidth
                className="bg-slate-950 border-slate-800 text-white"
                {...register('learningGoal')}
              />

              <div className="border-t border-slate-805 pt-4 space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">School Integration (Optional)</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">If your institution provided a registration code, link it here.</span>
                </div>
                <Input
                  type="text"
                  placeholder="EV-2026-XXXX"
                  fullWidth
                  className="bg-slate-950 border-slate-800 text-white"
                  {...register('studentCode')}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 shadow-md text-sm py-2.5 font-bold"
                disabled={loading}
                loading={loading}
              >
                Complete Onboarding
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500">Loading profile setup...</span>
        </div>
      </PublicLayout>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}

