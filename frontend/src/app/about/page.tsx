'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { Shield, Globe, Users, Trophy, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
              BEYOND <span className="text-[var(--accent-primary)]">BANKING.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              Founded in 2021, CryptoVault was built on a single premise: that everyone deserves institutional-grade wealth tools.
            </p>
          </div>

          {/* Vision Section */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="space-y-8">
              <h2 className="text-4xl font-heading font-bold">The Vision of Alexander Thorne</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                "We didn't start CryptoVault to create another trading app. We started it to solve a systemic problem: the widening gap between institutional efficiency and individual opportunity."
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Under the leadership of Alexander Thorne, a veteran of quantitative hedge funds, we've developed proprietary algorithms that once belonged only to the elite. Today, these tools power the portfolios of over 100,000 users worldwide.
              </p>
              <div className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[2px] bg-[var(--accent-primary)]"></div>
                  <span className="font-bold text-white uppercase tracking-widest text-sm">Our CEO's Commitment</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--gradient-brand)] opacity-20 blur-[100px]"></div>
              <div className="glass-card overflow-hidden rounded-[40px] relative">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop" 
                  alt="Boardroom" 
                  className="w-full aspect-[4/5] object-cover grayscale opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-32">
            <h2 className="text-3xl font-heading font-bold text-center mb-16 underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">Our Core Principles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: 'Uncompromising Security', desc: 'Security is not a feature; it is our foundation. We employ triple-layer encryption and physical cold storage.' },
                { icon: Globe, title: 'Global Inclusion', desc: 'Wealth shouldn\'t have borders. Our platform is accessible in over 140 countries with no minimum friction.' },
                { icon: Target, title: 'Radical Transparency', desc: 'Every distribution, fee, and investment plan is logged on our private blockchain for user verification.' },
              ].map((value, i) => (
                <div key={i} className="glass-card p-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary-dim)]/10 text-[var(--accent-primary)] flex items-center justify-center">
                    <value.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">{value.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section Placeholder */}
          <div className="glass-card p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-secondary)] rounded-full blur-[120px] opacity-10"></div>
             <h2 className="text-4xl font-heading font-bold relative z-10">Join the Future of Wealth</h2>
             <p className="text-[var(--text-secondary)] max-w-2xl mx-auto relative z-10">We are a team of 150+ engineers, analysts, and designers dedicated to building the bridge to the digital economy.</p>
             <div className="flex justify-center relative z-10">
                <button className="btn-primary px-10 py-4">View Careers</button>
             </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
