-- 1. Create KYC Submissions Table
CREATE TABLE IF NOT EXISTS public.kyc_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    id_type TEXT NOT NULL, -- e.g., 'passport', 'national_id', 'drivers_license'
    id_number TEXT,
    document_front_url TEXT NOT NULL,
    document_back_url TEXT, -- Optional for some ID types
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS on kyc_submissions
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for kyc_submissions
-- Users can view their own submissions
CREATE POLICY "Users can view own kyc" 
ON public.kyc_submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own kyc" 
ON public.kyc_submissions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 4. Create KYC Documents Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies for kyc-documents
-- Users can upload to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'kyc-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'kyc-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kyc_submissions_updated_at
    BEFORE UPDATE ON public.kyc_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
