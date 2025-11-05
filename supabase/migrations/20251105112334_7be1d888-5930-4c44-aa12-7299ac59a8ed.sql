-- Add new fields to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS employment_status TEXT,
ADD COLUMN IF NOT EXISTS monthly_income NUMERIC,
ADD COLUMN IF NOT EXISTS supporting_document_url TEXT;

-- Create storage bucket for loan documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('loan-documents', 'loan-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for loan documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'loan-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'loan-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all loan documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'loan-documents' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);