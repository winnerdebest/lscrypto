'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { Shield, Lock, Server, Fingerprint, Eye, Key, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityPage() {
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeUpVariant: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", duration: 1.2 } }
  };

  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-24 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_var(--accent-primary-dim)]">
              <Shield size={16} className="mr-2" /> System Integrity
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
              FORTIFIED <span className="text-[var(--accent-primary)]">ALGORITHMS.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              Our AI engine operates within an air-gapped security perimeter. Your deposited funds remain in cold storage while the engine trades with deep liquidity pools via secured API keys.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
          >
            {[
              { icon: Lock, title: 'Cold Storage Vaults', desc: '98% of user capital is held offline in multi-signature cold wallets. The AI only accesses necessary liquidity.' },
              { icon: Cpu, title: 'Hard-Coded Risk', desc: 'The trading engine is bound by immutable smart contracts that enforce strict stop-losses and prevent catastrophic drawdown.' },
              { icon: Server, title: 'API Security', desc: 'We execute trades using highly restricted API keys that only permit trading, with withdrawal permissions strictly disabled.' },
              { icon: Key, title: 'Multi-Factor Auth', desc: 'Mandatory hardware-backed MFA ensures only you can configure your bot deployments or withdraw funds.' },
              { icon: Eye, title: 'Real-Time Monitoring', desc: 'Our security fabric analyzes billions of data points per second to detect and neutralize anomalous API behavior instantly.' },
              { icon: Shield, title: 'Audited Code', desc: 'Our algorithmic execution engine undergoes monthly penetration testing and code audits by leading blockchain security firms.' },
            ].map((feature, i) => (
               <motion.div variants={fadeUpVariant} key={i} className="glass-card p-10 hover:border-[var(--accent-primary)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary-dim)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </MarketingLayout>
  );
}
