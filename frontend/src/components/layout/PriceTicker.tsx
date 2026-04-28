'use client';

import { useCryptoPrices } from '@/hooks/useCryptoPrices';

export default function PriceTicker() {
  const { prices, isLoading } = useCryptoPrices();

  if (isLoading || Object.keys(prices).length === 0) {
    return <div className="h-10 bg-[var(--bg-surface)] flex items-center px-4 border-b border-[var(--border-glass)]" />;
  }

  // Get top 15 coins or all available to show in ticker
  const coins = Object.keys(prices).slice(0, 15);
  
  // Duplicate for seamless infinite marquee loop
  const displayCoins = [...coins, ...coins];

  return (
    <div className="h-10 bg-[var(--bg-surface)] border-b border-[var(--border-glass)] overflow-hidden flex items-center relative">
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {displayCoins.map((coin, index) => {
          const data = prices[coin];
          const isPositive = data.change24h >= 0;
          return (
            <div key={`${coin}-${index}`} className="flex items-center space-x-2 px-8 font-mono text-sm">
              <span className="font-bold text-[var(--text-primary)]">{coin}</span>
              <span className="text-[var(--text-secondary)]">${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
                {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
