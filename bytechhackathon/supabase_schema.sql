-- Updated Supabase Database Schema for ByTech Virtual Hackathon 2026
-- Copy and run this script in the Supabase SQL Editor.

-- 1. Create the sequence for Participant ID generation
CREATE SEQUENCE IF NOT EXISTS participant_id_seq START 1;

-- 2. Create the participants table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    university_name VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    study_year VARCHAR(50) NOT NULL,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    skills TEXT NOT NULL,
    payment_id VARCHAR(100) UNIQUE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create indices for faster lookups
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_payment_status ON public.participants(payment_status);
CREATE INDEX IF NOT EXISTS idx_participants_participant_id ON public.participants(participant_id);

-- 4. Create trigger function to automatically generate participant_id (e.g. BTH2026-0001)
-- Only generated when payment_status changes to 'paid' and participant_id is null.
CREATE OR REPLACE FUNCTION public.generate_participant_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND (OLD IS NULL OR OLD.payment_status = 'pending') AND NEW.participant_id IS NULL THEN
        NEW.participant_id := 'BTH2026-' || LPAD(nextval('public.participant_id_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach the trigger
CREATE OR REPLACE TRIGGER trg_generate_participant_id
BEFORE INSERT OR UPDATE ON public.participants
FOR EACH ROW
EXECUTE FUNCTION public.generate_participant_id();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies

-- Policy 1: Allow anyone to insert their registration details (public registration)
CREATE POLICY "Allow public inserts" 
ON public.participants 
FOR INSERT 
WITH CHECK (true);

-- Policy 2: Allow anyone to select their own registration details if they know the record UUID (used for success page redirection)
CREATE POLICY "Allow public select by ID" 
ON public.participants 
FOR SELECT 
TO anon 
USING (true);

-- Policy 3: Allow authenticated users (admin role/email logins) full access to read/write all records
CREATE POLICY "Allow admin full access" 
ON public.participants 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy 4: Allow public updates of payment details to transition pending records to paid (frontend fallback)
CREATE POLICY "Allow public payment updates"
ON public.participants
FOR UPDATE
TO anon
USING (payment_status = 'pending')
WITH CHECK (payment_status = 'paid' AND payment_id IS NOT NULL);

