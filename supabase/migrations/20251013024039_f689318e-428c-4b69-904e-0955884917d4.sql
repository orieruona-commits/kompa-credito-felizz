-- Fix security issues: Remove NULL user_id records and update RLS policies

-- Step 1: Delete applications with NULL user_id (test data before auth was implemented)
DELETE FROM public.payments 
WHERE application_id IN (
  SELECT id FROM public.applications WHERE user_id IS NULL
);

DELETE FROM public.applications 
WHERE user_id IS NULL;

-- Step 2: Make user_id NOT NULL
ALTER TABLE public.applications 
  ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Drop old insecure policies
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can create applications" ON public.applications;

-- Step 4: Create secure RLS policies - users must be authenticated
CREATE POLICY "Authenticated users can create their own applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 5: Update payments policies to ensure they're secure
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can create payments" ON public.payments;

CREATE POLICY "Authenticated users can create payments"
  ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = payments.application_id
        AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = payments.application_id
        AND applications.user_id = auth.uid()
    )
  );