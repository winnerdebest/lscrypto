'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Wallet, Clock, TrendingUp } from 'lucide-react';
import { Area, AreaChart } from 'recharts';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useBalanceStore } from '@/store/balanceStore';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

const AssetRow = ({ b, i, displayAssets, coinData, usdValue, isPositive, formatCurrency }: any) => {
  const sparklineData = React.useMemo(() => {
    const data = [];
    let val = 100;
    for(let j = 0; j < 10; j++) {
      val += (Math.random() - (isPositive ? 0.3 : 0.7)) * 5;
      data.push({ value: val });
    }
    return data;
  }, [isPositive]);
  
  return (
    <div className={`p-4 lg:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors ${i !== displayAssets.length - 1 ? 'border-b border-white/5' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg border border-white/10">
          {b.coin === 'BTC' ? '₿' : b.coin === 'ETH' ? 'Ξ' : b.coin === 'USDT' ? '₮' : (b.coin ? b.coin[0] : '?')}
        </div>
        <div>
          <p className="font-bold text-white text-base lg:text-lg">{coinData?.name || b.coin}</p>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)]">{b.coin}</p>
        </div>
      </div>
      
      <div className="hidden lg:flex flex-1 justify-center px-8">
        <AreaChart width={120} height={40} data={sparklineData}>
           <Area type="monotone" dataKey="value" stroke={isPositive ? 'var(--color-success)' : 'var(--color-danger)'} strokeWidth={2} fill="none" />
        </AreaChart>
      </div>

      <div className="text-right">
        <p className="font-bold text-white text-base lg:text-lg">{formatCurrency(usdValue)}</p>
        <div className="flex flex-col items-end">
           <p className="text-xs lg:text-sm text-[var(--text-secondary)]">{Number(b.balance)} {b.coin}</p>
           <span className={`text-xs font-medium mt-0.5 ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
             {isPositive ? '+' : ''}{coinData?.change24h?.toFixed(2) || '0.00'}%
           </span>
        </div>
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const { prices } = useCryptoPrices();
  const { balances, setBalances, setDashboardStats } = useBalanceStore();
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, txnsRes] = await Promise.all([
          api.get('/api/dashboard/summary/'),
          api.get('/api/payments/transactions/')
        ]);
        
        setBalances(dashboardRes.data.balances);
        setDashboardStats(dashboardRes.data);
        setRecentTxns(txnsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [setBalances, setDashboardStats]);

  const totalBalanceUsd = useMemo(() => {
    if (!Array.isArray(balances)) return 0;
    return balances.reduce((sum, b) => {
      const coinPrice = prices[b.coin]?.price || 0;
      return sum + (Number(b.balance) * coinPrice);
    }, 0);
  }, [balances, prices]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const lastBtcPrice = parseFloat(json.data[json.data.length - 1].priceUsd) || 1;
          const safeTotalBalance = isNaN(totalBalanceUsd) ? 0 : totalBalanceUsd;
          
          const data = json.data.map((d: any, i: number) => {
            const btcPrice = parseFloat(d.priceUsd) || 0;
            let value = btcPrice;
            
            if (safeTotalBalance > 0) {
              value = (btcPrice / lastBtcPrice) * safeTotalBalance;
            }
            
            if (isNaN(value) || !isFinite(value)) {
              value = 0;
            }
            
            return { day: i, value };
          });
          setChartData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (!isLoading) {
      fetchHistory();
    }
  }, [totalBalanceUsd, isLoading]);

  const displayAssets = useMemo(() => {
    const assets = [...balances];
    
    const topSymbols = ['BTC', 'ETH', 'USDT', 'SOL', 'BNB'];
    topSymbols.forEach(sym => {
      if (!assets.find(b => b.coin === sym) && prices[sym]) {
        assets.push({ id: `mock-${sym}`, coin: sym, balance: '0.00' } as any);
      }
    });
    
    return assets.sort((a, b) => {
      const valA = Number(a.balance) * (prices[a.coin]?.price || 0);
      const valB = Number(b.balance) * (prices[b.coin]?.price || 0);
      return valB - valA;
    });
  }, [balances, prices]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-white/5 rounded-3xl"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-24 bg-white/5 rounded-2xl"></div>
          <div className="h-24 bg-white/5 rounded-2xl"></div>
          <div className="h-24 bg-white/5 rounded-2xl"></div>
          <div className="h-24 bg-white/5 rounded-2xl"></div>
        </div>
        <div className="h-64 bg-white/5 rounded-3xl"></div>
      </div>
    );
  }

  const formatCurrency = (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-up max-w-5xl mx-auto">
      <div className="rounded-[2.5rem] bg-[#0A0F1C] border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-[var(--accent-primary)]/20 transition-colors duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-[var(--accent-secondary)]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="p-8 lg:p-10 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[var(--text-secondary)] font-medium uppercase tracking-[0.2em] text-xs mb-2">Portfolio Value</p>
              <div className="flex items-baseline space-x-3">
                <h2 className="text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white">
                  {formatCurrency(totalBalanceUsd)}
                </h2>
                <span className="text-[var(--color-success)] text-sm lg:text-base font-medium mb-1.5 flex items-center bg-[var(--color-success)]/10 px-2 py-0.5 rounded-md">
                  <TrendingUp size={14} className="mr-1" /> +2.4%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full bg-white/[0.02]">
          {chartData.length > 0 ? (
            <AreaChart width={1000} height={200} data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} style={{ width: '100%' }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" animationDuration={1000} />
            </AreaChart>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[var(--text-muted)] text-sm">
              Loading market data...
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {[
          { icon: ArrowDownRight, label: 'Deposit', desc: 'Add funds', href: '/dashboard/deposit', color: 'text-[var(--accent-primary)]', bg: 'bg-[var(--accent-primary)]/10', border: 'border-[var(--accent-primary)]/20' },
          { icon: ArrowUpRight, label: 'Withdraw', desc: 'Send assets', href: '/dashboard/withdraw', color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
          { icon: ArrowRightLeft, label: 'Swap', desc: 'Exchange coins', href: '/dashboard/swap', color: 'text-[var(--accent-secondary)]', bg: 'bg-[var(--accent-secondary)]/10', border: 'border-[var(--accent-secondary)]/20' },
          { icon: Wallet, label: 'Invest', desc: 'Earn yield', href: '/dashboard/investments', color: 'text-[var(--accent-secondary)]', bg: 'bg-[var(--accent-secondary)]/10', border: 'border-[var(--accent-secondary)]/20' }
        ].map((action, i) => (
          <Link key={i} href={action.href} className={`p-4 lg:p-6 rounded-3xl border ${action.border} ${action.bg} flex items-center space-x-4 group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-black/40 ${action.color} relative z-10`}>
              <action.icon size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <span className="block text-sm lg:text-base font-bold text-white leading-none mb-1">{action.label}</span>
              <span className="block text-[10px] lg:text-xs text-[var(--text-secondary)] uppercase tracking-wider">{action.desc}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-xl font-heading font-bold text-white">Your Assets</h3>
          </div>
          
          <div className="bg-[#080B14] rounded-3xl border border-white/5 overflow-hidden">
            {displayAssets.map((b, i) => {
              const coinData = prices[b.coin];
              const price = coinData?.price || 0;
              const usdValue = Number(b.balance) * price;
              const isPositive = (coinData?.change24h || 0) >= 0;
              
              return (
                <AssetRow 
                  key={b.id} 
                  b={b} 
                  i={i} 
                  displayAssets={displayAssets} 
                  coinData={coinData} 
                  usdValue={usdValue} 
                  isPositive={isPositive} 
                  formatCurrency={formatCurrency} 
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          <div className="bg-[#0A0F1C] rounded-[2rem] border border-white/10 p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
            <h3 className="text-lg font-heading font-bold text-white mb-4">Top Movers</h3>
            <div className="space-y-4">
              {Object.values(prices).sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 4).map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold border border-white/5">
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">{coin.symbol}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">${coin.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${coin.change24h >= 0 ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>
                    {coin.change24h >= 0 ? '↑' : '↓'} {Math.abs(coin.change24h).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-heading font-bold text-white pl-2">Recent Activity</h3>
            <div className="bg-[#080B14] rounded-3xl border border-white/5 overflow-hidden">
            {recentTxns.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] flex flex-col items-center">
                <Clock size={32} className="mb-3 opacity-20" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentTxns.map((txn) => (
                  <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        {txn.transaction_type === 'deposit' ? <ArrowDownRight size={18} className="text-[var(--accent-primary)]" /> : 
                         txn.transaction_type === 'withdrawal' ? <ArrowUpRight size={18} className="text-white" /> : 
                         <TrendingUp size={18} className="text-[var(--accent-secondary)]" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize text-sm text-white">{txn.transaction_type}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{new Date(txn.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium text-sm text-white">{txn.amount} {txn.coin}</p>
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${
                        txn.status === 'COMPLETED' ? 'text-[var(--color-success)]' :
                        txn.status === 'FAILED' ? 'text-[var(--color-danger)]' :
                        'text-[var(--color-warning)]'
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

          <div className="rounded-3xl p-6 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 border border-[var(--accent-primary)]/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <h4 className="text-lg font-heading font-bold text-white mb-2 relative z-10">Start Earning Yield</h4>
            <p className="text-sm text-white/80 mb-4 relative z-10">Put your idle assets to work with our institutional-grade staking pools.</p>
            <Link href="/dashboard/investments" className="inline-flex items-center text-sm font-bold text-[var(--accent-primary)] group-hover:text-white transition-colors relative z-10">
              Explore Plans <ArrowUpRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}