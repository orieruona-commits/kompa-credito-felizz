import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/tukompa-logo.png";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast({
          title: "Error de inicio de sesión",
          description: "Credenciales incorrectas. Por favor, verifica tu email y contraseña.",
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Check if user has admin role
        const { data: roles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .eq("role", "admin")
          .single();

        if (roleError || !roles) {
          await supabase.auth.signOut();
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos de administrador.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Inicio de sesión exitoso",
          description: "Redirigiendo al panel de administración...",
        });

        navigate("/admin");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="tuKOMPA Logo" className="h-16 w-auto mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Panel de Administración</h1>
          </div>
          <p className="text-muted-foreground text-sm">Acceso restringido a administradores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tukompa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>🔒 Sitio protegido - Solo personal autorizado</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
