'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowUpRight, Wallet, ShieldAlert, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useBalanceStore } from '@/store/balanceStore';

const withdrawSchema = z.object({
  coin: z.enum(['BTC', 'ETH', 'USDT']),
  amount: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Amount must be greater than 0'),
  wallet_address: z.string().min(10, 'Invalid wallet address'),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', color: 'from-[#F7931A] to-[#FFB04F]' },
  { symbol: 'ETH', name: 'Ethereum', color: 'from-[#627EEA] to-[#8A9FF0]' },
  { symbol: 'USDT', name: 'Tether (TRC20)', color: 'from-[#26A17B] to-[#34D3A1]' }
];

export default function WithdrawPage() {
  const router = useRouter();
  const { balances } = useBalanceStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { coin: 'BTC' }
  });

  const selectedCoin = watch('coin');
  const activeCoin = COINS.find(c => c.symbol === selectedCoin) || COINS[0];
  
  // Use exact match to avoid undefined, fallback to '0'
  const maxBalance = balances.find(b => b.coin === selectedCoin)?.balance || '0';

  const onSubmit = async (data: WithdrawForm) => {
    if (Number(data.amount) > Number(maxBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/payments/withdraw/', data);
      toast.success('Withdrawal request submitted successfully');
      router.push('/dashboard/transactions');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to submit withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-up pb-24 px-2 md:px-0">
      <div className="text-center relative pt-4 md:pt-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 bg-[var(--accent-secondary)]/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Withdraw Funds</h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-lg px-4">Transfer crypto to your external wallet securely</p>
      </div>

      <div className="relative z-10 rounded-3xl md:rounded-[2rem] bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        <div className="p-5 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:space-y-10">
            
            {/* Asset Selection */}
            <div>
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center text-[var(--accent-secondary)] shrink-0">
                  <Wallet size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Select Asset</h2>
                  <p className="text-xs md:text-sm text-[var(--text-secondary)]">Available balance: <span className="text-white font-mono">{maxBalance} {selectedCoin}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {COINS.map(c => (
                  <button
                    key={c.symbol}
                    type="button"
                    onClick={() => setValue('coin', c.symbol as any, { shouldValidate: true })}
                    className={`relative p-4 md:p-6 rounded-2xl border text-left flex flex-row sm:flex-col items-center sm:items-start sm:justify-center space-x-4 sm:space-x-0 sm:space-y-4 transition-all duration-300 group overflow-hidden ${
                      selectedCoin === c.symbol 
                        ? 'border-[var(--accent-secondary)] bg-gradient-to-br from-[var(--accent-secondary)]/10 to-transparent shadow-[inset_0_0_15px_var(--accent-secondary-dim)]' 
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div className={`absolute -right-6 -top-6 w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br ${c.color} opacity-20 rounded-full blur-[20px] group-hover:opacity-40 transition-opacity`} />
                    
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-lg text-white bg-gradient-to-br ${c.color} shadow-lg shrink-0 relative z-10`}>
                      {c.symbol === 'BTC' ? '₿' : c.symbol === 'ETH' ? 'Ξ' : '₮'}
                    </div>
                    <div className="flex-1 relative z-10">
                      <p className="font-bold text-base md:text-lg text-white">{c.symbol}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{c.name}</p>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center transition-colors relative z-10 ${
                      selectedCoin === c.symbol ? 'border-[var(--accent-secondary)]' : 'border-white/20'
                    }`}>
                      {selectedCoin === c.symbol && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-secondary)]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount & Address */}
            <div className="space-y-5 md:space-y-6">
              <div className="bg-[#080B14] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-end mb-3 md:mb-4">
                  <label className="block text-xs md:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Amount</label>
                  <button 
                    type="button" 
                    onClick={() => setValue('amount', maxBalance, { shouldValidate: true })}
                    className="text-[10px] md:text-xs px-2.5 py-1.5 md:px-3 rounded-lg bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/20 transition-colors font-medium flex items-center"
                  >
                    MAX: <span className="hidden sm:inline ml-1">{maxBalance}</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="any"
                    {...register('amount')}
                    className={`w-full bg-transparent border-b-2 ${errors.amount ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : 'border-white/10 hover:border-white/30 focus:border-[var(--accent-secondary)]'} py-3 md:py-4 pr-20 md:pr-24 text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white outline-none transition-colors`}
                    placeholder="0.00"
                  />
                  <div className="absolute right-0 flex items-center space-x-1.5 md:space-x-2 bg-white/5 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${activeCoin.color} flex items-center justify-center text-[10px] md:text-xs font-bold text-white`}>
                      {activeCoin.symbol === 'BTC' ? '₿' : activeCoin.symbol === 'ETH' ? 'Ξ' : '₮'}
                    </div>
                    <span className="font-bold text-white text-xs md:text-sm hidden sm:inline">{activeCoin.symbol}</span>
                  </div>
                </div>
                {errors.amount && (
                  <p className="flex items-center text-[var(--color-danger)] text-xs md:text-sm mt-2 md:mt-3">
                    <AlertCircle size={14} className="mr-1.5 shrink-0" />
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 md:mb-3">Destination Address</label>
                <div className="relative">
                  <input
                    {...register('wallet_address')}
                    className={`input w-full pl-10 md:pl-12 h-14 md:h-16 font-mono text-xs md:text-sm ${errors.wallet_address ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : ''}`}
                    placeholder={`Enter ${selectedCoin} address`}
                  />
                  <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Wallet size={18} className="md:w-5 md:h-5" />
                  </div>
                </div>
                {errors.wallet_address && (
                  <p className="flex items-center text-[var(--color-danger)] text-xs md:text-sm mt-2 md:mt-3">
                    <AlertCircle size={14} className="mr-1.5 shrink-0" />
                    {errors.wallet_address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-start space-x-3 md:space-x-4">
              <ShieldAlert size={20} className="text-[var(--color-warning)] shrink-0 mt-0.5 md:w-6 md:h-6" />
              <div>
                <h4 className="text-xs md:text-sm font-bold text-[var(--color-warning)] mb-1">Important Notice</h4>
                <p className="text-[11px] md:text-xs text-[var(--color-warning)]/80 leading-relaxed">
                  Please ensure you are using the correct network for {selectedCoin}. Sending to an incorrect network or address will result in permanent loss of funds. Withdrawals are processed immediately upon request.
                </p>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary bg-gradient-to-r from-[var(--accent-secondary)] to-[#1E40AF] shadow-[0_0_15px_var(--accent-secondary-dim)] md:shadow-[0_0_20px_var(--accent-secondary-dim)] hover:shadow-[0_0_30px_var(--accent-secondary-glow)] border-none w-full py-3.5 md:py-4 text-base md:text-lg group">
              {isLoading ? 'Processing...' : 'Submit Withdrawal'} 
              {!isLoading && <ArrowUpRight className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
