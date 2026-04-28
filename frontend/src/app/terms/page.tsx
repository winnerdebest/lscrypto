'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using CryptoVault, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use our services.'
    },
    {
      title: '2. Eligibility',
      content: 'You must be at least 18 years old and capable of forming a binding contract to use our platform. You are responsible for ensuring that your use of our services is compliant with local laws.'
    },
    {
      title: '3. Investment Risks',
      content: 'Cryptocurrency investments involve high risk. ROI is generated through automated trading and liquidity provision. While we strive for stability, past performance is not indicative of future results.'
    },
    {
      title: '4. Account Security',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. CryptoVault is not liable for any loss resulting from unauthorized access to your account due to your failure to secure your credentials.'
    },
    {
      title: '5. Termination',
      content: 'We reserve the right to suspend or terminate your account if we suspect fraudulent activity or violation of these terms. In such cases, your remaining balance will be handled according to our compliance protocols.'
    }
  ];

  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Terms of Service</h1>
            <p className="text-[var(--text-secondary)]">Last updated: April 25, 2026</p>
          </div>

          <div className="space-y-12">
            <div className="glass-card p-8 md:p-12 prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">
                Welcome to CryptoVault. These Terms of Service govern your use of our website and services. Please read them carefully before proceeding.
              </p>

              {sections.map((section, i) => (
                <div key={i} className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{section.content}</p>
                </div>
              ))}

              <div className="mt-16 pt-10 border-t border-[var(--border-glass)] text-sm text-[var(--text-muted)]">
                <p>By using this platform, you acknowledge that you have read and understood these terms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
