'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ArrowRight, QrCode, ArrowLeft, ShieldCheck, Zap, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', color: 'from-[#F7931A] to-[#FFB04F]' },
  { symbol: 'ETH', name: 'Ethereum', color: 'from-[#627EEA] to-[#8A9FF0]' },
  { symbol: 'USDT', name: 'Tether (TRC20)', color: 'from-[#26A17B] to-[#34D3A1]' }
];

export default function DepositPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [depositData, setDepositData] = useState<any>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleCreateDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post('/api/payments/deposit/', {
        coin: selectedCoin,
        amount: Number(amount),
      });
      setDepositData(res.data);
      handleNext();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to create deposit');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const activeCoin = COINS.find(c => c.symbol === selectedCoin) || COINS[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-up pb-24 px-2 md:px-0">
      <div className="text-center relative pt-4 md:pt-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 bg-[var(--accent-primary)]/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Fund Your Account</h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-lg px-4">Securely deposit crypto to start your investment journey</p>
      </div>

      {/* Progress Tracker */}
      <div className="flex justify-center items-center mb-8 md:mb-12 relative z-10">
        {[
          { num: 1, label: 'Asset' },
          { num: 2, label: 'Amount' },
          { num: 3, label: 'Payment' }
        ].map((item, i) => (
          <div key={item.num} className="flex items-center">
            <div className="flex flex-col items-center relative">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-500 relative z-10 ${
                step === item.num 
                  ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[#080B14] shadow-[0_0_15px_var(--accent-primary-glow)] md:shadow-[0_0_20px_var(--accent-primary-glow)] scale-110' 
                  : step > item.num 
                    ? 'bg-[var(--color-success)]/20 border border-[var(--color-success)]/50 text-[var(--color-success)]' 
                    : 'bg-white/5 border border-white/10 text-[var(--text-muted)]'
              }`}>
                {step > item.num ? <Check size={16} strokeWidth={3} /> : item.num}
              </div>
              <span className={`absolute -bottom-5 md:-bottom-6 text-[10px] md:text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                step >= item.num ? 'text-white' : 'text-[var(--text-muted)]'
              }`}>
                {item.label}
              </span>
            </div>
            {i < 2 && (
              <div className="w-10 sm:w-16 md:w-32 h-1 mx-2 md:mx-4 rounded-full bg-white/5 relative overflow-hidden">
                <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-700 ease-in-out ${
                  step > item.num ? 'w-full' : 'w-0'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 rounded-3xl md:rounded-[2rem] bg-[#0A0F1C]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] mt-4 md:mt-0">
        
        <div className="p-5 sm:p-8 md:p-10">
          {step === 1 && (
            <div className="space-y-6 md:space-y-8 animate-fade-up">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                  <Wallet size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Select Asset</h2>
                  <p className="text-xs md:text-sm text-[var(--text-secondary)]">Choose the cryptocurrency you want to deposit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {COINS.map(c => (
                  <button
                    key={c.symbol}
                    onClick={() => setSelectedCoin(c.symbol)}
                    className={`relative p-4 md:p-6 rounded-2xl border text-left flex flex-row sm:flex-col items-center sm:items-start sm:justify-center space-x-4 sm:space-x-0 sm:space-y-4 transition-all duration-300 group overflow-hidden ${
                      selectedCoin === c.symbol 
                        ? 'border-[var(--accent-primary)] bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent shadow-[inset_0_0_15px_var(--accent-primary-dim)]' 
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
                      selectedCoin === c.symbol ? 'border-[var(--accent-primary)]' : 'border-white/20'
                    }`}>
                      {selectedCoin === c.symbol && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />}
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={handleNext} className="btn-primary w-full py-3.5 md:py-4 text-base md:text-lg mt-6 md:mt-8 group">
                Continue to Amount <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 md:space-y-8 animate-fade-up">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors shrink-0">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Enter Amount</h2>
                  <p className="text-xs md:text-sm text-[var(--text-secondary)]">Specify the USD value you wish to deposit</p>
                </div>
              </div>

              <div className="bg-[#080B14] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 shadow-inner">
                <label className="block text-xs md:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 md:mb-4">Amount to deposit (USD)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 md:left-6 text-xl md:text-2xl font-bold text-white/50">$</span>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-white/10 hover:border-white/30 focus:border-[var(--accent-primary)] pl-8 md:pl-12 pr-20 md:pr-24 py-3 md:py-4 text-3xl md:text-6xl font-heading font-bold text-white outline-none transition-colors"
                    placeholder="0.00"
                  />
                  <div className="absolute right-0 md:right-6 flex items-center space-x-1.5 md:space-x-2 bg-white/5 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${activeCoin.color} flex items-center justify-center text-[10px] md:text-xs font-bold text-white`}>
                      {activeCoin.symbol === 'BTC' ? '₿' : activeCoin.symbol === 'ETH' ? 'Ξ' : '₮'}
                    </div>
                    <span className="font-bold text-white text-xs md:text-sm hidden sm:inline">{activeCoin.symbol}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 md:px-2 text-xs md:text-sm">
                <div className="flex items-center text-[var(--text-secondary)]">
                  <ShieldCheck size={16} className="mr-2 text-[var(--color-success)] shrink-0" />
                  Secure SSL Encryption
                </div>
                <div className="flex items-center text-[var(--text-secondary)]">
                  <Zap size={16} className="mr-2 text-[var(--accent-secondary)] shrink-0" />
                  Instant processing
                </div>
              </div>

              <button onClick={handleCreateDeposit} disabled={isLoading} className="btn-primary w-full py-3.5 md:py-4 text-base md:text-lg group mt-6">
                {isLoading ? 'Generating Address...' : `Confirm Deposit`}
                {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          )}

          {step === 3 && depositData && (
            <div className="space-y-6 md:space-y-8 text-center animate-fade-up">
              {!paymentConfirmed ? (
                <>
                  <div className="relative inline-block mt-2 md:mt-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl md:rounded-3xl blur-[15px] md:blur-[20px] opacity-30 animate-pulse-slow" />
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-[#080B14] rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center relative z-10 text-[var(--accent-primary)]">
                      <QrCode size={40} strokeWidth={1.5} className="md:w-12 md:h-12" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">Send Payment</h2>
                    <p className="text-sm md:text-base text-[var(--text-secondary)]">
                      Send exactly the amount below to the designated address
                    </p>
                  </div>
                  
                  <div className="bg-[#080B14] rounded-2xl md:rounded-3xl border border-white/5 p-5 md:p-8 space-y-5 md:space-y-6">
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Amount Required</p>
                      <div className="flex flex-wrap items-center justify-center gap-2 md:space-x-3">
                        <span className="text-3xl md:text-4xl font-heading font-extrabold text-white break-all">{depositData.pay_amount}</span>
                        <span className="text-lg md:text-xl font-bold text-[var(--text-secondary)]">{depositData.pay_currency.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-white/5" />

                    <div className="text-left space-y-2">
                      <p className="text-xs md:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Deposit Address</p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 p-3 md:p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors group gap-3 sm:gap-0">
                        <p className="font-mono text-xs md:text-sm text-white break-all pr-0 sm:pr-4">{depositData.pay_address}</p>
                        <button 
                          onClick={() => copyToClipboard(depositData.pay_address)} 
                          className="w-full sm:w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[#080B14] transition-colors shrink-0"
                        >
                          <Copy size={18} className="mr-2 sm:mr-0" />
                          <span className="sm:hidden font-medium text-sm">Copy Address</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 p-4 md:p-5 rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--accent-secondary)]/20 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[var(--accent-secondary)] animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs md:text-sm mb-1">Awaiting Network Confirmation</p>
                      <p className="text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed">
                        We're actively monitoring the blockchain. Your funds will be credited automatically once confirmed.
                      </p>
                    </div>
                  </div>

                  <button onClick={() => setPaymentConfirmed(true)} className="btn-primary w-full py-4 text-lg mt-4">
                    I have sent the payment
                  </button>
                  <button onClick={() => router.push('/dashboard')} className="btn-ghost w-full py-2 text-sm text-[var(--text-muted)]">
                    Cancel and return
                  </button>
                </>
              ) : (
                <div className="py-12 space-y-8 animate-fade-up">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--color-success)]/10 rounded-full border border-[var(--color-success)]/30 flex items-center justify-center mx-auto text-[var(--color-success)]">
                    <Check size={48} strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-white mb-4">Deposit Submitted!</h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto">
                      Your transaction has been logged as <span className="text-white font-bold uppercase">Pending</span>. 
                      Our team will verify the payment and credit your account shortly.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-8">
                    <button onClick={() => router.push('/dashboard')} className="btn-ghost py-4 border border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-2xl">
                      Dashboard
                    </button>
                    <button onClick={() => router.push('/dashboard/transactions')} className="btn-primary py-4 rounded-2xl">
                      View History
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
