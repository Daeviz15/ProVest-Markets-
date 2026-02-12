import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Server-side in-memory cache for ultra-fast response and absolute rate-limit safety
const serverCache = new Map<string, { data: any; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any>>();
const SERVER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., 'markets' or 'history'
  const id = searchParams.get('id');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '10';
  const order = searchParams.get('order') || 'market_cap_desc';
  const days = searchParams.get('days') || '7';

  const cacheKey = searchParams.toString();

  // 1. Check in-memory cache first
  const cached = serverCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SERVER_CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // 2. Prevent redundant in-flight requests
  if (inFlightRequests.has(cacheKey)) {
    try {
      const data = await inFlightRequests.get(cacheKey);
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  let url = '';
  if (endpoint === 'markets') {
    url = `${BASE_URL}/coins/markets?vs_currency=usd&order=${order}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`;
  } else if (endpoint === 'history' && id) {
    url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  } else {
    return NextResponse.json({ error: 'Invalid endpoint or missing parameters' }, { status: 400 });
  }

  const fetchPromise = (async () => {
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 }, // 5 minutes
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('CoinGecko API rate limit reached. Please try again in a minute.');
        }
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }

      const data = await response.json();
      serverCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);

  try {
    const data = await fetchPromise;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to communicate with crypto service' }, 
      { status: error.message.includes('429') ? 429 : 500 }
    );
  }
}
