import { useState, useEffect } from 'react';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export function useCryptoPrices() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({
    BTC: { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 0, change24h: 0 },
    ETH: { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 0, change24h: 0 },
    USDT: { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1, change24h: 0 },
    DOGE: { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0, change24h: 0 },
    PEPE: { id: 'pepe', symbol: 'PEPE', name: 'Pepe', price: 0, change24h: 0 },
    SHIB: { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', price: 0, change24h: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        if (!response.ok) throw new Error('Failed to fetch prices');
        const json = await response.json();
        const data = json.data;
        
        const newPrices: Record<string, CryptoPrice> = {};
        data.forEach((d: any) => {
          newPrices[d.symbol] = {
            id: d.id,
            symbol: d.symbol,
            name: d.name,
            price: parseFloat(d.priceUsd) || 0,
            change24h: parseFloat(d.changePercent24Hr) || 0,
          };
        });
        
        // Ensure we always have USDT at $1 even if not in top 20
        if (!newPrices['USDT']) {
          newPrices['USDT'] = { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1, change24h: 0 };
        }
        
        setPrices(newPrices);
        setError(null);
      } catch (err: any) {
        console.error('Price fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, []);

  return { prices, isLoading, error };
}

