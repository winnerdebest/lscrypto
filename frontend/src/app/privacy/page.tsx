'use client';

import MarketingLayout from '@/components/layout/MarketingLayout';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, complete a transaction, or contact us for support. This includes your name, email address, government-issued ID for KYC, and wallet addresses.'
    },
    {
      title: '2. How We Use Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and detect and prevent fraudulent activity.'
    },
    {
      title: '3. Data Security',
      content: 'We employ industry-leading security measures to protect your information, including end-to-end encryption, multi-factor authentication, and secure cold storage for sensitive financial data.'
    },
    {
      title: '4. Third-Party Sharing',
      content: 'We do not sell your personal data. We may share information with verified third-party service providers (like KYC processors) strictly for the purpose of providing our services to you.'
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time through your dashboard settings. For specific data requests, you can contact our data protection officer.'
    }
  ];

  return (
    <MarketingLayout>
      <div className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Privacy Policy</h1>
            <p className="text-[var(--text-secondary)]">Last updated: April 25, 2026</p>
          </div>

          <div className="space-y-12">
            <div className="glass-card p-8 md:p-12 prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">
                At Inc., we are committed to protecting your privacy and ensuring the security of your digital assets. This policy outlines how we handle your data and your rights as a user of our platform.
              </p>

              {sections.map((section, i) => (
                <div key={i} className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{section.content}</p>
                </div>
              ))}

              <div className="mt-16 pt-10 border-t border-[var(--border-glass)] text-sm text-[var(--text-muted)]">
                <p>If you have any questions about this Privacy Policy, please contact us at legal@cryptovault.com.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
