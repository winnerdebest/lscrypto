'use client';

import { useAuthStore } from '@/store/authStore';
import { User, Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Usually would call /api/accounts/change-password/
    toast.info('Password change functionality coming soon');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Profile Settings</h1>
        <p className="text-[var(--text-secondary)]">Manage your account and security</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Personal Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 border-b border-[var(--border-glass)] pb-4">Personal Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[var(--accent-primary-dim)] text-[var(--accent-primary)] flex items-center justify-center text-2xl font-bold border border-[var(--accent-primary-glow)]">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.first_name} {user.last_name}</h3>
                  <p className="text-[var(--text-muted)]">@{user.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
                  <div className="flex items-center space-x-2 p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-glass)]">
                    <Mail size={18} className="text-[var(--text-muted)]" />
                    <span className="text-[var(--text-primary)]">{user.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">KYC Status</label>
                  <div className={`flex items-center space-x-2 p-3 rounded-xl border ${
                    user.kyc_status === 'VERIFIED' ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30 text-[var(--color-success)]' :
                    'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30 text-[var(--color-warning)]'
                  }`}>
                    {user.kyc_status === 'VERIFIED' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                    <span className="font-bold">{user.kyc_status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 border-b border-[var(--border-glass)] pb-4">Security</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Current Password</label>
                <input type="password" required className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">New Password</label>
                <input type="password" required className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirm New Password</label>
                <input type="password" required className="input" placeholder="••••••••" />
              </div>
              
              <button type="submit" className="btn-primary w-full mt-4">
                Update Password
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
