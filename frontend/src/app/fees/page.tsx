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
              TRANSPARENT <span className="text-[var(--accent-secondary)]">FEES.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
              No hidden charges, no surprise spreads. We succeed when you succeed. Our fee structure is simple, competitive, and designed for maximum yield.
            </p>
          </motion.div>

          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden"
            >
              <div className="p-8 border-b border-[var(--border-glass)] bg-white/[0.02]">
                <h2 className="text-2xl font-bold">Trading & Conversion</h2>
                <p className="text-[var(--text-secondary)] mt-2">Applied instantly at execution.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-[var(--border-glass)]">
                  <div>
                    <h3 className="font-bold text-lg">Maker Fee</h3>
                    <p className="text-sm text-[var(--text-muted)]">When you provide liquidity</p>
                  </div>
                  <span className="text-2xl font-mono font-bold">0.02%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Taker Fee</h3>
                    <p className="text-sm text-[var(--text-muted)]">When you execute immediately</p>
                  </div>
                  <span className="text-2xl font-mono font-bold">0.04%</span>
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
                <p className="text-[var(--text-secondary)] mt-2">Network fees apply for crypto transfers.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-[var(--border-glass)]">
                  <div>
                    <h3 className="font-bold text-lg">Crypto Deposits</h3>
                    <p className="text-sm text-[var(--text-muted)]">BTC, ETH, USDT</p>
                  </div>
                  <span className="text-lg font-bold text-green-400 flex items-center"><CheckCircle2 size={18} className="mr-2" /> Free</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-[var(--border-glass)]">
                  <div>
                    <h3 className="font-bold text-lg">Bank Wire Deposits</h3>
                    <p className="text-sm text-[var(--text-muted)]">USD, EUR, GBP</p>
                  </div>
                  <span className="text-lg font-bold text-green-400 flex items-center"><CheckCircle2 size={18} className="mr-2" /> Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Crypto Withdrawals</h3>
                    <p className="text-sm text-[var(--text-muted)]">Dynamic network fee</p>
                  </div>
                  <span className="text-lg font-bold">Network Cost</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
