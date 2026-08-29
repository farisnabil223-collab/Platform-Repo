'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@eduverse/ui';

export default function StudentForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 select-none font-sans transition-colors">
      <Card className="max-w-md w-full bg-card border-border text-card-foreground shadow-2xl">
        <CardHeader className="p-6 text-center">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black font-heading text-xl mx-auto mb-3 shadow-sm">
            EV
          </div>
          <CardTitle className="text-foreground text-xl font-bold font-heading">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground text-xs mt-1">
            We will email you a password recovery link.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="bg-teal/10 border border-teal/20 text-teal p-3 rounded-lg text-xs leading-normal font-medium">
                A password reset link has been dispatched to your email address. Please follow the instructions to regain access.
              </div>
              <Button
                variant="outline"
                className="w-full text-foreground border-border hover:bg-muted text-xs"
                onClick={() => router.push('/student/login')}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="student@eduverse.com"
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

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-heading shadow-md text-sm py-2.5"
                disabled={loading}
                loading={loading}
              >
                Send Reset Link
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground text-xs mt-2"
                onClick={() => router.push('/student/login')}
              >
                Cancel
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
