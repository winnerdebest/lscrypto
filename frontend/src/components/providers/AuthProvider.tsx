'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initSession = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/accounts/profile/');
        setUser(response.data);
      } catch (err) {
        console.error('Session restoration failed');
        localStorage.removeItem('access_token');
        setLoading(false);
      }
    };

    initSession();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
