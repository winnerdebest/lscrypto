import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex selection:bg-[var(--accent-primary)] selection:text-[#080B14]">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0A0D18] items-center justify-center p-12 overflow-hidden border-r border-[var(--border-glass)]">
        {/* Animated Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[var(--accent-primary)] rounded-full blur-[150px] opacity-[0.05] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-secondary)] rounded-full blur-[150px] opacity-[0.05] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-lg space-y-12 animate-fade-in">
          <Link href="/" className="flex items-center space-x-3 group w-fit hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[var(--gradient-brand)] flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center">
                <span className="text-2xl font-heading font-black text-white">C</span>
              </div>
            </div>
            <span className="text-3xl font-heading font-bold tracking-tight text-white group-hover:text-[var(--accent-primary)] transition-colors">
              CryptoVault
            </span>
          </Link>
          
          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-heading font-bold leading-tight">
              Institutional wealth tools,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">now in your hands.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Join over 100,000 investors worldwide who trust our automated algorithms to secure and multiply their digital assets.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[var(--border-glass)]">
            <div>
              <p className="text-3xl font-mono font-bold text-white">$4.2B+</p>
              <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mt-1">Assets Managed</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-white">Bank-Grade</p>
              <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mt-1">Security Standard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#080B14]">
        {/* Mobile Header */}
        <div className="absolute top-8 left-6 lg:hidden animate-fade-in">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#080B14] rounded-[7px] flex items-center justify-center">
                <span className="text-lg font-heading font-black text-white">C</span>
              </div>
            </div>
            <span className="text-xl font-heading font-bold text-white">CryptoVault</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}
