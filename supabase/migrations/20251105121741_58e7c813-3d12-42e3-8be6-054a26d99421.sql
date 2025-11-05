-- Add document verification fields to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS document_verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS document_verification_result jsonb,
ADD COLUMN IF NOT EXISTS document_verified_at timestamp with time zone;

-- Add comment explaining the fields
COMMENT ON COLUMN public.applications.document_verification_status IS 'Status of AI document verification: pending, verified, rejected, error';
COMMENT ON COLUMN public.applications.document_verification_result IS 'JSON object containing AI verification analysis including completeness, validity, and extracted information';
COMMENT ON COLUMN public.applications.document_verified_at IS 'Timestamp when document verification was completed';