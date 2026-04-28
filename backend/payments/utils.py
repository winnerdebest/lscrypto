import requests

def get_live_price(coin_symbol):
    """
    Fetches the live price of a cryptocurrency in USD using CoinGecko API.
    """
    coin_map = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'USDT': 'tether',
        'BNB': 'binancecoin',
        'SOL': 'solana'
    }
    
    coin_id = coin_map.get(coin_symbol.upper())
    if not coin_id:
        return 1.0 # Default to 1:1 if unknown (like a stablecoin)
    
    try:
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd"
        response = requests.get(url, timeout=10)
        data = response.json()
        return float(data[coin_id]['usd'])
    except Exception as e:
        print(f"Error fetching price for {coin_symbol}: {e}")
        # Fallback rates if API is down
        fallbacks = {'BTC': 65000, 'ETH': 3500, 'USDT': 1}
        return float(fallbacks.get(coin_symbol.upper(), 1.0))
