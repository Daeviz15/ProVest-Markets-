-- ============================================
-- Deposits Tracking — ProvestMarkets
-- ============================================

-- 1. Create deposits table
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    coin_symbol TEXT NOT NULL,
    amount_usd DECIMAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    network TEXT NOT NULL,
    deposit_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- 3. Policies
DROP POLICY IF EXISTS "Users can view own deposits" ON public.deposits;
CREATE POLICY "Users can view own deposits" 
ON public.deposits FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own deposits" ON public.deposits;
CREATE POLICY "Users can create own deposits" 
ON public.deposits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all deposits (handled by service role in actions, but good for completeness)
-- Note: In Supabase, the service role bypasses RLS by default.

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
