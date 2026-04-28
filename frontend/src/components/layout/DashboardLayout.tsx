'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import PriceTicker from './PriceTicker';
import { ErrorBoundary } from '../ErrorBoundary';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, you'd check auth token validity on mount.
    // For now, if state is clear, redirect to login unless on public routes.
    if (!isAuthenticated && !isLoading && !pathname.startsWith('/auth')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B14]">
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-[#080B14]/80 backdrop-blur-2xl z-30"></aside>
        <div className="lg:ml-64 min-h-screen flex flex-col relative pb-24 lg:pb-0">
          <main className="flex-1 p-4 lg:p-8">
            <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
              <div className="h-64 bg-white/5 rounded-3xl"></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-24 bg-white/5 rounded-2xl"></div>
                <div className="h-24 bg-white/5 rounded-2xl"></div>
                <div className="h-24 bg-white/5 rounded-2xl"></div>
                <div className="h-24 bg-white/5 rounded-2xl"></div>
              </div>
              <div className="h-64 bg-white/5 rounded-3xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !pathname.startsWith('/auth')) {
    return null; // Prevents flashing protected content before redirect
  }

  return (
    <div className="min-h-screen bg-[#080B14]">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen flex flex-col relative pb-24 lg:pb-0">
        <PriceTicker />
        <main className="flex-1 p-4 lg:p-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
