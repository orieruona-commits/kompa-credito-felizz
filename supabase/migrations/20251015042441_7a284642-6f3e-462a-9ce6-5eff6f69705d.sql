-- Fix RLS infinite recursion by using the security definer function
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add input validation constraints to applications table
ALTER TABLE public.applications
ADD CONSTRAINT amount_range CHECK (amount >= 500 AND amount <= 5000),
ADD CONSTRAINT term_range CHECK (term >= 1 AND term <= 12),
ADD CONSTRAINT payment_type_valid CHECK (payment_type IN ('monthly', 'single'));

-- Create validation trigger function
CREATE OR REPLACE FUNCTION public.validate_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate amount
  IF NEW.amount < 500 OR NEW.amount > 5000 THEN
    RAISE EXCEPTION 'El monto debe estar entre S/500 y S/5,000';
  END IF;
  
  -- Validate term
  IF NEW.term < 1 OR NEW.term > 12 THEN
    RAISE EXCEPTION 'El plazo debe estar entre 1 y 12 meses';
  END IF;
  
  -- Validate payment type
  IF NEW.payment_type NOT IN ('monthly', 'single') THEN
    RAISE EXCEPTION 'Tipo de pago inválido';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
CREATE TRIGGER validate_application_trigger
BEFORE INSERT OR UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.validate_application();