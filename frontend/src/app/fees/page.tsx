'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeesPage() {
  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24 space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
              WE ONLY WIN WHEN <span className="text-[var(--accent-secondary)]">YOU WIN.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
              Inc. operates entirely on a performance-fee model. You pay absolutely nothing to deposit, hold, or withdraw. We only take a cut of the profits our AI generates for you.
            </p>
          </motion.div>

          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden border border-[var(--accent-primary)]/20 shadow-[0_0_30px_var(--accent-primary-dim)]"
            >
              <div className="p-8 border-b border-[var(--accent-primary)]/20 bg-[#050A10]">
                <h2 className="text-2xl font-bold text-[var(--accent-primary)]">AI Performance Fee</h2>
                <p className="text-[var(--text-secondary)] mt-2">Automatically deducted from generated profits only.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-[var(--border-glass)]">
                  <div>
                    <h3 className="font-bold text-lg">Profit Share</h3>
                    <p className="text-sm text-[var(--text-muted)]">Applied only to net positive trades</p>
                  </div>
                  <span className="text-2xl font-mono font-bold text-[var(--accent-secondary)]">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Losing Trades</h3>
                    <p className="text-sm text-[var(--text-muted)]">If the bot loses money, we take nothing</p>
                  </div>
                  <span className="text-2xl font-mono font-bold text-[var(--text-muted)]">0%</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden"
            >
              <div className="p-8 border-b border-[var(--border-glass)] bg-white/[0.02]">
                <h2 className="text-2xl font-bold">Deposits & Withdrawals</h2>
                <p className="text-[var(--text-secondary)] mt-2">Standard network fees apply for crypto transfers.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-[var(--border-glass)]">
                  <div>
                    <h3 className="font-bold text-lg">Crypto Deposits</h3>
                    <p className="text-sm text-[var(--text-muted)]">BTC, ETH, USDT, SOL</p>
                  </div>
                  <span className="text-lg font-bold text-[var(--color-success)] flex items-center"><CheckCircle2 size={18} className="mr-2" /> Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Crypto Withdrawals</h3>
                    <p className="text-sm text-[var(--text-muted)]">Dynamic network fee</p>
                  </div>
                  <span className="text-lg font-bold text-white">Network Cost</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
