'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import PublicLayout from '../../components/PublicLayout';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@eduverse/ui';
import Link from 'next/link';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const course = searchParams.get('course') || '';

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerError('');
    try {
      // Submits register payload
      await authService.register(data.email, data.password, data.role);
      
      // Request an OTP code to email
      const otpCode = await authService.sendOtp(data.email, 'EMAIL_VERIFICATION');
      
      // Navigate to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&role=${data.role}&redirect=${encodeURIComponent(redirect)}&course=${encodeURIComponent(course)}&code=${otpCode}`);
    } catch (err: any) {
      setServerError(err?.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto py-10 select-none animate-fade-in">
        <Card className="bg-card border-border text-card-foreground shadow-2xl">
          <CardHeader className="p-6 text-center">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black font-heading text-xl mx-auto mb-3">
              EV
            </div>
            <CardTitle className="text-card-foreground text-xl font-bold font-heading">Create Your Account</CardTitle>
            <CardDescription className="text-muted-foreground text-xs mt-1">
              Join EduVerse to access courses, track grades, and connect with faculty.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg text-xs font-medium" role="alert">
                  {serverError}
                </div>
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="you@domain.com"
                error={errors.email?.message}
                fullWidth
                className="bg-background border-input text-foreground focus-visible:ring-ring"
                {...register('email', {
                  required: 'Email address is required.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address.',
                  },
                })}
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                fullWidth
                className="bg-background border-input text-foreground focus-visible:ring-ring"
                {...register('password', {
                  required: 'Password is required.',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters.',
                  },
                })}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                fullWidth
                className="bg-background border-input text-foreground focus-visible:ring-ring"
                {...register('confirmPassword', {
                  required: 'Confirm password is required.',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match.',
                })}
              />

              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Account Role</label>
                <select
                  className="px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  {...register('role')}
                >
                  <option value="STUDENT">Student</option>
                  <option value="PARENT">Parent</option>
                  <option value="TEACHER">Instructor</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-sm py-2.5 font-heading"
                disabled={loading}
                loading={loading}
              >
                Sign Up
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-2">
                Already have an account?{' '}
                <Link href="/student/login" className="text-primary hover:underline font-bold">
                  Login here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading signup console...</span>
        </div>
      </PublicLayout>
    }>
      <RegisterContent />
    </Suspense>
  );
}

