'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * User-side: Request a deposit
 */
export async function createDeposit(formData: {
  coinSymbol: string;
  amountUsd: number;
  network: string;
  depositAddress: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabaseAdmin.from('deposits').insert({
    user_id: user.id,
    coin_symbol: formData.coinSymbol,
    amount_usd: formData.amountUsd,
    network: formData.network,
    deposit_address: formData.depositAddress,
    status: 'pending'
  });

  if (error) {
    console.error('Create deposit error:', error);
    return { error: 'Failed to submit deposit request' };
  }

  return { success: true };
}

/**
 * Admin-side: Fetch all deposits
 */
export async function getAdminDeposits() {
  await verifyAdmin();

  const { data: deposits, error: depositsError } = await supabaseAdmin
    .from('deposits')
    .select('*')
    .order('created_at', { ascending: false });

  if (depositsError) {
    console.error('Fetch deposits error:', depositsError);
    throw new Error('Failed to fetch deposits');
  }

  if (!deposits || deposits.length === 0) return [];

  // Fetch profiles for these deposits
  const userIds = Array.from(new Set(deposits.map(d => d.user_id)));
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .in('id', userIds);

  if (profilesError) {
    console.error('Fetch profiles for deposits error:', profilesError);
    // We can still return deposits, but without profile info
  }

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return deposits.map(d => ({
    ...d,
    profiles: profileMap.get(d.user_id) || { full_name: 'Unknown', email: 'N/A' }
  }));
}

/**
 * Admin-side: Update deposit status
 */
export async function updateDepositStatus(
  depositId: string, 
  status: 'approved' | 'declined',
  note?: string
) {
  const admin = await verifyAdmin();

  // 1. Fetch deposit details
  const { data: deposit, error: fetchError } = await supabaseAdmin
    .from('deposits')
    .select('*')
    .eq('id', depositId)
    .single();

  if (fetchError || !deposit) {
    return { error: 'Deposit not found' };
  }

  // 2. If already processed, ignore
  if (deposit.status !== 'pending') {
    return { error: 'Deposit already processed' };
  }

// 3. If approved, pre-calculate the coin amount to credit
  let coinAmount = 0;
  if (status === 'approved') {
    const symbol = deposit.coin_symbol.toLowerCase();
    const coinmap: Record<string, string> = {
      btc: 'bitcoin',
      eth: 'ethereum',
      sol: 'solana',
      usdt: 'tether',
      usdc: 'usd-coin',
      erc20: 'ethereum',
      trc20: 'tether' // assuming TRC20 usually refers to USDT on Tron
    };
    const coinId = coinmap[symbol] || symbol;

    let currentPrice = 1;
    
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
        { next: { revalidate: 0 } }
      );
      
      if (res.ok) {
        const priceData = await res.json();
        currentPrice = priceData[coinId]?.usd;
      } else {
        throw new Error('CoinGecko API error');
      }
    } catch (err) {
      console.warn('Failed to fetch live price, using fallback values:', err);
    }

    // Fallbacks in case API rate limits or price missing
    if (!currentPrice || currentPrice <= 0) {
      const fallbacks: Record<string, number> = {
        bitcoin: 90000,
        btc: 90000,
        ethereum: 3000,
        eth: 3000,
        solana: 100,
        sol: 100,
        tether: 1,
        usdt: 1,
        'usd-coin': 1,
        usdc: 1,
        erc20: 3000, // assuming ETH network means ETH native
        trc20: 1
      };
      currentPrice = fallbacks[coinId] || 1;
    }

    coinAmount = deposit.amount_usd / currentPrice;
  }

  // 4. Update deposit status
  const { error: updateError } = await supabaseAdmin
    .from('deposits')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', depositId);

  if (updateError) {
    return { error: 'Failed to update deposit status' };
  }

  // 5. If approved, credit the user's wallet
  if (status === 'approved') {
    try {
      // Update wallet
      const { data: existing } = await supabaseAdmin
        .from('wallets')
        .select('balance')
        .eq('user_id', deposit.user_id)
        .eq('coin_symbol', deposit.coin_symbol.toUpperCase())
        .single();

      const previousBalance = existing ? Number(existing.balance) : 0;
      const newBalance = previousBalance + coinAmount;

      await supabaseAdmin.from('wallets').upsert({
        user_id: deposit.user_id,
        coin_symbol: deposit.coin_symbol.toUpperCase(),
        balance: newBalance,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,coin_symbol',
      });

      // Audit log as admin action
      await supabaseAdmin.from('admin_balance_logs').insert({
        admin_id: admin.id,
        target_user_id: deposit.user_id,
        coin_symbol: deposit.coin_symbol.toUpperCase(),
        action: 'add',
        previous_balance: previousBalance,
        new_balance: newBalance,
        amount: coinAmount,
        note: `Auto-credited from approved deposit #${depositId.slice(0,8)}`
      });

    } catch (err) {
      console.error('Auto-credit error:', err);
      // We don't return error here because the status WAS updated, but balance update failed.
      // Admin might need to retry manually.
    }
  }

  return { success: true };
}

/**
 * Internals
 */
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
