'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Coins, 
  CheckCircle2, 
  Globe, 
  Lock, 
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import MarketingLayout from '@/components/layout/MarketingLayout';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const { prices } = useCryptoPrices();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
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
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", duration: 1.2 } }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Glow Effects - Parallax */}
        <motion.div 
          style={{ y: yBg }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)] rounded-full blur-[160px] opacity-[0.07] pointer-events-none"
        />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-10"
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[var(--accent-primary-dim)] bg-[var(--accent-primary-dim)]/10 text-[var(--accent-primary)] text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
              </span>
              <span>Next-Gen Asset Management</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-6xl md:text-8xl font-heading font-bold tracking-tighter leading-[0.9]">
              INVEST IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">CRYPTO 3.0</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed">
              Automated high-yield portfolio management designed for institutional safety and individual growth. Join 100k+ investors multiplying their assets daily.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/auth/register" className="btn-primary w-full sm:w-auto text-lg px-10 py-6 overflow-hidden relative group">
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative flex items-center">Open Account <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} /></span>
              </Link>
              <Link href="#plans" className="btn-ghost w-full sm:w-auto text-lg px-10 py-6 border border-[var(--border-glass)] hover:bg-white/5">
                View Plans
              </Link>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex items-center space-x-8 pt-8">
              <div className="hover:scale-105 transition-transform">
                <p className="text-2xl font-mono font-bold text-white">$4.2B+</p>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">AUM</p>
              </div>
              <div className="w-px h-10 bg-[var(--border-glass)]"></div>
              <div className="hover:scale-105 transition-transform">
                <p className="text-2xl font-mono font-bold text-white">0.02%</p>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Lowest Fees</p>
              </div>
              <div className="w-px h-10 bg-[var(--border-glass)]"></div>
              <div className="hover:scale-105 transition-transform">
                <p className="text-2xl font-mono font-bold text-white">99.9%</p>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Uptime</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Card Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ type: "spring", duration: 1.5, delay: 0.4 }}
            className="relative group"
          >
            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="relative"
            >
              <div className="absolute inset-0 bg-[var(--gradient-brand)] opacity-20 blur-[100px] group-hover:opacity-40 transition-opacity duration-1000"></div>
              <div className="relative glass-card border-[var(--border-glass)] p-4 group-hover:rotate-0 transition-transform duration-700 backdrop-blur-2xl">
                <div className="bg-[#080B14]/90 rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest">Live Performance</span>
                    <div className="flex space-x-1">
                      <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-red-500"></motion.div>
                      <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-yellow-500"></motion.div>
                      <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-2 h-2 rounded-full bg-green-500"></motion.div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {['BTC', 'ETH', 'USDT'].map((sym, idx) => (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + (idx * 0.2) }}
                        key={sym} 
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--accent-primary-dim)]/20 flex items-center justify-center font-bold text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
                            {sym[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white">{sym}</p>
                            <p className="text-xs text-[var(--text-muted)]">Live Network</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-white">
                            ${prices[sym]?.price.toLocaleString() || '---'}
                          </p>
                          <p className={`text-xs ${prices[sym]?.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {prices[sym]?.change24h > 0 ? '+' : ''}{prices[sym]?.change24h?.toFixed(2) || '0.00'}%
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-muted)]">Vault Status</span>
                      <span className="text-green-400 flex items-center">
                        <CheckCircle2 size={14} className="mr-1" /> Encrypted & Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-[var(--border-glass)] bg-[#080B14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <p className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">Trusted by global industry leaders</p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative flex overflow-hidden w-full group">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 w-24 md:w-64 h-full bg-gradient-to-r from-[#080B14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-24 md:w-64 h-full bg-gradient-to-l from-[#080B14] to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex items-center space-x-16 md:space-x-32 min-w-max px-8 group-hover:[animation-play-state:paused]"
          >
            {[
              { name: 'Coinbase', url: 'https://cdn.simpleicons.org/coinbase/white' },
              { name: 'Binance', url: 'https://cdn.simpleicons.org/binance/white' },
              { name: 'Revolut', url: 'https://cdn.simpleicons.org/revolut/white' },
              // Duplicate set 1 for seamless loop
              { name: 'Coinbase', url: 'https://cdn.simpleicons.org/coinbase/white' },
              { name: 'Binance', url: 'https://cdn.simpleicons.org/binance/white' },
              { name: 'Revolut', url: 'https://cdn.simpleicons.org/revolut/white' },
              // Duplicate set 2 for seamless loop
              { name: 'Coinbase', url: 'https://cdn.simpleicons.org/coinbase/white' },
              { name: 'Binance', url: 'https://cdn.simpleicons.org/binance/white' },
              { name: 'Revolut', url: 'https://cdn.simpleicons.org/revolut/white' }
            ].map((brand, i) => (
              <div key={i} className="flex items-center space-x-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                <img src={brand.url} alt={brand.name} className="h-6 md:h-8 w-auto object-contain" />
                <span className="text-lg md:text-2xl font-black font-heading text-white tracking-tighter">{brand.name.toUpperCase()}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-2xl mb-20"
          >
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">Built for the <br/> <span className="text-[var(--accent-primary)]">Digital Economy</span></motion.h2>
            <motion.p variants={fadeUpVariant} className="text-[var(--text-secondary)] text-lg">We've eliminated the complexity of DeFi. Secure your future with institutional-grade tools and simplified user experience.</motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: Lock, 
                title: 'Multi-Sig Security', 
                desc: 'Your assets are held in segregated multi-signature cold wallets, requiring multiple approvals for any movement.' 
              },
              { 
                icon: Zap, 
                title: 'Instant Execution', 
                desc: 'Our proprietary engine executes trades and distributions at sub-millisecond speeds across global liquidity pools.' 
              },
              { 
                icon: BarChart3, 
                title: 'Yield Optimization', 
                desc: 'AI-driven rebalancing ensures your capital is always allocated to the highest performing risk-adjusted pools.' 
              }
            ].map((feature, i) => (
              <motion.div variants={fadeUpVariant} key={i} className="glass-card p-10 group hover:border-[var(--accent-primary)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary-dim)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-32 px-6 bg-[#0A0D18] relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-[0.02] pointer-events-none"></div>
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">Tailored Growth Strategies</h2>
            <p className="text-[var(--text-secondary)] text-lg">Choose the tier that matches your investment goals. Scale your wealth with automated compound interest.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8 items-center"
          >
            {[
              { 
                name: 'Starter Tier', 
                roi: '1.2%', 
                duration: '30 Days', 
                min: '$100',
                features: ['Daily Distributions', 'Email Alerts', 'Standard Support']
              },
              { 
                name: 'Professional', 
                roi: '2.8%', 
                duration: '60 Days', 
                min: '$2,500', 
                popular: true,
                features: ['Priority Execution', 'Portfolio Manager', 'Advanced Analytics', 'SMS Alerts']
              },
              { 
                name: 'Institutional', 
                roi: '4.5%', 
                duration: '90 Days', 
                min: '$25,000',
                features: ['Custom API Access', '24/7 Concierge', 'Tax Optimization', 'Insurance Coverage']
              },
            ].map((plan, i) => (
              <motion.div 
                variants={fadeUpVariant}
                key={i} 
                className={`relative flex flex-col p-1 rounded-3xl overflow-hidden transition-transform duration-500 hover:-translate-y-4 ${plan.popular ? 'bg-[var(--gradient-brand)] shadow-[0_0_50px_rgba(30,58,138,0.3)] z-10 lg:scale-105' : 'bg-[var(--border-glass)]'}`}
              >
                <div className="bg-[#080B14] rounded-[22px] p-8 md:p-10 flex-1 flex flex-col h-full">
                  {plan.popular && <span className="self-start px-3 py-1 bg-[var(--accent-primary)] text-[#080B14] text-[10px] font-black uppercase tracking-widest rounded-full mb-6 shadow-[0_0_15px_var(--accent-primary-glow)]">Elite Choice</span>}
                  <h3 className="text-xl font-medium text-[var(--text-secondary)] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-6xl font-mono font-bold text-white tracking-tighter">{plan.roi}</span>
                    <span className="ml-2 text-[var(--text-muted)] font-medium">/ DAILY</span>
                  </div>
                  
                  <div className="space-y-4 mb-10 border-y border-[var(--border-glass)] py-8">
                    <div className="flex justify-between text-sm group cursor-pointer">
                      <span className="text-[var(--text-muted)] group-hover:text-white transition-colors">Minimum Entry</span>
                      <span className="text-white font-mono font-bold">{plan.min}</span>
                    </div>
                    <div className="flex justify-between text-sm group cursor-pointer">
                      <span className="text-[var(--text-muted)] group-hover:text-white transition-colors">Lock-up Period</span>
                      <span className="text-white font-medium">{plan.duration}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center text-sm text-[var(--text-secondary)]">
                        <CheckCircle2 size={16} className="text-[var(--accent-primary)] mr-3 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/register" className={`group flex items-center justify-center w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-[var(--accent-primary)] text-[#080B14] hover:shadow-[0_0_20px_var(--accent-primary-glow)]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                    Select Tier <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CEO / Testimonial Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-card p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)] rounded-full blur-[150px] opacity-10 -mr-48 -mt-48 group-hover:opacity-20 transition-opacity duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-secondary)] rounded-full blur-[150px] opacity-10 -ml-48 -mb-48 group-hover:opacity-20 transition-opacity duration-1000"></div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="lg:w-1/3 relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-[var(--border-glass)] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" 
                  alt="CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card p-5 rounded-2xl shadow-xl backdrop-blur-3xl border border-[var(--border-strong)]">
                <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-1">Founder & CEO</p>
                <p className="text-xl font-heading font-bold text-white">Alexander Thorne</p>
              </div>
            </motion.div>

            <div className="lg:w-2/3 space-y-8 relative z-10">
              <span className="text-7xl font-serif text-[var(--accent-primary)] opacity-20 absolute -top-10 -left-6">"</span>
              <h2 className="text-3xl md:text-5xl font-heading font-medium leading-tight italic relative z-10">
                Our mission is to democratize institutional wealth tools. We didn't just build a platform; we built a bridge to financial sovereignty for every digital citizen.
              </h2>
              <div className="flex items-center space-x-6">
                <div className="w-16 h-[2px] bg-[var(--gradient-brand)]"></div>
                <p className="text-[var(--text-secondary)] font-medium tracking-wide">Built on transparency, math, and decentralization.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--gradient-bg)] rounded-full blur-[150px] opacity-30 pointer-events-none"
        ></motion.div>
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1.5 }}
            className="text-6xl md:text-8xl font-heading font-bold tracking-tighter"
          >
            READY TO <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">EVOLVE?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            Takes less than 2 minutes to open your vault and start your journey towards automated financial growth.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <Link href="/auth/register" className="btn-primary text-xl px-12 py-6 group hover:shadow-[0_0_40px_var(--accent-primary-glow)]">
              Join the Elite <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={24} />
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-[var(--text-muted)]"
          >
            <span className="flex items-center"><CheckCircle2 size={18} className="mr-2 text-[var(--accent-primary)]" /> No hidden fees</span>
            <span className="flex items-center"><CheckCircle2 size={18} className="mr-2 text-[var(--accent-primary)]" /> Cancel anytime</span>
            <span className="flex items-center"><CheckCircle2 size={18} className="mr-2 text-[var(--accent-primary)]" /> Institutional Grade</span>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
}
