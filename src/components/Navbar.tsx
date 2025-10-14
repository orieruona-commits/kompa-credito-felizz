import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/tukompa-logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();
    
    setIsAdmin(!!data);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary backdrop-blur border-b border-primary-glow shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="tuKOMPA Logo" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary-glow rounded-md transition-colors text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-white hover:text-secondary transition-colors font-medium relative group"
            >
              Sobre Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              to="/terms" 
              className="text-white hover:text-secondary transition-colors font-medium relative group"
            >
              Términos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              to="/privacy" 
              className="text-white hover:text-secondary transition-colors font-medium relative group"
            >
              Privacidad
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              to="/complaints-book" 
              className="text-white hover:text-secondary transition-colors font-medium relative group"
            >
              Libro de Reclamaciones
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              to="/terminos-de-pago" 
              className="text-white hover:text-secondary transition-colors font-medium relative group"
            >
              Términos de Pago
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  variant="outline" 
                  size="sm"
                  className="bg-white text-primary border-white hover:bg-secondary hover:text-white hover:border-secondary"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mi Panel
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={() => navigate("/admin")} 
                    variant="outline" 
                    size="sm"
                    className="bg-secondary text-white border-secondary hover:bg-secondary/90"
                  >
                    Admin
                  </Button>
                )}
                <Button 
                  onClick={() => supabase.auth.signOut()} 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-primary-glow"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                size="sm"
                className="bg-secondary text-white hover:bg-secondary/90 font-semibold uppercase"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-primary border-t border-primary-glow shadow-lg z-50">
              <div className="flex flex-col space-y-1 p-4">
                <Link 
                  to="/about" 
                  className="text-white hover:bg-primary-glow transition-colors px-4 py-3 rounded font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  to="/terms" 
                  className="text-white hover:bg-primary-glow transition-colors px-4 py-3 rounded font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Términos
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-white hover:bg-primary-glow transition-colors px-4 py-3 rounded font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Privacidad
                </Link>
                <Link 
                  to="/complaints-book" 
                  className="text-white hover:bg-primary-glow transition-colors px-4 py-3 rounded font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Libro de Reclamaciones
                </Link>
                <Link 
                  to="/terminos-de-pago" 
                  className="text-white hover:bg-primary-glow transition-colors px-4 py-3 rounded font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Términos de Pago
                </Link>
                
                <div className="pt-2 border-t border-primary-glow mt-2">
                  {user ? (
                    <>
                      <Button 
                        onClick={() => { navigate("/dashboard"); setIsOpen(false); }} 
                        variant="outline" 
                        className="w-full justify-start mb-2 bg-white text-primary border-white hover:bg-secondary hover:text-white"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Mi Panel
                      </Button>
                      {isAdmin && (
                        <Button 
                          onClick={() => { navigate("/admin"); setIsOpen(false); }} 
                          variant="outline" 
                          className="w-full justify-start mb-2 bg-secondary text-white border-secondary hover:bg-secondary/90"
                        >
                          Panel Admin
                        </Button>
                      )}
                      <Button 
                        onClick={() => { supabase.auth.signOut(); setIsOpen(false); }} 
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-primary-glow"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => { navigate("/auth"); setIsOpen(false); }} 
                      className="w-full bg-secondary text-white hover:bg-secondary/90 font-semibold uppercase"
                    >
                      Iniciar Sesión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
