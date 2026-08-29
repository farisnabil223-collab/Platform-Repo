'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Checkbox } from '@eduverse/ui';

export default function ParentLoginPage() {
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
      router.push('/parent/dashboard');
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 select-none font-sans transition-colors">
      <Card className="max-w-md w-full bg-card border-border text-card-foreground shadow-2xl">
        <CardHeader className="p-6 text-center">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black font-heading text-xl mx-auto mb-3">
            EV
          </div>
          <CardTitle className="text-card-foreground text-xl font-bold font-heading">Parent Portal Login</CardTitle>
          <CardDescription className="text-muted-foreground text-xs mt-1">
            Access student progress, reports, and payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              label="Parent Email"
              placeholder="parent@eduverse.com"
              error={errors.email?.message}
              fullWidth
              className="bg-background border-input text-foreground focus-visible:ring-ring"
              {...register('email', {
                required: 'Parent email is required.',
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
