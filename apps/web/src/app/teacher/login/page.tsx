'use client';
/* eslint-disable no-undef */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Checkbox, useAuthStore } from '@eduverse/ui';
import api from '../../../services/api';

export default function TeacherLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await api.post<any>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem('eduverse-token', response.data.accessToken);

        const profileRes = await api.get<any>('/users/me');
        const userProfile = {
          name: 'Dr. Emily Watson',
          email: profileRes.data?.email || data.email,
          role: 'TEACHER' as const,
          permissions: ['read:students', 'grade:assignments', 'create:courses'],
        };

        login(userProfile, response.data.accessToken);
        router.push('/teacher/dashboard');
      } else {
        throw new Error('Invalid authentication response.');
      }
    } catch (err: any) {
      setServerError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 select-none font-sans transition-colors">
      <Card className="max-w-md w-full bg-card border-border text-card-foreground shadow-2xl">
        <CardHeader className="p-6 text-center">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black font-heading text-xl mx-auto mb-3">
            EV
          </div>
          <CardTitle className="text-card-foreground text-xl font-bold font-heading">Faculty Portal Login</CardTitle>
          <CardDescription className="text-muted-foreground text-xs mt-1">
            Access curriculum design, grades logs, and student metrics.
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
              label="Faculty Email"
              placeholder="teacher@eduverse.com"
              error={errors.email?.message}
              fullWidth
              className="bg-background border-input text-foreground focus-visible:ring-ring"
              {...register('email', {
                required: 'Faculty email is required.',
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
                  message: 'Password must be at least 8 characters long.',
                },
              })}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <Checkbox
                label="Remember me"
                className="text-muted-foreground"
                {...register('rememberMe')}
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                onClick={() => router.push('/')}
              >
                Cancel
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-sm py-2.5 font-heading"
              disabled={loading}
              loading={loading}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
