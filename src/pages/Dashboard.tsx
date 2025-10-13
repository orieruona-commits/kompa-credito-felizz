import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { Loader2, LogOut, FileText, CheckCircle, Clock, XCircle, Phone, Mail } from "lucide-react";

interface Application {
  id: string;
  amount: number;
  term: number;
  payment_type: string;
  status: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  dni: string | null;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  payment_method: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadApplications();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error("Error al cargar tus solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada exitosamente");
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      awaiting_fee: { label: "Esperando Pago", variant: "outline" },
      payment_confirmed: { label: "Pago Confirmado", variant: "secondary" },
      approved: { label: "Aprobado", variant: "default" },
      rejected: { label: "Rechazado", variant: "destructive" },
      disbursed: { label: "Desembolsado", variant: "default" },
    };

    const config = statusConfig[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "disbursed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "awaiting_fee":
      case "payment_confirmed":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Panel</h1>
              <p className="text-muted-foreground mt-1">
                Bienvenido, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/")} variant="outline">
                Solicitar Préstamo
              </Button>
              <Button onClick={handleSignOut} variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Contact Info Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                ¿Necesitas ayuda?
              </CardTitle>
              <CardDescription>
                Nuestro equipo está disponible para asistirte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:tukompaprestamo@gmail.com" className="text-primary hover:underline">
                  tukompaprestamo@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="https://wa.me/2348025626573" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  +234 802 562 6573 (WhatsApp)
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Mis Solicitudes</h2>
            
            {applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tienes solicitudes aún</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Solicita tu primer préstamo y comienza a construir tu historial
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Solicitar Préstamo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(application.status)}
                          <div>
                            <CardTitle className="text-xl">
                              {formatCurrency(application.amount)}
                            </CardTitle>
                            <CardDescription>
                              {application.term} {application.term === 1 ? "mes" : "meses"} • {application.payment_type === "monthly" ? "Pago Mensual" : "Pago Único"}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Fecha de solicitud:</span>
                          <p className="font-medium">{formatDate(application.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ID de solicitud:</span>
                          <p className="font-mono text-xs">{application.id.slice(0, 8)}...</p>
                        </div>
                      </div>

                      {application.status === "awaiting_fee" && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                            ⚠️ Acción Requerida
                          </p>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                            Para procesar tu solicitud, necesitas realizar el pago de la tarifa de procesamiento.
                          </p>
                          <Button
                            onClick={() => navigate("/payment-instructions", {
                              state: {
                                applicationData: {
                                  id: application.id,
                                  amount: application.amount,
                                  term: application.term,
                                  paymentType: application.payment_type,
                                }
                              }
                            })}
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            Ver Instrucciones de Pago
                          </Button>
                        </div>
                      )}

                      {application.status === "payment_confirmed" && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            ✓ Tu pago ha sido confirmado y tu solicitud está siendo revisada por nuestro equipo.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
