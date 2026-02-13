-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    recipient_email TEXT NOT NULL,
    coin_symbol TEXT NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    status TEXT DEFAULT 'completed' NOT NULL, -- 'pending', 'completed', 'failed'
    type TEXT DEFAULT 'internal' NOT NULL, -- 'internal' or 'external'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transfers"
    ON transfers FOR SELECT
    USING (auth.uid() = sender_id);

CREATE POLICY "Users can insert their own transfers"
    ON transfers FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS transfers_sender_id_idx ON transfers(sender_id);
CREATE INDEX IF NOT EXISTS transfers_recipient_email_idx ON transfers(recipient_email);
CREATE INDEX IF NOT EXISTS transfers_created_at_idx ON transfers(created_at);
