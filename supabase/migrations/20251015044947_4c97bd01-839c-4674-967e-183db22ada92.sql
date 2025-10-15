-- Add new fields to applications table for loan details form
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS loan_purpose text,
ADD COLUMN IF NOT EXISTS preferred_contact_method text CHECK (preferred_contact_method IN ('whatsapp', 'email'));