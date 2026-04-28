import { create } from 'zustand';

export interface CoinBalance {
  id: number;
  coin: 'BTC' | 'ETH' | 'USDT';
  balance: string;
}

interface BalanceState {
  balances: CoinBalance[];
  totalDeposited: string;
  totalReturns: string;
  activeInvestmentsCount: number;
  setBalances: (balances: CoinBalance[]) => void;
  setDashboardStats: (stats: { total_deposited: string, total_returns: string, active_investments_count: number }) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balances: [],
  totalDeposited: '0.00',
  totalReturns: '0.00',
  activeInvestmentsCount: 0,
  setBalances: (balances) => set({ balances }),
  setDashboardStats: (stats) => set({ 
    totalDeposited: stats.total_deposited, 
    totalReturns: stats.total_returns,
    activeInvestmentsCount: stats.active_investments_count
  }),
}));
