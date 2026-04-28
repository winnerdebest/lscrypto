'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import api from '@/lib/axios';

interface Investment {
  id: number;
  user_email: string;
  user_username: string;
  plan_name: string;
  amount: string;
  coin: string;
  start_date: string;
  expected_return: string;
  status: string;
}

export default function InvestmentsPanel() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const res = await api.get('/api/dashboard/admin/investments/');
      setInvestments(res.data);
    } catch (err) {
      console.error('Failed to load investments');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvestments = investments.filter(i => filter === 'ALL' || i.status === filter.toUpperCase());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30';
      default:
        return 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-[var(--bg-card)] rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">{filteredInvestments.length} investments</span>
        <div className="flex items-center space-x-2 bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-glass)]">
          {['ALL', 'ACTIVE', 'COMPLETED'].map(f => (
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
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Expected Return</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)]">
              {filteredInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium">{inv.user_username}</p>
                      <p className="text-xs text-[var(--text-muted)]">{inv.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={14} className="text-[var(--accent-primary)]" />
                      <span className="font-medium">{inv.plan_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-medium">
                    {inv.amount} {inv.coin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-[var(--color-success)]">
                      <DollarSign size={14} />
                      <span className="font-mono">{inv.expected_return} {inv.coin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                    {new Date(inv.start_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvestments.length === 0 && (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            <TrendingUp size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p>No investments found</p>
          </div>
        )}
      </div>
    </div>
  );
}