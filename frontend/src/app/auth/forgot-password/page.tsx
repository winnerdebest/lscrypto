'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { motion } from 'framer-motion';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await api.post('/api/accounts/password-reset/', data);
      setIsSent(true);
      toast.success('Reset link sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-heading font-bold mb-3">Check your email</h1>
        <p className="text-[var(--text-secondary)] mb-10">
          We&apos;ve sent a password reset link to your email address. Please check your inbox and spam folder.
        </p>
        <Link href="/auth/login" className="btn-primary w-full inline-block py-4">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-heading font-bold mb-3">Forgot Password?</h1>
        <p className="text-[var(--text-secondary)]">Enter your email and we&apos;ll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Address</label>
          <input
            type="email"
            {...register('email')}
            className="input bg-[#0A0D18] focus:bg-[#080B14] transition-colors"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-[var(--color-danger)] text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base group hover:shadow-[0_0_30px_var(--accent-primary-glow)]">
          {isLoading ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-10 text-center text-sm text-[var(--text-secondary)]">
        Remembered your password?{' '}
        <Link href="/auth/login" className="text-[var(--accent-primary)] font-bold hover:underline transition-all">
          Sign in securely
        </Link>
      </div>
    </div>
  );
}
