'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface Withdrawal {
  id: number;
  user_email: string;
  user_username: string;
  coin: string;
  amount: string;
  wallet_address: string;
  status: string;
  created_at: string;
}

interface WithdrawalsPanelProps {
  onStatsUpdate: () => void;
}

export default function WithdrawalsPanel({ onStatsUpdate }: WithdrawalsPanelProps) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/api/dashboard/admin/withdrawals/');
      setWithdrawals(res.data);
    } catch (err) {
      console.error('Failed to load withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const processWithdrawal = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/api/dashboard/admin/withdrawals/${id}/`, { action });
      toast.success(`Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchWithdrawals();
      onStatsUpdate();
    } catch (err) {
      toast.error(`Failed to ${action} withdrawal`);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => filter === 'ALL' || w.status === filter.toUpperCase());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { class: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30', icon: CheckCircle };
      case 'PROCESSING':
        return { class: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30', icon: Clock };
      case 'REJECTED':
        return { class: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30', icon: XCircle };
      default:
        return { class: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30', icon: AlertTriangle };
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-[var(--bg-card)] rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">{filteredWithdrawals.length} withdrawals</span>
        <div className="flex items-center space-x-2 bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-glass)]">
          {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === f ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card--flat border border-[var(--border-glass)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-input)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Wallet</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)]">
              {filteredWithdrawals.map((w) => {
                const statusInfo = getStatusBadge(w.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={w.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{w.user_username}</p>
                        <p className="text-xs text-[var(--text-muted)]">{w.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-medium">
                      {w.amount} {w.coin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono text-xs text-[var(--text-muted)]">{w.wallet_address.slice(0, 10)}...{w.wallet_address.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.class}`}>
                        <StatusIcon size={12} />
                        <span>{w.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                      {new Date(w.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {w.status === 'PENDING' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => processWithdrawal(w.id, 'approve')}
                            className="p-2 hover:bg-[var(--color-success)]/10 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={16} className="text-[var(--color-success)]" />
                          </button>
                          <button
                            onClick={() => processWithdrawal(w.id, 'reject')}
                            className="p-2 hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={16} className="text-[var(--color-danger)]" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredWithdrawals.length === 0 && (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            <CheckCircle size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p>No withdrawals found</p>
          </div>
        )}
      </div>
    </div>
  );
}