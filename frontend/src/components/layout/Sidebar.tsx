'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, TrendingUp, Clock, User as UserIcon, LogOut, Shield, ChevronRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/deposit', label: 'Deposit', icon: Wallet },
  { href: '/dashboard/swap', label: 'Swap', icon: RefreshCw },
  { href: '/dashboard/investments', label: 'Invest', icon: TrendingUp },
  { href: '/dashboard/transactions', label: 'History', icon: Clock },
];

const ADMIN_ITEMS = [
  { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#080B14]/80 backdrop-blur-2xl border-r border-white/5 z-30 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/dashboard" className="text-2xl font-heading font-extrabold tracking-tight flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_15px_var(--accent-primary-glow)] group-hover:shadow-[0_0_25px_var(--accent-primary-glow)] transition-all duration-300">
            <span className="text-[#080B14] text-lg font-bold">C</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            CryptoVault
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
        <div className="px-4 mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Menu</div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent border border-[var(--accent-primary)]/20 shadow-[inset_0_0_20px_var(--accent-primary-dim)]' 
                  : 'border border-transparent hover:bg-white/[0.03] hover:border-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-xl transition-colors duration-300 ${
                  isActive ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-white/5 text-[var(--text-secondary)] group-hover:bg-white/10 group-hover:text-white'
                }`}>
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`font-medium transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'
                }`}>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-6 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
              )}
            </Link>
          );
        })}
        
        {user?.is_staff && (
          <div className="pt-6 mt-6 border-t border-white/5">
            <div className="px-4 mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Management</div>
            {ADMIN_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[var(--accent-secondary)]/10 to-transparent border border-[var(--accent-secondary)]/20 shadow-[inset_0_0_20px_var(--accent-secondary-glow)]' 
                      : 'border border-transparent hover:bg-white/[0.03] hover:border-white/5'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl transition-colors duration-300 ${
                    isActive ? 'bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)]' : 'bg-white/5 text-[var(--text-secondary)] group-hover:bg-white/10 group-hover:text-white'
                  }`}>
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'
                  }`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User Profile Area */}
      <div className="p-4 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[#080B14] font-bold text-lg shadow-lg">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate group-hover:text-[var(--accent-primary)] transition-colors">{user?.username || 'User'}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${user?.kyc_status === 'VERIFIED' ? 'bg-[var(--color-success)] shadow-[0_0_5px_var(--color-success)]' : 'bg-[var(--color-warning)] shadow-[0_0_5px_var(--color-warning)]'}`} />
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-medium">{user?.kyc_status || 'UNVERIFIED'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-[var(--text-secondary)] flex items-center justify-center transition-all"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
