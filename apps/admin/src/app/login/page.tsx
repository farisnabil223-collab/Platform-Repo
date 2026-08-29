'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Checkbox } from '@eduverse/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Route to admin control panel
      router.push('/');
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none font-sans">
      <Card className="max-w-md w-full bg-slate-900 border-slate-800 text-white shadow-2xl">
        <CardHeader className="p-6 text-center">
          <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black font-heading text-xl mx-auto mb-3">
            EV
          </div>
          <CardTitle className="text-white text-xl font-bold font-heading">Admin Console Login</CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Access database management, telemetry, and security scopes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              label="Admin Identity Email"
              placeholder="admin@eduverse.com"
              error={errors.email?.message}
              fullWidth
              className="bg-slate-950 border-slate-800 text-white focus-visible:ring-violet-500"
              {...register('email', {
                required: 'Identity email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address.',
                },
              })}
            />

            <Input
              type="password"
              label="Password Token"
              placeholder="••••••••"
              error={errors.password?.message}
              fullWidth
              className="bg-slate-950 border-slate-800 text-white focus-visible:ring-violet-500"
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
                label="Remember identity"
                className="text-slate-400"
                {...register('rememberMe')}
              />
              <button
                type="button"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                onClick={() => router.push('http://localhost:3000')}
              >
                Exit Console
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4 bg-violet-600 hover:bg-violet-500 shadow-md text-sm py-2.5"
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
