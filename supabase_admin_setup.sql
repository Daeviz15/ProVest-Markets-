-- ============================================
-- Admin Panel Setup — ProvestMarkets
-- ============================================

-- 1. Add admin flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Create audit log for admin balance changes
CREATE TABLE IF NOT EXISTS public.admin_balance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    target_user_id UUID REFERENCES auth.users(id) NOT NULL,
    coin_symbol TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('set', 'add', 'subtract', 'create')),
    previous_balance DECIMAL DEFAULT 0,
    new_balance DECIMAL NOT NULL,
    amount DECIMAL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Enable RLS on audit log (service role bypasses, but good practice)
ALTER TABLE public.admin_balance_logs ENABLE ROW LEVEL SECURITY;

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_balance_logs_target 
ON public.admin_balance_logs(target_user_id);

CREATE INDEX IF NOT EXISTS idx_admin_balance_logs_admin 
ON public.admin_balance_logs(admin_id);

CREATE INDEX IF NOT EXISTS idx_profiles_is_admin 
ON public.profiles(is_admin) WHERE is_admin = true;

-- 5. Enable Realtime on wallets table
-- This allows admin balance changes to push live to user dashboards
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;

-- ============================================
-- IMPORTANT: After running this script, manually
-- set your admin account:
--
--   UPDATE public.profiles 
--   SET is_admin = true 
--   WHERE email = 'your-admin-email@example.com';
-- ============================================
