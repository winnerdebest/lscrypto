'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { Shield, Lock, Server, Fingerprint, Eye, Key } from 'lucide-react';
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
            <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full border border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)] text-sm font-bold tracking-widest uppercase mb-4">
              <Shield size={16} className="mr-2" /> Bank-Grade Protection
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
              SECURITY <span className="text-[var(--accent-primary)]">FIRST.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              We employ military-grade encryption, cold storage infrastructure, and real-time threat monitoring to ensure your assets are perpetually protected.
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
              { icon: Lock, title: 'Cold Storage Vaults', desc: '98% of all digital assets are held offline in air-gapped, multi-signature cold wallets geographically distributed across secure facilities.' },
              { icon: Fingerprint, title: 'Biometric Access', desc: 'Rigorous identity verification requiring biometric authentication for all high-value withdrawals and account modifications.' },
              { icon: Server, title: 'DDoS Protection', desc: 'Enterprise-grade edge networking protects our infrastructure from the largest volumetric DDoS attacks and sophisticated intrusions.' },
              { icon: Key, title: 'Multi-Factor Auth', desc: 'Mandatory hardware-backed MFA (YubiKey support) or authenticator app integration ensures only you control your account.' },
              { icon: Eye, title: 'Real-Time Monitoring', desc: 'Our AI-driven security fabric analyzes billions of data points per second to detect and neutralize anomalous behavior instantly.' },
              { icon: Shield, title: 'SIPC & FDIC Insured', desc: 'Fiat balances are held in FDIC-insured partner banks, and digital assets are covered by our comprehensive $500M insurance policy.' },
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
