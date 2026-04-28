'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!uid || !token) {
      toast.error('Invalid reset link');
      router.push('/auth/login');
    }
  }, [uid, token, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      await api.post('/api/accounts/password-reset/confirm/', {
        uidb64: uid,
        token: token,
        password: data.password,
      });
      toast.success('Password reset successfully');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Something went wrong. Link might be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-heading font-bold mb-3">Reset Password</h1>
        <p className="text-[var(--text-secondary)]">Enter your new password below to secure your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">New Password</label>
          <input
            type="password"
            {...register('password')}
            className="input bg-[#0A0D18] focus:bg-[#080B14] transition-colors"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-[var(--color-danger)] text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="input bg-[#0A0D18] focus:bg-[#080B14] transition-colors"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-[var(--color-danger)] text-xs mt-1.5">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base group hover:shadow-[0_0_30px_var(--accent-primary-glow)]">
          {isLoading ? 'Updating Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
