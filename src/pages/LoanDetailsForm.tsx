import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const loanDetailsSchema = z.object({
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  dni: z.string().min(8, "DNI debe tener al menos 8 caracteres").max(20),
  phone: z.string().min(9, "Teléfono debe tener al menos 9 dígitos").max(15),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres").max(200),
  amount: z.number().min(500, "El monto mínimo es S/500").max(5000, "El monto máximo es S/5,000"),
  employment_status: z.enum(["employed", "self_employed", "student", "unemployed"], {
    required_error: "Selecciona un estado laboral",
  }),
  monthly_income: z.number().min(0, "El ingreso mensual debe ser mayor a 0"),
  loan_purpose: z.string().min(10, "El motivo debe tener al menos 10 caracteres").max(500),
  email: z.string().email("Correo electrónico inválido").max(255),
  preferred_contact_method: z.enum(["whatsapp", "email"], {
    required_error: "Selecciona un método de contacto",
  }),
});

type LoanDetailsForm = z.infer<typeof loanDetailsSchema>;

const LoanDetailsForm = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("id");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanDetailsForm>({
    resolver: zodResolver(loanDetailsSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El archivo no debe superar los 5MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedFile(file);
    }
  };

  const onSubmit = async (data: LoanDetailsForm) => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "No se encontró el ID de la solicitud. Por favor, contacta con soporte.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let documentUrl = null;

      // Upload file if provided
      if (uploadedFile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${user.id}/${applicationId}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('loan-documents')
          .upload(fileName, uploadedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('loan-documents')
          .getPublicUrl(fileName);
        
        documentUrl = publicUrl;
      }

      // Update application with loan details
      const { error: updateError } = await supabase
        .from("applications")
        .update({
          full_name: data.full_name,
          dni: data.dni,
          phone: data.phone,
          address: data.address,
          amount: data.amount,
          employment_status: data.employment_status,
          monthly_income: data.monthly_income,
          loan_purpose: data.loan_purpose,
          email: data.email,
          preferred_contact_method: data.preferred_contact_method,
          supporting_document_url: documentUrl,
          status: "pending_review",
        })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      // If document was uploaded, verify it with AI
      if (documentUrl) {
        setIsVerifying(true);
        toast({
          title: "Verificando documento...",
          description: "Nuestro sistema AI está analizando su documento de respaldo.",
        });

        const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-document", {
          body: {
            documentUrl,
            applicationId,
          },
        });

        setIsVerifying(false);

        if (verifyError) {
          console.warn("Document verification failed:", verifyError);
          toast({
            title: "Advertencia",
            description: "No se pudo verificar automáticamente el documento. Será revisado manualmente por nuestro equipo.",
            variant: "default",
          });
        } else if (verifyData?.result) {
          setVerificationResult(verifyData.result);
          
          if (verifyData.status === 'verified') {
            toast({
              title: "✓ Documento verificado",
              description: "Su documento ha sido verificado exitosamente por nuestro sistema AI.",
            });
          } else if (verifyData.status === 'rejected') {
            toast({
              title: "Documento requiere revisión",
              description: "Su documento necesita verificación manual. Nuestro equipo lo revisará pronto.",
              variant: "default",
            });
          }
        }
      }

      // Send notification to admin
      const { error: notificationError } = await supabase.functions.invoke("send-loan-details-notification", {
        body: {
          applicationId,
          ...data,
          supporting_document_url: documentUrl,
        },
      });

      if (notificationError) {
        console.warn("Notification failed, but data was saved:", notificationError);
      }

      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Enlace Inválido</CardTitle>
            <CardDescription>
              Este enlace no es válido. Por favor, contacta con nuestro equipo para obtener el enlace correcto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">🎉 ¡Gracias!</CardTitle>
            <CardDescription className="text-base mt-4">
              Su solicitud de préstamo está ahora completa. El equipo de TuKompa revisará sus detalles y se pondrá en contacto con usted en breve.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Recibirá una notificación por {" "}
                <span className="font-semibold text-foreground">
                  {searchParams.get("contact") === "whatsapp" ? "WhatsApp" : "correo electrónico"}
                </span>
                {" "} en las próximas 24-48 horas.
              </p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="tuKOMPA Logo" 
            className="h-16 mx-auto mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            ✅ Pago Confirmado
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete los detalles de su préstamo
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Gracias por confirmar su pago. Complete la siguiente información para procesar su solicitud.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Préstamo</CardTitle>
            <CardDescription>
              Todos los campos son obligatorios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo *</Label>
                  <Input
                    id="full_name"
                    placeholder="Ej: Juan Pérez García"
                    {...register("full_name")}
                    className={errors.full_name ? "border-destructive" : ""}
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dni">DNI / Documento de Identidad *</Label>
                  <Input
                    id="dni"
                    placeholder="Ej: 12345678"
                    {...register("dni")}
                    className={errors.dni ? "border-destructive" : ""}
                  />
                  {errors.dni && (
                    <p className="text-sm text-destructive">{errors.dni.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ej: 987654321"
                    {...register("phone")}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ej: juan@ejemplo.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  placeholder="Ej: Av. Principal 123, Lima"
                  {...register("address")}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto Solicitado (S/) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="500"
                  max="5000"
                  step="50"
                  placeholder="Ej: 1500"
                  {...register("amount", { valueAsNumber: true })}
                  className={errors.amount ? "border-destructive" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Monto entre S/500 y S/5,000
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employment_status">Estado Laboral *</Label>
                  <select
                    id="employment_status"
                    {...register("employment_status")}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.employment_status ? "border-destructive" : ""
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="employed">Empleado</option>
                    <option value="self_employed">Independiente</option>
                    <option value="student">Estudiante</option>
                    <option value="unemployed">Desempleado</option>
                  </select>
                  {errors.employment_status && (
                    <p className="text-sm text-destructive">{errors.employment_status.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Ingreso Mensual (S/) *</Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    min="0"
                    step="50"
                    placeholder="Ej: 2000"
                    {...register("monthly_income", { valueAsNumber: true })}
                    className={errors.monthly_income ? "border-destructive" : ""}
                  />
                  {errors.monthly_income && (
                    <p className="text-sm text-destructive">{errors.monthly_income.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan_purpose">Motivo del Préstamo *</Label>
                <Textarea
                  id="loan_purpose"
                  placeholder="Describa brevemente para qué utilizará el préstamo"
                  rows={4}
                  {...register("loan_purpose")}
                  className={errors.loan_purpose ? "border-destructive" : ""}
                />
                {errors.loan_purpose && (
                  <p className="text-sm text-destructive">{errors.loan_purpose.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Método de Contacto Preferido *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="whatsapp"
                      {...register("preferred_contact_method")}
                      className="w-4 h-4"
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      {...register("preferred_contact_method")}
                      className="w-4 h-4"
                    />
                    <span>Email</span>
                  </label>
                </div>
                {errors.preferred_contact_method && (
                  <p className="text-sm text-destructive">{errors.preferred_contact_method.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supporting_document">Documento de Respaldo (Opcional)</Label>
                <Input
                  id="supporting_document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Máximo 5MB. Formatos: PDF, JPG, PNG, DOC, DOCX
                </p>
                {uploadedFile && (
                  <p className="text-sm text-primary">
                    ✓ Archivo seleccionado: {uploadedFile.name}
                  </p>
                )}
              </div>

              {verificationResult && (
                <div className={`p-4 rounded-lg border ${
                  verificationResult.recommendation === 'approve' 
                    ? 'bg-green-50 border-green-200' 
                    : verificationResult.recommendation === 'reject'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <h4 className="font-semibold mb-2">
                    {verificationResult.recommendation === 'approve' ? '✓ Documento Verificado' : '⚠ Resultado de Verificación'}
                  </h4>
                  <p className="text-sm mb-2">{verificationResult.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    Confianza: {verificationResult.confidence}% | Tipo: {verificationResult.documentType}
                  </p>
                  {verificationResult.findings?.concerns?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold">Observaciones:</p>
                      <ul className="text-xs list-disc list-inside">
                        {verificationResult.findings.concerns.map((concern: string, idx: number) => (
                          <li key={idx}>{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || isVerifying}
              >
                {isSubmitting || isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isVerifying ? 'Verificando documento...' : 'Enviando...'}
                  </>
                ) : (
                  "Enviar Solicitud"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda?{" "}
            <a
              href="https://wa.me/2348025626573?text=Hola%20tuKOMPA%2C%20necesito%20ayuda%20con%20mi%20pr%C3%A9stamo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Contáctanos por WhatsApp
            </a>
          </p>
        </div>
      </div>
      <FloatingWhatsApp />
    </div>
  );
};

export default LoanDetailsForm;