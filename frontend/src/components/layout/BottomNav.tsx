'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, TrendingUp, Clock, User as UserIcon, RefreshCw } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/deposit', label: 'Deposit', icon: Wallet },
  { href: '/dashboard/swap', label: 'Swap', icon: RefreshCw },
  { href: '/dashboard/investments', label: 'Invest', icon: TrendingUp },
  { href: '/dashboard/transactions', label: 'History', icon: Clock },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-[#080B14]/80 backdrop-blur-xl border border-white/10 rounded-full z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex h-full items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-all duration-300 ${
                isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <div className="relative">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
