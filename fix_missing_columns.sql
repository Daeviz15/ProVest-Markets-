-- Consolidated SQL script to fix missing columns for Currency Selector and Admin Panel

-- 1. Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signal_strength INTEGER DEFAULT 0 CHECK (signal_strength >= 0 AND signal_strength <= 100);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'usd';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Create index for fast admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- 3. Create audit log for admin balance changes (required for admin actions)
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

-- 4. Enable RLS on audit log
ALTER TABLE public.admin_balance_logs ENABLE ROW LEVEL SECURITY;

-- 5. Enable Realtime on wallets table (for live updates)
-- Uncomment the line below if you haven't enabled realtime for wallets yet
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;

-- IMPORTANT: Set your admin account
-- Update the email below to your own admin email
-- UPDATE public.profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';
