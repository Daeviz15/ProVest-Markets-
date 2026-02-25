'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// ============================================
// Auth Helpers
// ============================================

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) throw new Error('Forbidden: Not an admin');

  return user;
}

// ============================================
// User Management — Paginated
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  wallet_count: number;
  total_coins: number;
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getAdminUsers(
  page: number = 1,
  pageSize: number = 15,
  search: string = ''
): Promise<PaginatedUsers> {
  await verifyAdmin();

  // Build query with optional search filter
  let countQuery = supabaseAdmin
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  let dataQuery = supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, avatar_url, is_admin, created_at')
    .order('created_at', { ascending: false });

  if (search.trim()) {
    const term = `%${search.trim()}%`;
    countQuery = countQuery.or(`email.ilike.${term},full_name.ilike.${term}`);
    dataQuery = dataQuery.or(`email.ilike.${term},full_name.ilike.${term}`);
  }

  // Get total count
  const { count } = await countQuery;
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  // Paginate
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data: profiles, error: profilesError } = await dataQuery.range(from, to);

  if (profilesError) throw new Error(profilesError.message);
  if (!profiles || profiles.length === 0) {
    return { users: [], total, page: safePage, pageSize, totalPages };
  }

  // Fetch wallet summaries only for the visible page of users
  const userIds = profiles.map(p => p.id);
  const { data: wallets } = await supabaseAdmin
    .from('wallets')
    .select('user_id, coin_symbol, balance')
    .in('user_id', userIds);

  const walletMap = new Map<string, { count: number; totalCoins: number }>();
  (wallets || []).forEach(w => {
    const existing = walletMap.get(w.user_id) || { count: 0, totalCoins: 0 };
    existing.count += 1;
    existing.totalCoins += Number(w.balance) > 0 ? 1 : 0;
    walletMap.set(w.user_id, existing);
  });

  const users: AdminUser[] = profiles.map(p => ({
    id: p.id,
    email: p.email,
    full_name: p.full_name,
    avatar_url: p.avatar_url,
    is_admin: p.is_admin || false,
    created_at: p.created_at,
    wallet_count: walletMap.get(p.id)?.count || 0,
    total_coins: walletMap.get(p.id)?.totalCoins || 0,
  }));

  return { users, total, page: safePage, pageSize, totalPages };
}

// ============================================
// Wallet Management
// ============================================

export interface UserWallet {
  id: string;
  coin_symbol: string;
  balance: number;
  updated_at: string;
}

export async function getUserWallets(userId: string): Promise<UserWallet[]> {
  await verifyAdmin();

  const { data, error } = await supabaseAdmin
    .from('wallets')
    .select('id, coin_symbol, balance, updated_at')
    .eq('user_id', userId)
    .order('coin_symbol', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(w => ({
    ...w,
    balance: Number(w.balance),
  }));
}

// Fetch real portfolio value by calculating coin balances × market prices
export async function getUserPortfolioValue(userId: string): Promise<number> {
  await verifyAdmin();

  const { data: wallets } = await supabaseAdmin
    .from('wallets')
    .select('coin_symbol, balance')
    .eq('user_id', userId);

  if (!wallets || wallets.length === 0) return 0;

  // Fetch market prices from CoinGecko (server-side direct call)
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false',
      { headers: { 'Accept': 'application/json' }, next: { revalidate: 300 } }
    );
    if (!res.ok) return 0;
    const marketData: Array<{ symbol: string; current_price: number }> = await res.json();

    let total = 0;
    for (const w of wallets) {
      const balance = Number(w.balance);
      if (balance <= 0) continue;
      const coin = marketData.find(c => c.symbol.toLowerCase() === w.coin_symbol.toLowerCase());
      total += balance * (coin?.current_price || 0);
    }
    return total;
  } catch {
    return 0;
  }
}

// ============================================
// Balance Modification — Per-Coin
// ============================================

export async function updateUserBalance(
  targetUserId: string,
  coinSymbol: string,
  amount: number,
  action: 'set' | 'add' | 'subtract',
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();

  try {
    const { data: existing } = await supabaseAdmin
      .from('wallets')
      .select('id, balance')
      .eq('user_id', targetUserId)
      .eq('coin_symbol', coinSymbol.toUpperCase())
      .single();

    const previousBalance = existing ? Number(existing.balance) : 0;
    let newBalance: number;

    switch (action) {
      case 'set':
        newBalance = amount;
        break;
      case 'add':
        newBalance = previousBalance + amount;
        break;
      case 'subtract':
        newBalance = Math.max(0, previousBalance - amount);
        break;
      default:
        return { success: false, error: 'Invalid action' };
    }

    if (newBalance < 0) {
      return { success: false, error: 'Balance cannot be negative' };
    }

    const { error: upsertError } = await supabaseAdmin
      .from('wallets')
      .upsert({
        user_id: targetUserId,
        coin_symbol: coinSymbol.toUpperCase(),
        balance: newBalance,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,coin_symbol',
      });

    if (upsertError) throw upsertError;

    // Audit log
    await supabaseAdmin.from('admin_balance_logs').insert({
      admin_id: admin.id,
      target_user_id: targetUserId,
      coin_symbol: coinSymbol.toUpperCase(),
      action,
      previous_balance: previousBalance,
      new_balance: newBalance,
      amount,
      note: note || null,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

// ============================================
// Portfolio Balance — Generic (spreads across USDT)
// ============================================

export async function updatePortfolioBalance(
  targetUserId: string,
  usdAmount: number,
  action: 'set' | 'add' | 'subtract',
  note?: string
): Promise<{ success: boolean; error?: string }> {
  // Generic portfolio balance is stored as USDT
  return updateUserBalance(targetUserId, 'USDT', usdAmount, action, note || 'Portfolio balance adjustment');
}

// ============================================
// Stats (paginated-safe — lightweight count query)
// ============================================

export interface AdminStats {
  totalUsers: number;
  activeWallets: number;
  fundedUsers: number;
  newToday: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  await verifyAdmin();

  const [usersRes, walletsRes, fundedRes] = await Promise.all([
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('wallets').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('wallets').select('user_id', { count: 'exact', head: true }).gt('balance', 0),
  ]);

  // New today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: newTodayCount } = await supabaseAdmin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  return {
    totalUsers: usersRes.count || 0,
    activeWallets: walletsRes.count || 0,
    fundedUsers: fundedRes.count || 0,
    newToday: newTodayCount || 0,
  };
}
