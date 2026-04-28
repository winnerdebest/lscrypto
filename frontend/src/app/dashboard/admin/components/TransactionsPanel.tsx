'use client';

import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import api from '@/lib/axios';

interface Transaction {
  id: number;
  user_email: string;
  user_username: string;
  transaction_type: string;
  coin: string;
  amount: string;
  status: string;
  created_at: string;
}

export default function TransactionsPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/api/dashboard/admin/transactions/');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTxns = transactions.filter(t => filter === 'ALL' || t.transaction_type === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30';
      case 'FAILED':
        return 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30';
      default:
        return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30';
      case 'WITHDRAWAL':
        return 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30';
      case 'ROI':
        return 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border-[var(--accent-secondary)]/30';
      default:
        return 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-glass)]';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-[var(--bg-card)] rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">{filteredTxns.length} transactions</span>
        <div className="flex items-center space-x-2 bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-glass)]">
          {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'ROI'].map(f => (
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
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)]">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium">{txn.user_username}</p>
                      <p className="text-xs text-[var(--text-muted)]">{txn.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeBadge(txn.transaction_type)}`}>
                      {txn.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-medium">
                    {txn.amount} {txn.coin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTxns.length === 0 && (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            <Filter size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}