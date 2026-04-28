'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Mail, MessageSquare, Globe, Activity } from 'lucide-react';
import { useState } from 'react';
import PriceTicker from './PriceTicker';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Investment Plans', href: '/#plans' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--accent-primary)] selection:text-[#080B14]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-primary)] rounded-full blur-[150px] opacity-[0.03] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-secondary)] rounded-full blur-[150px] opacity-[0.03] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Island Navigation */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 bg-[var(--bg-base)]/70 backdrop-blur-2xl border border-[var(--border-glass)] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#080B14] rounded-[7px] flex items-center justify-center">
                <span className="text-lg font-heading font-black text-white">C</span>
              </div>
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-white group-hover:text-[var(--accent-primary)] transition-colors">
              CryptoVault
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--accent-primary)] ${
                  pathname === link.href ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/auth/register" className="bg-[var(--accent-primary)] text-[#080B14] font-bold rounded-full px-6 py-2 text-sm hover:shadow-[0_0_20px_var(--accent-primary-glow)] transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[var(--text-primary)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--bg-base)]/95 backdrop-blur-3xl border border-[var(--border-glass)] rounded-3xl p-6 shadow-2xl animate-fade-in origin-top">
            <nav className="flex flex-col space-y-4 mb-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-lg font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-4">
              <Link href="/auth/login" className="btn-ghost w-full text-center py-3 rounded-xl">Log In</Link>
              <Link href="/auth/register" className="btn-primary w-full text-center py-3 rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </header>
      
      {/* Fixed Bottom Price Ticker */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-[#080B14]/80 backdrop-blur-md border-t border-[var(--border-glass)] hidden md:block">
        <PriceTicker />
      </div>

      <main className="flex-1">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-[#0A0D18] border-t border-[var(--border-glass)] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-heading font-bold text-white">CryptoVault</span>
              </Link>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
                The world's most sophisticated automated crypto investment platform. Engineered for security, designed for wealth.
              </p>
              <div className="flex space-x-4">
                {[Mail, MessageSquare, Globe, Activity].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><Link href="/#plans" className="hover:text-[var(--accent-primary)]">Investment Plans</Link></li>
                <li><Link href="/security" className="hover:text-[var(--accent-primary)]">Security First</Link></li>
                <li><Link href="/fees" className="hover:text-[var(--accent-primary)]">Fee Structure</Link></li>
                <li><Link href="/api-docs" className="hover:text-[var(--accent-primary)]">API Reference</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><Link href="/about" className="hover:text-[var(--accent-primary)]">Our Story</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--accent-primary)]">Contact Support</Link></li>
                <li><Link href="/privacy" className="hover:text-[var(--accent-primary)]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--accent-primary)]">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Stay updated with market insights and new investment opportunities.</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
                <button className="bg-[var(--accent-primary)] text-[#080B14] p-2 rounded-xl hover:opacity-90 transition-opacity">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-glass)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-muted)]">
            <p>© {new Date().getFullYear()} CryptoVault Global Ltd. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span>FCA Regulated</span>
              <span>SIPC Insured up to $500k</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
