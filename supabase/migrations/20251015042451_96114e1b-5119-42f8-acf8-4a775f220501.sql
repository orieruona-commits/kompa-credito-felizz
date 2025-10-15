-- Fix function search path for validate_application
CREATE OR REPLACE FUNCTION public.validate_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;