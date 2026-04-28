'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, RefreshCw, AlertCircle, ChevronDown, Wallet, Check } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

const COINS = [
  { id: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { id: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  { id: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B' },
];

type Coin = typeof COINS[0];

function CoinDropdown({
  selected,
  onSelect,
  exclude,
  label,
  balances,
}: {
  selected: Coin;
  onSelect: (c: Coin) => void;
  exclude: string;
  label: string;
  balances: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = COINS.filter(c => c.id !== exclude);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors border border-white/10 min-w-[110px]"
      >
        <span className="text-lg font-bold" style={{ color: selected.color }}>{selected.icon}</span>
        <span className="font-bold text-white text-sm flex-1 text-left">{selected.id}</span>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#0F1422] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold px-4 pt-3 pb-1">{label}</p>
            {options.map(coin => {
              const bal = Number(balances[coin.id] || 0);
              return (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => { onSelect(coin); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-lg" style={{ color: coin.color }}>{coin.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{coin.id}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      Balance: {bal > 0 ? bal.toFixed(6) : '0.000000'}
                    </p>
                  </div>
                  {coin.id === selected.id && <Check size={14} className="text-[var(--accent-primary)] flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SwapPage() {
  const [fromCoin, setFromCoin] = useState(COINS[0]);
  const [toCoin, setToCoin] = useState(COINS[2]);
  const [amount, setAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const { prices } = useCryptoPrices();

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const res = await api.get('/api/dashboard/summary/');
      const balanceMap: Record<string, string> = {};
      res.data.balances.forEach((b: any) => {
        balanceMap[b.coin] = b.balance;
      });
      setBalances(balanceMap);
    } catch (err) {
      console.error('Failed to fetch balances');
    }
  };

  const handleFlipCoins = () => {
    const prev = fromCoin;
    setFromCoin(toCoin);
    setToCoin(prev);
    setAmount('');
  };

  // Guard: if user selects same coin in both sides, auto-switch the other
  const handleFromSelect = (coin: Coin) => {
    if (coin.id === toCoin.id) setToCoin(fromCoin);
    setFromCoin(coin);
    setAmount('');
  };

  const handleToSelect = (coin: Coin) => {
    if (coin.id === fromCoin.id) setFromCoin(toCoin);
    setToCoin(coin);
  };

  const fromPrice = prices[fromCoin.id]?.price || 0;
  const toPrice = prices[toCoin.id]?.price || 0;
  const exchangeRate = fromPrice && toPrice ? (fromPrice / toPrice).toFixed(8) : '—';
  const estimatedReceived = amount && fromPrice && toPrice
    ? (Number(amount) * (fromPrice / toPrice)).toFixed(8)
    : '0.00';
  const currentBalance = balances[fromCoin.id] || '0.00000000';

  const handleSetMax = () => setAmount(Number(currentBalance).toFixed(8));

  const handleSwapExecute = async () => {
    if (!amount || Number(amount) <= 0) return toast.error('Please enter an amount');
    if (Number(amount) > Number(currentBalance)) return toast.error('Insufficient balance');
    if (fromCoin.id === toCoin.id) return toast.error('Cannot swap same coin');

    setIsSwapping(true);
    try {
      const res = await api.post('/api/payments/swap/', {
        from_coin: fromCoin.id,
        to_coin: toCoin.id,
        amount: Number(amount),
      });
      toast.success(res.data.detail || `Swapped ${amount} ${fromCoin.id} → ${toCoin.id}`);
      setAmount('');
      fetchBalances();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const usdValue = fromPrice ? (Number(amount || 0) * fromPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null;

  return (
    <div className="max-w-xl mx-auto py-4 px-4 sm:px-0 min-h-[calc(100vh-120px)] flex flex-col justify-center gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Swap Assets</h1>
        <p className="text-[var(--text-muted)] text-sm">Instant crypto-to-crypto exchange at live market rates</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-3 relative overflow-hidden">
        {/* background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--accent-primary)]/5 blur-3xl pointer-events-none" />

        {/* FROM */}
        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">
            <span>You Pay</span>
            <div className="flex items-center gap-2 text-[var(--accent-primary)]">
              <Wallet size={11} />
              <span>{Number(currentBalance).toFixed(6)} {fromCoin.id}</span>
              <button
                type="button"
                onClick={handleSetMax}
                className="text-[9px] bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/40 text-[var(--accent-primary)] px-1.5 py-0.5 rounded font-bold transition-colors uppercase tracking-wider"
              >
                Max
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="bg-transparent text-3xl font-heading font-bold text-white outline-none w-full placeholder-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {usdValue && Number(amount) > 0 && (
                <p className="text-xs text-[var(--text-muted)] mt-1">≈ {usdValue}</p>
              )}
            </div>
            <CoinDropdown
              selected={fromCoin}
              onSelect={handleFromSelect}
              exclude={toCoin.id}
              label="Swap from"
              balances={balances}
            />
          </div>
        </div>

        {/* FLIP BUTTON */}
        <div className="relative h-4 flex items-center justify-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFlipCoins}
            className="absolute z-20 bg-[var(--accent-primary)] text-black p-2.5 rounded-xl shadow-lg border-4 border-[#080B14] hover:bg-white transition-colors"
          >
            <ArrowDownUp size={20} />
          </motion.button>
          <div className="w-full h-px bg-white/10" />
        </div>

        {/* TO */}
        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">
            <span>You Receive</span>
            <div className="flex items-center gap-2">
              <Wallet size={11} />
              <span>{Number(balances[toCoin.id] || 0).toFixed(6)} {toCoin.id}</span>
            </div>
          </div>
          <div className="text-[10px] text-right text-[var(--text-muted)] -mt-2">
            Rate: 1 {fromCoin.id} = {exchangeRate} {toCoin.id}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-3xl font-heading font-bold text-white/40 truncate">
                {estimatedReceived}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {toPrice ? (Number(estimatedReceived) * toPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '—'}
              </p>
            </div>
            <CoinDropdown
              selected={toCoin}
              onSelect={handleToSelect}
              exclude={fromCoin.id}
              label="Swap to"
              balances={balances}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="button"
          disabled={isSwapping || !amount || Number(amount) <= 0 || fromCoin.id === toCoin.id}
          onClick={handleSwapExecute}
          className="w-full bg-[var(--accent-primary)] hover:bg-white text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed text-base mt-2 shadow-[0_0_30px_rgba(0,255,148,0.2)]"
        >
          <RefreshCw size={20} className={isSwapping ? 'animate-spin' : ''} />
          {isSwapping ? 'Swapping...' : `Swap ${fromCoin.id} → ${toCoin.id}`}
        </button>
      </div>

      {/* INFO */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3 items-start">
        <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-blue-100/70 leading-relaxed">
          Rates are fetched live from CoinGecko. Swaps settle instantly with no additional fees.
        </p>
      </div>
    </div>
  );
}
