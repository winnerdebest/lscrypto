'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { Shield, Globe, Users, Trophy, Target, Heart, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
              ALGORITHMIC <span className="text-[var(--accent-primary)]">SUPREMACY.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              Inc. was built on a single premise: that advanced AI and machine learning models shouldn't just belong to Wall Street hedge funds. We are democratizing algorithmic trading.
            </p>
          </div>

          {/* Vision Section */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="space-y-8">
              <h2 className="text-4xl font-heading font-bold">The Vision</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                "We didn't start Inc. to create another crypto exchange. We started it to build the ultimate autonomous wealth creation engine."
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                By harnessing real-time social sentiment data, on-chain metrics, and deep neural networks, our bots execute trades in milliseconds. We find the narrative before it trends, and we take profit before the crowd arrives.
              </p>
              <div className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[2px] bg-[var(--accent-primary)]"></div>
                  <span className="font-bold text-white uppercase tracking-widest text-sm">Our Commitment</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--gradient-brand)] opacity-20 blur-[100px]"></div>
              <div className="glass-card overflow-hidden rounded-[40px] relative border border-[var(--accent-primary)]/20 shadow-[0_0_50px_var(--accent-primary-dim)]">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f4ecb99?q=80&w=1000&auto=format&fit=crop" 
                  alt="AI Core" 
                  className="w-full aspect-[4/5] object-cover grayscale opacity-80 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-32">
            <h2 className="text-3xl font-heading font-bold text-center mb-16 underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">Engine Principles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Cpu, title: 'Neural Execution', desc: 'Our bots process 10,000+ data points per second, executing trades with sub-2ms latency.' },
                { icon: Shield, title: 'Risk-Managed', desc: 'Hard-coded stop losses and dynamic portfolio rebalancing ensures your capital is protected against extreme volatility.' },
                { icon: Target, title: 'Sentiment Arbitrage', desc: 'We scrape Twitter, Reddit, and Telegram in real-time to snipe memecoins the exact moment velocity spikes.' },
              ].map((value, i) => (
                <div key={i} className="glass-card p-10 space-y-6 hover:border-[var(--accent-primary)] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary-dim)]/10 text-[var(--accent-primary)] flex items-center justify-center">
                    <value.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">{value.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
