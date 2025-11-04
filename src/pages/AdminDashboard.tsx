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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, Search, Filter, MessageCircle, LogOut, Download } from "lucide-react";
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
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    checkAdminAccess();
  }, []);

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
    const exportData = filteredApplications.map(app => ({
      'Nombre': app.full_name || 'N/A',
      'Email': app.email,
      'Teléfono': app.phone || 'N/A',
      'Monto': app.amount,
      'Plazo (meses)': app.term,
      'Tipo de Pago': app.payment_type === 'monthly' ? 'Mensual' : 'Pago único',
      'Estado': getStatusLabel(app.status),
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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Todos
                </Button>
                <Button
                  variant={statusFilter === "awaiting_fee" ? "default" : "outline"}
                  onClick={() => setStatusFilter("awaiting_fee")}
                  size="sm"
                >
                  Pendientes
                </Button>
                <Button
                  variant={statusFilter === "processing" ? "default" : "outline"}
                  onClick={() => setStatusFilter("processing")}
                  size="sm"
                >
                  Confirmados
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Plazo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron solicitudes
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.full_name || "Sin nombre"}
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
                                Confirmar Pago
                              </Button>
                            )}
                            {app.status === "processing" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateApplicationStatus(app.id, "awaiting_fee")}
                                className="w-full"
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Marcar Pendiente
                              </Button>
                            )}
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-primary">Total Solicitudes</h3>
              <p className="text-3xl font-bold">{applications.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-600">Pendientes de Pago</h3>
              <p className="text-3xl font-bold">
                {applications.filter((a) => a.status === "awaiting_fee").length}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-green-600">Pagos Confirmados</h3>
              <p className="text-3xl font-bold">
                {applications.filter((a) => a.status === "processing").length}
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
