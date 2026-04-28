'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock, CreditCard, Shield, Activity, FileText } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import AdminTabs from './components/AdminTabs';
import UsersPanel from './components/UsersPanel';
import TransactionsPanel from './components/TransactionsPanel';
import WithdrawalsPanel from './components/WithdrawalsPanel';
import InvestmentsPanel from './components/InvestmentsPanel';
import PlansPanel from './components/PlansPanel';

interface AdminStats {
  total_users: number;
  total_deposits: string;
  total_withdrawals: string;
  pending_withdrawals: number;
  pending_kyc: number;
  active_investments: number;
}

const STAT_CARDS = [
  { label: 'Total Users', icon: Users, key: 'total_users' as const, color: 'primary' },
  { label: 'Total Deposits', icon: DollarSign, key: 'total_deposits' as const, color: 'success' },
  { label: 'Total Withdrawals', icon: CreditCard, key: 'total_withdrawals' as const, color: 'danger' },
  { label: 'Active Investments', icon: TrendingUp, key: 'active_investments' as const, color: 'secondary' },
];

const ALERT_CARDS = [
  { label: 'Pending Withdrawals', icon: ArrowUpRight, key: 'pending_withdrawals' as const, color: 'warning' },
  { label: 'Pending KYC', icon: Shield, key: 'pending_kyc' as const, color: 'danger' },
];

export default function AdminPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_staff) {
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/dashboard/admin/stats/');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (user && !user.is_staff) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Shield size={64} className="text-[var(--color-danger)]" />
        <h2 className="text-2xl font-heading font-bold">Access Denied</h2>
        <p className="text-[var(--text-secondary)]">You do not have permission to access the admin panel.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-32 bg-[var(--bg-card)] rounded-2xl"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[var(--bg-card)] rounded-xl"></div>)}
      </div>
    </div>;
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'plans', label: 'Plans', icon: Activity },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Admin Panel</h1>
        <p className="text-[var(--text-secondary)]">Manage users, transactions, and platform settings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="glass-card p-5">
            <div className="flex items-center space-x-2 text-[var(--text-secondary)] mb-2">
              <card.icon size={16} /> <span className="text-sm">{card.label}</span>
            </div>
            <p className="text-xl font-mono font-bold">
              {card.key === 'total_deposits' || card.key === 'total_withdrawals'
                ? `$${Number(stats?.[card.key] || 0).toLocaleString()}`
                : stats?.[card.key] || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ALERT_CARDS.map((card) => (
          <div 
            key={card.key} 
            className={`glass-card p-5 border ${
              card.color === 'warning' ? 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5' : 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5'
            }`}
          >
            <div className={`flex items-center space-x-2 mb-2 ${
              card.color === 'warning' ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'
            }`}>
              <card.icon size={16} /> <span className="text-sm">{card.label}</span>
            </div>
            <p className="text-xl font-mono font-bold">{stats?.[card.key] || 0}</p>
          </div>
        ))}
      </div>

      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[400px]">
        {activeTab === 'users' && <UsersPanel onStatsUpdate={fetchStats} />}
        {activeTab === 'transactions' && <TransactionsPanel />}
        {activeTab === 'withdrawals' && <WithdrawalsPanel onStatsUpdate={fetchStats} />}
        {activeTab === 'investments' && <InvestmentsPanel />}
        {activeTab === 'plans' && <PlansPanel onStatsUpdate={fetchStats} />}
      </div>
    </div>
  );
}