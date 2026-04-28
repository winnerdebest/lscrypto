'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';
import { Mail, MessageSquare, Phone, MapPin, Send, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent! Our team will contact you shortly.');
    }, 1500);
  };

  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Left Side: Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight">LET'S <br/><span className="text-[var(--accent-primary)]">CONNECT.</span></h1>
                <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-md">
                  Have questions about our investment tiers or institutional solutions? Our global support team is available 24/7.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Mail, label: 'Email Support', value: 'support@cryptovault.com' },
                  { icon: Phone, label: 'Global Phone', value: '+1 (800) CRYPTO-V' },
                  { icon: MessageSquare, label: 'Live Chat', value: 'Available in dashboard' },
                  { icon: Globe, label: 'Headquarters', value: 'London, EC2V 6AA' },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-dim)]/10 text-[var(--accent-primary)] flex items-center justify-center">
                      <item.icon size={20} />
                    </div>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-[var(--border-glass)]">
                <p className="text-sm text-[var(--text-muted)] mb-4 uppercase font-bold tracking-[0.2em]">Global Presence</p>
                <div className="flex space-x-6 text-[var(--text-secondary)] text-sm">
                  <span>London</span>
                  <span>Singapore</span>
                  <span>New York</span>
                  <span>Dubai</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-[0.05] blur-[80px]"></div>
              <div className="relative glass-card p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
                      <input type="text" required className="input" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                      <input type="email" required className="input" placeholder="john@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Inquiry Type</label>
                    <select className="input appearance-none">
                      <option>General Inquiry</option>
                      <option>Institutional Solutions</option>
                      <option>Account Recovery</option>
                      <option>Partnership Proposal</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                    <textarea rows={5} required className="input py-4 min-h-[150px]" placeholder="Tell us how we can help..."></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="btn-primary w-full py-5 text-lg group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? 'Sending...' : 'Send Message'} 
                      {!isSubmitting && <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
