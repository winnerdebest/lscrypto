'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { Terminal, Code, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ApiDocsPage() {
  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-16 items-center"
          >
            <div className="md:w-1/2 space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-bold tracking-widest uppercase mb-4">
                <Code size={16} className="mr-2" /> Developer Platform
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
                POWERFUL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">API.</span>
              </h1>
              <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                Build sophisticated algorithmic trading bots and custom portfolio management tools using our ultra-low latency REST and WebSocket APIs.
              </p>
              
              <div className="glass-card p-6 border-l-4 border-[var(--accent-secondary)]">
                <p className="text-[var(--text-secondary)] font-mono text-sm mb-2">Endpoint</p>
                <code className="text-white bg-[#080B14] px-4 py-2 rounded-lg font-mono w-full block">
                  GET https://api.cryptovault.com/v1/market/ticker
                </code>
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              <div className="glass-card p-2 rounded-2xl overflow-hidden bg-[#080B14]">
                <div className="flex space-x-2 p-4 border-b border-[var(--border-glass)]">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6 font-mono text-sm text-[var(--text-primary)] space-y-2 overflow-x-auto">
                  <p className="text-[var(--accent-primary)]">$ curl -X GET \</p>
                  <p className="pl-4">"https://api.cryptovault.com/v1/market/ticker" \</p>
                  <p className="pl-4">-H "Authorization: Bearer YOUR_API_KEY"</p>
                  <br/>
                  <p className="text-[var(--text-muted)]">// Response</p>
                  <p>{'{'}</p>
                  <p className="pl-4">"symbol": <span className="text-green-400">"BTC-USD"</span>,</p>
                  <p className="pl-4">"price": <span className="text-[#6C63FF]">64230.50</span>,</p>
                  <p className="pl-4">"volume_24h": <span className="text-[#6C63FF]">14500.23</span>,</p>
                  <p className="pl-4">"timestamp": <span className="text-green-400">"2026-04-25T08:00:00Z"</span></p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-32">
            {[
              { icon: Zap, title: 'Sub-millisecond Latency', desc: 'Colocated servers in AWS us-east-1 guarantee execution speeds rivaling traditional exchanges.' },
              { icon: Database, title: 'Historical Data', desc: 'Access highly granular orderbook snapshots and tick-level historical data dating back to 2021.' },
              { icon: Terminal, title: 'WebSocket Feeds', desc: 'Subscribe to real-time authenticated user data streams for instant updates on balances and fills.' }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="glass-card p-8"
              >
                <feature.icon size={32} className="text-[var(--accent-secondary)] mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
