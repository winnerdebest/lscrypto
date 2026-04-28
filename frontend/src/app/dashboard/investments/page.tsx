'use client';

import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, CheckCircle, Clock, ShieldCheck, Zap, Crown, ArrowRight, X, Wallet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

const PLAN_THEMES: Record<string, any> = {
  'Basic': { icon: ShieldCheck, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', accent: 'text-blue-400' },
  'Pro': { icon: Zap, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', accent: 'text-purple-400' },
  'Institutional': { icon: Crown, color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', accent: 'text-amber-400' },
};

export default function InvestmentsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [myInvestments, setMyInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvesting, setIsInvesting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [totalEarned, setTotalEarned] = useState('0.00');
  const { prices } = useCryptoPrices();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, invRes, summaryRes] = await Promise.all([
        api.get('/api/investments/plans/'),
        api.get('/api/investments/my-investments/'),
        api.get('/api/dashboard/summary/')
      ]);
      setPlans(plansRes.data);
      setMyInvestments(invRes.data);
      setTotalEarned(summaryRes.data.total_roi);
    } catch (err) {
      toast.error('Failed to load investment data');
    } finally {
      setIsLoading(false);
    }
  };

  const cryptoAmount = useMemo(() => {
    if (!investAmount || isNaN(Number(investAmount)) || !prices[selectedCoin]) return '0.00';
    const price = prices[selectedCoin].price;
    return (Number(investAmount) / price).toFixed(selectedCoin === 'USDT' ? 2 : 8);
  }, [investAmount, selectedCoin, prices]);

  const handleInvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !investAmount) return;

    if (Number(investAmount) < Number(selectedPlan.minimum_amount)) {
      toast.error(`Minimum investment for this plan is $${selectedPlan.minimum_amount}`);
      return;
    }

    setIsInvesting(true);
    try {
      await api.post('/api/investments/my-investments/', {
        plan: selectedPlan.id,
        amount_usd: Number(investAmount),
        coin: selectedCoin,
      });
      toast.success('Investment plan activated successfully!');
      setSelectedPlan(null);
      setInvestAmount('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to activate investment');
    } finally {
      setIsInvesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
        <div className="h-64 bg-white/5 rounded-[2rem]"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 rounded-[2rem]"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-up max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="relative rounded-[2.5rem] bg-[#0A0F1C] border border-white/10 p-8 lg:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent-secondary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wider mb-4">
              Institutional Yield
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-4">Grow Your Wealth Automatically</h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Choose from our curated high-yield investment plans. All plans are protected by our institutional-grade security and automated ROI distribution.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-1">Active Plans</p>
                <p className="text-3xl font-heading font-bold text-white">{myInvestments.filter(i => i.status === 'active').length}</p>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-1">Total Earned</p>
                <p className="text-3xl font-heading font-bold text-[var(--color-success)]">${Number(totalEarned).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-8 flex items-center">
          <Zap className="mr-3 text-[var(--accent-primary)]" size={24} /> Available Tiers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => {
            const theme = PLAN_THEMES[plan.name] || PLAN_THEMES['Basic'];
            const PlanIcon = theme.icon;
            
            return (
              <div key={plan.id} className={`group relative rounded-[2rem] border ${theme.border} bg-[#0A0F1C] p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center mb-6 border ${theme.border} ${theme.accent}`}>
                    <PlanIcon size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className={`text-4xl font-heading font-bold ${theme.accent}`}>{plan.roi_percentage}%</span>
                    <span className="text-[var(--text-muted)] ml-2 uppercase text-xs tracking-widest font-bold">Daily ROI</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[var(--text-secondary)] text-sm">Lock-in Period</span>
                      <span className="text-white font-bold">{plan.duration_days} Days</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[var(--text-secondary)] text-sm">Minimum Entry</span>
                      <span className="text-white font-bold">${Number(plan.minimum_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-[var(--text-secondary)] text-sm">Risk Profile</span>
                      <span className="text-[var(--color-success)] font-bold text-xs uppercase tracking-tighter">Verified • Low Risk</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 ${
                      plan.name === 'Pro' ? 'bg-[var(--accent-primary)] text-black' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    Select Plan <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Investments */}
      {myInvestments.length > 0 && (
        <div className="pt-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-8 flex items-center">
            <Clock className="mr-3 text-[var(--accent-secondary)]" size={24} /> Active Portfolio
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {myInvestments.map(inv => (
              <div key={inv.id} className="rounded-3xl border border-white/5 bg-[#080B14] p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{inv.plan.name} Plan</h3>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-1">
                      Started: {new Date(inv.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    inv.status === 'active' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20' : 'bg-white/5 text-[var(--text-muted)]'
                  }`}>
                    {inv.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                    <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-1">Staked Amount</p>
                    <p className="text-lg font-mono font-bold text-white">{inv.amount} {inv.coin}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                    <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-1">Expected Return</p>
                    <p className="text-lg font-mono font-bold text-[var(--color-success)]">{inv.expected_return} {inv.coin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#080B14]/80 backdrop-blur-sm" onClick={() => setSelectedPlan(null)} />
          <div className="relative w-full max-w-md bg-[#0D1117] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-fade-up">
            <button onClick={() => setSelectedPlan(null)} className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mx-auto mb-4 border border-[var(--accent-primary)]/20">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white">Activate {selectedPlan.name}</h3>
              <p className="text-[var(--text-secondary)] mt-2">Enter the amount you wish to stake</p>
            </div>

            <form onSubmit={handleInvestSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white ml-1">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                  <input 
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="input pl-8 pr-12 text-xl font-bold"
                    placeholder="0.00"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs font-bold uppercase">USD</span>
                </div>
                <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest ml-1">Minimum: ${selectedPlan.minimum_amount}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white ml-1">Select Asset</label>
                <div className="grid grid-cols-3 gap-3">
                  {['BTC', 'ETH', 'USDT'].map(coin => (
                    <button
                      key={coin}
                      type="button"
                      onClick={() => setSelectedCoin(coin)}
                      className={`py-3 rounded-xl border font-bold text-xs transition-all ${
                        selectedCoin === coin ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'bg-white/5 border-white/5 text-[var(--text-muted)] hover:border-white/20'
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-muted)]">Estimated Stake</span>
                  <span className="text-white font-mono font-bold">{cryptoAmount} {selectedCoin}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                  <span className="text-[var(--text-muted)]">Daily Earning</span>
                  <span className="text-[var(--color-success)] font-bold">
                    {(Number(cryptoAmount) * Number(selectedPlan.roi_percentage) / 100).toFixed(selectedCoin === 'USDT' ? 2 : 8)} {selectedCoin}
                  </span>
                </div>
              </div>

              <div className="flex items-start p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 mb-4">
                <AlertCircle size={16} className="text-blue-400 mr-2 mt-0.5 shrink-0" />
                <p className="text-[10px] text-blue-300 leading-normal">
                  Your assets will be locked for {selectedPlan.duration_days} days. Daily returns will be automatically credited to your balance.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isInvesting || !investAmount || Number(investAmount) < Number(selectedPlan.minimum_amount)}
                className="btn-primary w-full shadow-lg shadow-[var(--accent-primary)]/20 disabled:opacity-50 disabled:grayscale"
              >
                {isInvesting ? 'Processing...' : 'Confirm Investment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
