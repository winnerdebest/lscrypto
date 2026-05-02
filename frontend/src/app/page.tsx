'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Terminal,
  Activity,
  Cpu,
  Wallet,
  Bot,
  TrendingUp,
  LineChart,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import MarketingLayout from '@/components/layout/MarketingLayout';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Simulated AI Trade Data for the Terminal
const simulatedTrades = [
  { time: '14:01:22', pair: 'PEPE/USDT', action: 'BUY', price: '0.0000078', confidence: '94%', profit: null },
  { time: '14:02:45', pair: 'PEPE/USDT', action: 'SELL', price: '0.0000089', confidence: '99%', profit: '+14.1%' },
  { time: '14:05:10', pair: 'WIF/USDT', action: 'BUY', price: '2.45', confidence: '88%', profit: null },
  { time: '14:07:30', pair: 'WIF/USDT', action: 'SELL', price: '2.68', confidence: '96%', profit: '+9.3%' },
  { time: '14:09:15', pair: 'DOGE/USDT', action: 'BUY', price: '0.14', confidence: '92%', profit: null },
  { time: '14:12:00', pair: 'DOGE/USDT', action: 'SELL', price: '0.155', confidence: '98%', profit: '+10.7%' },
];

export default function LandingPage() {
  const { prices } = useCryptoPrices();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Terminal Animation State
  const [activeTrades, setActiveTrades] = useState<typeof simulatedTrades>([]);
  const [tradeIndex, setTradeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTrades(prev => {
        const newTrades = [...prev, simulatedTrades[tradeIndex]];
        if (newTrades.length > 5) newTrades.shift(); // Keep only last 5
        return newTrades;
      });
      setTradeIndex(prev => (prev + 1) % simulatedTrades.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [tradeIndex]);

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
      {/* Aggressive Cyberpunk Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden min-h-[95vh] flex items-center bg-[#000000]">
        {/* Neon Cyber Glows */}
        <motion.div 
          style={{ y: yBg }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--accent-primary)] rounded-full blur-[200px] opacity-[0.15] pointer-events-none"
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent-secondary)] rounded-full blur-[180px] opacity-[0.1] pointer-events-none"></div>
        
        {/* Matrix Rain Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgMjAgMTAgTSAxMCAwIEwgMTAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAyNDAsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-10"
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[var(--accent-primary)] bg-[var(--accent-primary-dim)] text-[var(--accent-primary)] text-xs md:text-sm font-bold tracking-widest shadow-[0_0_20px_var(--accent-primary-glow)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
              </span>
              <span>ALGORITHMIC TRADING ACTIVE</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-5xl sm:text-6xl md:text-[5.5rem] font-heading font-black tracking-tighter leading-[0.95] drop-shadow-2xl text-white break-words">
              LET AI TRADE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-secondary)] to-[#00f2fe]">YOU KEEP THE PROFITS.</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed font-mono">
              Deposit your capital and let the AI do the rest. Our proprietary neural network scans millions of public posts and social data in real-time, sniping trending memecoins before anyone else even knows they exist.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/auth/register" className="w-full sm:w-auto text-lg px-10 py-5 overflow-hidden relative group rounded-xl bg-[var(--accent-secondary)] text-[#000000] font-black shadow-[0_0_40px_var(--accent-secondary-glow)] hover:shadow-[0_0_60px_var(--accent-secondary-glow)] transition-all hover:scale-105 flex items-center justify-center">
                <span>Deploy AI Bot Now</span>
                <Zap className="ml-2 group-hover:animate-pulse" size={20} />
              </Link>
              <Link href="#how-it-works" className="btn-ghost w-full sm:w-auto text-lg px-10 py-5 border border-[var(--border-glass)] hover:bg-white/5 rounded-xl font-mono text-[var(--text-primary)]">
                View Live Performance
              </Link>
            </motion.div>
          </motion.div>

          {/* Live AI Trading Terminal Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", duration: 1.5, delay: 0.2 }}
            className="relative perspective-1000 group w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-primary-dim)] to-transparent opacity-20 blur-[100px]"></div>
            
            <div className="relative border border-[var(--accent-primary)]/30 rounded-2xl bg-[#030508]/90 backdrop-blur-3xl shadow-[0_0_50px_var(--accent-primary-dim)] overflow-hidden font-mono">
              {/* Terminal Header */}
              <div className="bg-[#050A10] border-b border-[var(--accent-primary)]/20 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Terminal className="text-[var(--accent-primary)] flex-shrink-0" size={18} />
                  <span className="text-[10px] sm:text-xs text-[var(--accent-primary)] font-bold tracking-widest truncate">INC. // ALGO_EXECUTION_ENGINE</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_10px_var(--accent-secondary)] animate-pulse"></div>
                  <div className="text-xs text-[var(--accent-secondary)] font-bold">LIVE</div>
                </div>
              </div>
              
              {/* Terminal Body */}
              <div className="p-6 h-[320px] flex flex-col justify-end relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-transparent to-transparent z-10 pointer-events-none"></div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {activeTrades.map((trade, i) => (
                      <motion.div 
                        key={trade.time + i}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center text-xs sm:text-sm border-l-2 pl-3"
                        style={{ borderColor: trade.action === 'BUY' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}
                      >
                        <span className="text-[var(--text-muted)] w-16 sm:w-20 hidden sm:inline-block">[{trade.time}]</span>
                        <span className="text-[var(--accent-primary)] font-bold w-10 sm:w-12">{trade.action}</span>
                        <span className="text-white w-20 sm:w-24 truncate pr-2">{trade.pair}</span>
                        <span className="text-[var(--text-secondary)] w-16 sm:w-20 hidden xs:inline-block">@ {trade.price}</span>
                        {trade.profit ? (
                          <span className="text-[var(--accent-secondary)] font-bold shadow-sm px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[var(--accent-secondary)]/10 rounded ml-auto whitespace-nowrap text-[10px] sm:text-xs">
                            PROFIT {trade.profit}
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] ml-auto whitespace-nowrap text-[10px] sm:text-xs">
                            Conf: {trade.confidence}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Terminal Footer (Profit Counter) */}
              <div className="border-t border-[var(--accent-primary)]/20 p-4 bg-[#0A101A] flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)] uppercase">Daily Realized Profit</span>
                <span className="text-xl font-black text-[var(--accent-secondary)] tracking-tight">+$1,402.50</span>
              </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-10 border border-[var(--accent-secondary)]/40 bg-[#050A10]/90 backdrop-blur-xl p-3 rounded-lg shadow-[0_0_20px_var(--accent-secondary-glow)] z-20 flex items-center space-x-2"
            >
              <Activity className="text-[var(--accent-secondary)]" size={16} />
              <span className="text-xs font-bold text-white font-mono">1.2ms LATENCY</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section id="how-it-works" className="py-32 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-heading font-black mb-6 uppercase tracking-tight text-white">
              Set and <span className="text-[var(--accent-secondary)]">Forget</span>
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-[var(--text-secondary)] font-mono text-sm md:text-base">Three steps to algorithmic supremacy. The AI handles the execution, you reap the rewards.</motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-[var(--accent-primary)]/10 via-[var(--accent-primary)]/50 to-[var(--accent-secondary)]/50 z-0"></div>

            {[
              { 
                step: '01',
                icon: Wallet, 
                title: 'Invest Capital', 
                desc: 'Fund your secure vault. The more you invest, the larger the position sizes the AI can take on early breakouts.' 
              },
              { 
                step: '02',
                icon: Cpu, 
                title: 'AI Scans Social Data', 
                desc: 'Our engine monitors Twitter, Reddit, and Telegram 24/7, detecting viral memecoin trends before human traders.' 
              },
              { 
                step: '03',
                icon: TrendingUp, 
                title: 'Withdraw Profits', 
                desc: 'Watch your portfolio compound daily. Withdraw your initial capital and profits at any time with zero restrictions.' 
              }
            ].map((feature, i) => (
              <motion.div variants={fadeUpVariant} key={i} className="glass-card p-10 relative z-10 bg-[#080C14] border-white/10 hover:border-[var(--accent-primary)]/50 transition-colors">
                <span className="absolute -top-6 -left-4 text-7xl font-black text-white/5 font-heading pointer-events-none select-none">{feature.step}</span>
                <div className="w-16 h-16 rounded-xl bg-[#000000] border border-white/10 text-[var(--accent-primary)] flex items-center justify-center mb-8 shadow-[0_0_15px_var(--accent-primary-dim)]">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-wide">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm font-mono leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Extreme Features Grid */}
      <section className="py-32 px-6 bg-[#000000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 text-[var(--accent-secondary)] font-bold tracking-widest uppercase text-xs">
                <Bot size={16} />
                <span>Why Algorithmic Trading Wins</span>
              </motion.div>
              
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-heading font-black leading-tight uppercase text-white">
                Zero Emotion. <br/><span className="text-[var(--accent-primary)]">Infinite Logic.</span>
              </motion.h2>
              
              <motion.p variants={fadeUpVariant} className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
                Human traders panic sell, revenge trade, and sleep. The Inc. AI Engine operates with cold, calculated precision 24/7. It reads public data and social media instantly, finding the next 100x memecoin and executing trades while you sleep.
              </motion.p>
              
              <motion.ul variants={fadeUpVariant} className="space-y-6 pt-4 font-mono text-sm">
                {[
                  { title: 'Social Data Arbitrage', desc: 'The AI reads global posts to identify trending narratives and snipes memecoins before the masses.' },
                  { title: 'Lightning Execution', desc: 'Once a trend is identified, trades are executed in under 2ms for maximum early profit.' },
                  { title: 'Automated Risk Management', desc: 'Hard-coded trailing stops lock in your profits as the memecoin pumps.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle2 size={16} className="text-[var(--accent-secondary)]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase">{item.title}</h4>
                      <p className="text-[var(--text-muted)] mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden glass-card border border-[var(--accent-primary)]/20"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen filter contrast-125 grayscale hue-rotate-180"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#000000] via-transparent to-[var(--accent-primary)]/20"></div>
              
              {/* Overlay Analytics UI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <LineChart className="text-[var(--accent-secondary)] w-24 h-24 opacity-80" />
                <div>
                  <div className="text-[var(--accent-primary)] font-mono text-xs font-bold tracking-widest mb-2">AVERAGE WIN RATE</div>
                  <div className="text-7xl font-heading font-black text-white drop-shadow-[0_0_20px_var(--accent-primary)]">87.4%</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auto-Trading Tiers */}
      <section id="plans" className="py-32 px-6 bg-[#030508] relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-1px bg-gradient-to-r from-transparent via-[var(--accent-secondary)] to-transparent opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 uppercase text-white tracking-tight">Deploy Your AI Bot</h2>
            <p className="text-[var(--text-secondary)] font-mono text-sm">Select algorithmic firepower. No profit sharing. You keep 100% of what the AI earns.</p>
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
                name: 'Standard Algo', 
                price: '$49', 
                duration: '/ mo', 
                features: ['Blue-Chip Trading Only (BTC, ETH)', 'Standard Execution Speed', 'Max $10k Portfolio Limit']
              },
              { 
                name: 'HFT Sniper', 
                price: '$199', 
                duration: '/ mo', 
                popular: true,
                features: ['Memecoin Social Sentiment Sniping', 'Sub-millisecond Execution', 'Unlimited Portfolio Size', 'Automated Trailing Stops']
              },
              { 
                name: 'Institutional', 
                price: '$899', 
                duration: '/ mo', 
                features: ['Custom Algorithm Deployment', 'Dedicated GPU Instance', 'Arbitrage Exploitation', 'Zero-Risk Hedging Engine']
              },
            ].map((plan, i) => (
              <motion.div 
                variants={fadeUpVariant}
                key={i} 
                className={`relative flex flex-col p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'bg-gradient-to-b from-[var(--accent-secondary)] to-transparent shadow-[0_0_40px_rgba(0,255,65,0.15)] z-10 lg:scale-105' : 'bg-white/10'}`}
              >
                <div className="bg-[#050A10] rounded-[15px] p-8 md:p-10 flex-1 flex flex-col h-full relative">
                  {plan.popular && <span className="absolute top-0 right-0 bg-[var(--accent-secondary)] text-[#000000] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-[0_0_15px_var(--accent-secondary-glow)]">Max Profit</span>}
                  
                  <h3 className="text-xl font-bold text-white mb-2 uppercase">{plan.name}</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-heading font-black text-[var(--accent-primary)] tracking-tighter">{plan.price}</span>
                    <span className="ml-2 text-[var(--text-muted)] font-mono text-xs">{plan.duration}</span>
                  </div>
                  
                  <div className="w-full h-px bg-white/5 mb-8"></div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start text-xs font-mono text-[var(--text-secondary)]">
                        <CheckCircle2 size={16} className={`mr-3 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent-primary)]'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/register" className={`group flex items-center justify-center w-full py-4 rounded-xl font-black uppercase text-sm transition-all ${plan.popular ? 'bg-[var(--accent-secondary)] text-[#000000] hover:shadow-[0_0_20px_var(--accent-secondary-glow)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                    Deploy Engine <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final Cyber CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#000000]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgMjAgMTAgTSAxMCAwIEwgMTAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAyNDAsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-4 rounded-full bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 mb-6"
          >
            <ShieldAlert className="text-[var(--accent-secondary)] w-12 h-12" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-heading font-black tracking-tighter uppercase text-white break-words"
          >
            STOP TRADING MANUALLY. <br/>
            <span className="text-[var(--accent-primary)] drop-shadow-[0_0_20px_var(--accent-primary-dim)]">START EARNING.</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <Link href="/auth/register" className="w-full sm:w-auto text-xl px-12 py-6 rounded-xl bg-[var(--accent-secondary)] text-[#000000] font-black uppercase shadow-[0_0_40px_var(--accent-secondary-glow)] hover:scale-105 transition-all flex items-center justify-center group">
              Initialize AI Bot <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
}
