export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(urlParams: string) {
  const now = Date.now();
  const cached = cache.get(urlParams);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const proxyUrl = `/api/crypto?${urlParams}`;

  try {
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(urlParams, { data, timestamp: now });
    return data;
  } catch (error: any) {
    console.error('Crypto Service Error:', error);
    // If it's a network error (like the one reported), provide a better message
    if (error.message.includes('Failed to fetch')) {
        throw new Error('Institutional data connection unstable. Retrying...');
    }
    throw error;
  }
}

export async function getMarkets(page = 1, perPage = 10, order = 'market_cap_desc'): Promise<CoinMarketData[]> {
  const params = `endpoint=markets&page=${page}&per_page=${perPage}&order=${order}`;
  return fetchWithCache(params);
}

export async function getCoinHistory(id: string, days = 7): Promise<{ prices: [number, number][] }> {
  const params = `endpoint=history&id=${id}&days=${days}`;
  return fetchWithCache(params);
}

export async function getTopCoins(count = 50): Promise<CoinMarketData[]> {
  return getMarkets(1, count);
}
