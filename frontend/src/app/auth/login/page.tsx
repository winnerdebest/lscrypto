'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/accounts/login/', data);
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }

      const profileRes = await api.get('/api/accounts/profile/');
      setUser(profileRes.data);
      
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await api.post('/api/accounts/google-login/', {
          access_token: tokenResponse.access_token,
        });
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }
        const profileRes = await api.get('/api/accounts/profile/');
        setUser(profileRes.data);
        toast.success('Login successful');
        router.push('/dashboard');
      } catch (err: any) {
        toast.error(err.response?.data?.detail || 'Google Login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => toast.error('Google Login Failed'),
  });

  return (
    <div className="w-full">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-heading font-bold mb-3">Welcome Back</h1>
        <p className="text-[var(--text-secondary)]">Sign in to manage your vault and portfolio.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-[var(--accent-primary)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            {...register('password')}
            className="input bg-[#0A0D18] focus:bg-[#080B14] transition-colors"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-[var(--color-danger)] text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-8 py-4 text-base group hover:shadow-[0_0_30px_var(--accent-primary-glow)]">
          {isLoading ? 'Decrypting vault...' : 'Access Vault'}
        </button>
      </form>

      <div className="my-8 flex items-center justify-center space-x-4">
        <div className="h-[1px] flex-1 bg-[var(--border-glass)]"></div>
        <span className="text-xs text-[var(--text-muted)] font-bold tracking-widest uppercase">OR CONTINUE WITH</span>
        <div className="h-[1px] flex-1 bg-[var(--border-glass)]"></div>
      </div>

      <div className="flex justify-center mb-8">
        <button 
          onClick={() => handleGoogleLogin()}
          type="button"
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl border border-[var(--border-glass)] bg-white/5 hover:bg-white/10 transition-all duration-300 group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.691 1.245 6.655l4.021 3.11z"
            />
            <path
              fill="#34A853"
              d="M16.04 18.013c-1.09.582-2.35.918-3.706.918a7.07 7.07 0 0 1-4.102-1.31l-4.043 3.125C7.327 23.364 10.482 24 13.5 24c4.618 0 8.573-2.582 10.5-6.382l-3.955-3.054-4.005 3.449z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.275c0-.796-.068-1.564-.19-2.305H12v4.355h6.441c-.282 1.414-1.077 2.614-2.268 3.418l3.955 3.054c2.314-2.141 3.363-5.305 3.363-8.522z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235l-4.021 3.109C3.191 21.309 7.273 24 12 24c.482 0 .955-.036 1.423-.105l-4.14-3.559a7.07 7.07 0 0 1-4.017-6.101z"
            />
          </svg>
          <span className="text-white font-medium">Google</span>
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-[var(--accent-primary)] font-bold hover:underline transition-all">
          Create one now
        </Link>
      </div>
    </div>
  );
}
