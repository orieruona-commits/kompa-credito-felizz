import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import * as XLSX from 'xlsx';
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, Search, MessageCircle, LogOut, Download, Bell, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Application {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  amount: number;
  term: number;
  status: string;
  created_at: string;
  payment_type: string;
  employment_status?: string | null;
  monthly_income?: number | null;
  dni?: string | null;
  loan_purpose?: string | null;
  address?: string | null;
  supporting_document_url?: string | null;
  document_verification_status?: string | null;
  document_verification_result?: any;
  document_verified_at?: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("pending");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to real-time updates for applications
    const channel = supabase
      .channel('admin-applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        (payload) => {
          console.log('Application change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newApp = payload.new as Application;
            if (newApp.status === 'submitted') {
              toast({
                title: "📩 Nueva Solicitud Recibida",
                description: `Solicitud de ${newApp.full_name || 'usuario'} por ${formatCurrency(newApp.amount)}`,
              });
            }
          }
          
          loadApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Acceso denegado",
          description: "Debes iniciar sesión como administrador",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error || !roles) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos de administrador",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadApplications();
    } catch (error) {
      navigate("/");
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Pago confirmado",
        description: "El solicitante será notificado.",
      });

      loadApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      navigate("/private-admin-2025");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      awaiting_fee: "outline",
      processing: "secondary",
      approved: "default",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      awaiting_fee: "Esperando Pago",
      processing: "Pago Confirmado",
      approved: "Aprobado",
      rejected: "Rechazado",
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: es });
  };

  const exportToExcel = () => {
    const getEmploymentLabel = (status?: string | null) => {
      const labels: Record<string, string> = {
        employed: 'Empleado',
        self_employed: 'Independiente',
        student: 'Estudiante',
        unemployed: 'Desempleado',
      };
      return status ? labels[status] || status : 'N/A';
    };

    const dataToExport = getFilteredApplications(activeTab);
    const exportData = dataToExport.map(app => ({
      'Nombre': app.full_name || 'N/A',
      'DNI': app.dni || 'N/A',
      'Email': app.email,
      'Teléfono': app.phone || 'N/A',
      'Dirección': app.address || 'N/A',
      'Monto': app.amount,
      'Estado Laboral': getEmploymentLabel(app.employment_status),
      'Ingreso Mensual': app.monthly_income || 'N/A',
      'Motivo del Préstamo': app.loan_purpose || 'N/A',
      'Plazo (meses)': app.term,
      'Tipo de Pago': app.payment_type === 'monthly' ? 'Mensual' : 'Pago único',
      'Estado': getStatusLabel(app.status),
      'Documento Adjunto': app.supporting_document_url ? 'Sí' : 'No',
      'Fecha': formatDate(app.created_at)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Solicitudes");
    
    const fileName = `tukompa-solicitudes-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Exportación exitosa",
      description: "Las solicitudes se han exportado a Excel correctamente.",
    });
  };

  const getFilteredApplications = (tabFilter: string) => {
    return applications.filter((app) => {
      const matchesSearch =
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);

      let matchesTab = false;
      if (tabFilter === "pending") {
        matchesTab = app.status === "awaiting_fee";
      } else if (tabFilter === "confirmed") {
        matchesTab = app.status === "processing";
      } else if (tabFilter === "submitted") {
        matchesTab = app.status === "submitted" || 
                     (app.full_name !== null && app.dni !== null && app.status === "processing");
      } else if (tabFilter === "approved") {
        matchesTab = app.status === "approved";
      } else if (tabFilter === "rejected") {
        matchesTab = app.status === "rejected";
      }

      return matchesSearch && matchesTab;
    });
  };

  const pendingApplications = getFilteredApplications("pending");
  const confirmedApplications = getFilteredApplications("confirmed");
  const submittedApplications = getFilteredApplications("submitted");
  const approvedApplications = getFilteredApplications("approved");
  const rejectedApplications = getFilteredApplications("rejected");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground">
                Gestiona las solicitudes de préstamo y confirma los pagos
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={exportToExcel}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar a Excel
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="pending" className="relative">
                  Pendientes
                  {pendingApplications.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {pendingApplications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmados
                  {confirmedApplications.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {confirmedApplications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="submitted">
                  Formularios
                  {submittedApplications.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600">
                      {submittedApplications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Aprobados</TabsTrigger>
                <TabsTrigger value="rejected">Rechazados</TabsTrigger>
              </TabsList>

              {["pending", "confirmed", "submitted", "approved", "rejected"].map((tab) => {
                const tabApplications = getFilteredApplications(tab);
                return (
                  <TabsContent key={tab} value={tab} className="mt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>DNI</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Plazo</TableHead>
                            <TableHead>Estado</TableHead>
                            {tab === "submitted" && <TableHead>Detalles</TableHead>}
                            <TableHead>Documento</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tabApplications.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                No hay solicitudes en esta categoría
                              </TableCell>
                            </TableRow>
                          ) : (
                            tabApplications.map((app) => (
                              <TableRow key={app.id}>
                                <TableCell className="font-medium">
                                  {app.full_name || "Sin nombre"}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {app.dni || "N/A"}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>{app.email}</div>
                                    {app.phone && (
                                      <div className="text-muted-foreground">{app.phone}</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {formatCurrency(app.amount)}
                                </TableCell>
                                <TableCell>{app.term} meses</TableCell>
                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                {tab === "submitted" && (
                                  <TableCell>
                                    <div className="text-xs space-y-1">
                                      <div><strong>Dirección:</strong> {app.address || "N/A"}</div>
                                      <div><strong>Empleo:</strong> {app.employment_status || "N/A"}</div>
                                      <div><strong>Ingreso:</strong> {app.monthly_income ? formatCurrency(app.monthly_income) : "N/A"}</div>
                                      <div><strong>Motivo:</strong> {app.loan_purpose?.substring(0, 50) || "N/A"}...</div>
                                    </div>
                                  </TableCell>
                                )}
                                <TableCell>
                                  {app.supporting_document_url ? (
                                    <div className="space-y-1">
                                      <a 
                                        href={app.supporting_document_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                      >
                                        <Eye className="w-3 h-3" />
                                        Ver
                                      </a>
                                      {app.document_verification_status && (
                                        <Badge 
                                          variant={
                                            app.document_verification_status === 'verified' ? 'default' :
                                            app.document_verification_status === 'rejected' ? 'destructive' :
                                            'secondary'
                                          }
                                          className="text-xs"
                                        >
                                          {app.document_verification_status === 'verified' ? '✓' :
                                           app.document_verification_status === 'rejected' ? '✗' :
                                           '⏳'}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Sin doc</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(app.created_at)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-2">
                                    {app.status === "awaiting_fee" && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateApplicationStatus(app.id, "processing")}
                                        className="w-full"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Confirmar
                                      </Button>
                                    )}
                                    {app.status === "processing" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateApplicationStatus(app.id, "awaiting_fee")}
                                          className="w-full"
                                        >
                                          <Clock className="w-4 h-4 mr-1" />
                                          Pendiente
                                        </Button>
                                      </>
                                    )}
                                    {app.status === "submitted" && (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => updateApplicationStatus(app.id, "approved")}
                                          className="w-full"
                                        >
                                          Aprobar
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => updateApplicationStatus(app.id, "rejected")}
                                          className="w-full"
                                        >
                                          Rechazar
                                        </Button>
                                      </>
                                    )}
                                    {app.phone && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        asChild
                                        className="w-full"
                                      >
                                        <a
                                          href={`https://wa.me/${app.phone?.replace(/\D/g, '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <MessageCircle className="w-4 h-4 mr-1" />
                                          WhatsApp
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-2 text-primary flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Total
              </h3>
              <p className="text-3xl font-bold">{applications.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-2 text-yellow-600">Pendientes</h3>
              <p className="text-3xl font-bold">{pendingApplications.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-2 text-blue-600">Confirmados</h3>
              <p className="text-3xl font-bold">{confirmedApplications.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-2 text-green-600">Formularios</h3>
              <p className="text-3xl font-bold">{submittedApplications.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-2 text-purple-600">Aprobados</h3>
              <p className="text-3xl font-bold">{approvedApplications.length}</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
