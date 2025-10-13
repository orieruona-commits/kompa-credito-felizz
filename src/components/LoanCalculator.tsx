import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoanCalculation {
  amount: number;
  term: number;
  paymentType: "monthly" | "single";
  monthlyPayment: number;
  totalPayment: number;
  tea: string;
  tcem: string;
}

export const LoanCalculator = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(2000);
  const [term, setTerm] = useState(6);
  const [paymentType, setPaymentType] = useState<"monthly" | "single">("monthly");
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simplified calculation - in production, this would be done by backend
    const interestRate = 0.15; // 15% annual rate
    const monthlyRate = interestRate / 12;
    
    let monthlyPayment: number;
    let totalPayment: number;
    
    if (paymentType === "monthly") {
      // Calculate monthly payment using amortization formula
      monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                      (Math.pow(1 + monthlyRate, term) - 1);
      totalPayment = monthlyPayment * term;
    } else {
      // Single payment with compound interest
      totalPayment = amount * Math.pow(1 + monthlyRate, term);
      monthlyPayment = totalPayment;
    }
    
    const tea = ((Math.pow(1 + monthlyRate, 12) - 1) * 100).toFixed(2);
    const tcem = (monthlyRate * 100).toFixed(2);
    
    setCalculation({
      amount,
      term,
      paymentType,
      monthlyPayment,
      totalPayment,
      tea,
      tcem
    });
  }, [amount, term, paymentType]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to auth page with return path
        navigate('/auth', { 
          state: { 
            from: '/',
            message: 'Debes iniciar sesión para solicitar un préstamo' 
          } 
        });
        setIsSubmitting(false);
        return;
      }

      // Create application record with "awaiting_fee" status
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: session.user.id,
          amount,
          term,
          payment_type: paymentType,
          status: 'awaiting_fee',
          email: session.user.email || '',
          phone: null,
          full_name: session.user.user_metadata?.full_name || null,
          dni: null
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to payment instructions page
      navigate('/payment-instructions', {
        state: {
          applicationData: {
            id: data.id,
            amount,
            term,
            paymentType
          }
        }
      });
    } catch (error: any) {
      toast.error('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-soft">
      <h3 className="text-2xl font-bold mb-6 text-foreground">
        Calcula tu préstamo
      </h3>
      
      <div className="space-y-6">
        {/* Amount Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm font-medium">¿Cuánto necesitas?</Label>
            <span className="text-2xl font-bold text-primary">
              S/ {amount.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[amount]}
            onValueChange={(values) => setAmount(values[0])}
            min={500}
            max={5000}
            step={100}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>S/ 500</span>
            <span>S/ 5,000</span>
          </div>
        </div>

        {/* Term Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm font-medium">¿En cuánto tiempo?</Label>
            <span className="text-lg font-bold text-primary">
              {term} {term === 1 ? "mes" : "meses"}
            </span>
          </div>
          <Slider
            value={[term]}
            onValueChange={(values) => setTerm(values[0])}
            min={1}
            max={12}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 mes</span>
            <span>12 meses</span>
          </div>
        </div>

        {/* Payment Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Tipo de pago</Label>
          <RadioGroup value={paymentType} onValueChange={(value: "monthly" | "single") => setPaymentType(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal cursor-pointer">
                Cuotas mensuales
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className="font-normal cursor-pointer">
                Pago único
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Results */}
        {calculation && (
          <div className="gradient-card rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {paymentType === "monthly" ? "Cuota mensual" : "Pago único"}
              </span>
              <span className="text-2xl font-bold text-primary">
                S/ {calculation.monthlyPayment.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total a pagar</span>
              <span className="font-semibold">S/ {calculation.totalPayment.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>TEA: {calculation.tea}%</span>
                <span>TCEM: {calculation.tcem}%</span>
              </div>
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Revisa tu oferta'}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          *Cálculo referencial. El monto final puede variar según evaluación crediticia.
        </p>
      </div>
    </Card>
  );
};
