import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, LogOut, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoanDetailsForm from "./LoanDetailsForm";
import type { User } from "@supabase/supabase-js";

interface Application {
  id: string;
  status: string;
  amount: number;
  term: number;
  payment_type: string;
  created_at: string;
  full_name: string | null;
}

const MiCuenta = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Subscribe to realtime updates for the user's application
    const channel = supabase
      .channel('application-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Application updated:', payload);
          const updatedApp = payload.new as Application;
          setApplication(updatedApp);
          
          // Show toast when payment is confirmed
          if (updatedApp.status === 'processing') {
            toast({
              title: "¡Pago confirmado!",
              description: "Tu pago ha sido confirmado. Ahora puedes completar los detalles de tu préstamo.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const checkAuth = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        toast({
          title: "Acceso denegado",
          description: "Debes iniciar sesión para acceder",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUser(currentUser);
      loadApplication(currentUser.id);
    } catch (error) {
      console.error("Error checking auth:", error);
      navigate("/auth");
    }
  };

  const loadApplication = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setApplication(data);
    } catch (error) {
      console.error("Error loading application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; icon: any; color: string }> = {
      awaiting_fee: {
        label: "Esperando Confirmación de Pago",
        icon: Clock,
        color: "text-yellow-600",
      },
      processing: {
        label: "Pago Confirmado",
        icon: CheckCircle,
        color: "text-green-600",
      },
      approved: {
        label: "Aprobado",
        icon: CheckCircle,
        color: "text-green-600",
      },
      rejected: {
        label: "Rechazado",
        icon: AlertCircle,
        color: "text-red-600",
      },
    };
    return statusMap[status] || statusMap.awaiting_fee;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8">
              <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
              <Alert>
                <AlertDescription>
                  No tienes ninguna solicitud de préstamo registrada.
                  Por favor, completa el formulario en la página principal.
                </AlertDescription>
              </Alert>
              <div className="mt-6 flex gap-4">
                <Button onClick={() => navigate("/")}>
                  Ir a la página principal
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.status);
  const StatusIcon = statusInfo.icon;
  const canFillDetails = application.status === "processing";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Mi Portal de Préstamo</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
              <div>
                <h2 className="text-xl font-semibold">Estado de tu Solicitud</h2>
                <Badge variant="outline" className="mt-1">
                  {statusInfo.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Monto solicitado:</strong> S/ {application.amount}</p>
              <p><strong>Plazo:</strong> {application.term} meses</p>
              <p><strong>Tipo de pago:</strong> {application.payment_type === "monthly" ? "Mensual" : "Pago único"}</p>
            </div>

            {application.status === "awaiting_fee" && (
              <Alert className="mt-4">
                <AlertDescription>
                  ⏳ Estamos esperando la confirmación de tu pago de ₱65 soles.
                  Una vez confirmado, podrás completar los detalles de tu solicitud.
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {canFillDetails && (
            <>
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✅ Tu pago ha sido confirmado. Por favor, completa los detalles de tu préstamo a continuación.
                </AlertDescription>
              </Alert>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  Detalles de Solicitud
                </h2>
                <LoanDetailsForm applicationId={application.id} />
              </Card>
            </>
          )}

          {application.status === "approved" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                🎉 ¡Felicitaciones! Tu préstamo ha sido aprobado.
                Nos pondremos en contacto contigo pronto.
              </AlertDescription>
            </Alert>
          )}

          {application.status === "rejected" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Lo sentimos, tu solicitud no pudo ser aprobada en este momento.
                Por favor, contacta con nosotros para más información.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MiCuenta;
