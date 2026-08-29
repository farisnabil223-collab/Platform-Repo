'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicLayout from '../../components/PublicLayout';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@eduverse/ui';
import { ShieldCheck } from 'lucide-react';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || 'STUDENT';
  const redirect = searchParams.get('redirect') || '';
  const course = searchParams.get('course') || '';
  const testCode = searchParams.get('code') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    try {
      const verified = await authService.verifyOtp(email, otp, 'EMAIL_VERIFICATION');
      if (verified) {
        // Redirect to profile onboarding page
        router.push(`/complete-profile?email=${encodeURIComponent(email)}&role=${role}&redirect=${encodeURIComponent(redirect)}&course=${encodeURIComponent(course)}`);
      } else {
        throw new Error('Verification code is invalid or has expired.');
      }
    } catch (err: any) {
      setServerError(err?.message || 'Verification failed. Please double check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    try {
      const newCode = await authService.sendOtp(email, 'EMAIL_VERIFICATION');
      setResendMessage(`A new verification code has been generated: ${newCode}`);
    } catch {
      setServerError('Failed to resend code. Please try again.');
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto py-10 select-none animate-fade-in">
        <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
          <CardHeader className="p-6 text-center">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black font-heading text-xl mx-auto mb-3">
              <ShieldCheck size={20} />
            </div>
            <CardTitle className="text-white text-xl font-bold font-heading">Verify Your Email</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              We sent a verification code to <span className="text-white font-bold">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            
            {/* Testing code banner */}
            {testCode && (
              <div className="mb-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 p-3 rounded-lg text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider block mb-1">Developer Testing Notice:</span>
                Your generated verification code is: <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">{testCode}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              {serverError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs" role="alert">
                  {serverError}
                </div>
              )}
              
              {resendMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-[10px] leading-normal">
                  {resendMessage}
                </div>
              )}

              <Input
                type="text"
                label="Verification Code"
                placeholder="123456"
                required
                value={otp}
                onChange={(e: any) => setOtp(e.target.value)}
                fullWidth
                className="bg-slate-950 border-slate-800 text-white font-mono text-center tracking-widest text-lg"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 shadow-md text-sm py-2.5 font-bold"
                disabled={loading}
                loading={loading}
              >
                Verify Code
              </Button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500">Loading OTP verification...</span>
        </div>
      </PublicLayout>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}

