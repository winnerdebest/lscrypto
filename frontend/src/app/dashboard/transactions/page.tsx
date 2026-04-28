'use client';

import { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Repeat, Filter } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/api/payments/transactions/');
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTxns = transactions.filter(t => filter === 'ALL' || t.transaction_type === filter);

  const getIcon = (type: string) => {
    switch(type) {
      case 'DEPOSIT': return <ArrowDownLeft size={20} className="text-[var(--color-success)]" />;
      case 'WITHDRAWAL': return <ArrowUpRight size={20} className="text-[var(--color-danger)]" />;
      case 'ROI': return <Repeat size={20} className="text-[var(--accent-primary)]" />;
      default: return <ArrowDownLeft size={20} />;
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-[var(--bg-card)] rounded-2xl"></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Transaction History</h1>
          <p className="text-[var(--text-secondary)]">Track all your deposits, withdrawals, and daily returns.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-glass)] overflow-x-auto hide-scrollbar">
          {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'ROI'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === f ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card--flat border border-[var(--border-glass)] rounded-2xl overflow-hidden">
        {filteredTxns.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Filter size={48} className="text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)] text-lg">No transactions found for this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-glass)]">
            {filteredTxns.map((txn) => (
              <div key={txn.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-[var(--bg-card-hover)] transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-input)] flex items-center justify-center border border-[var(--border-glass)] group-hover:border-[var(--border-strong)] transition-colors">
                    {getIcon(txn.transaction_type)}
                  </div>
                  <div>
                    <p className="font-bold capitalize">{txn.transaction_type.toLowerCase()}</p>
                    <p className="text-sm text-[var(--text-muted)]">{new Date(txn.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-mono font-bold text-lg ${
                    txn.transaction_type === 'WITHDRAWAL' ? 'text-[var(--text-primary)]' : 'text-[var(--color-success)]'
                  }`}>
                    {txn.transaction_type === 'WITHDRAWAL' ? '-' : '+'}{txn.amount} {txn.coin}
                  </p>
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border mt-1 ${
                    txn.status === 'COMPLETED' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30' :
                    txn.status === 'FAILED' ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30' :
                    'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
