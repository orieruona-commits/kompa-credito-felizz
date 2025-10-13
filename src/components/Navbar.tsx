import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span>TuKompa</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/terms" className="text-foreground hover:text-primary transition-colors">
              Términos
            </Link>
            <Link to="/privacy" className="text-foreground hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link to="/complaints-book" className="text-foreground hover:text-primary transition-colors">
              Libro de Reclamaciones
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button onClick={() => navigate("/dashboard")} variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Mi Panel
                </Button>
                <Button onClick={() => supabase.auth.signOut()} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm">
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg z-50">
              <div className="flex flex-col space-y-4 p-4">
                <Link 
                  to="/about" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  to="/terms" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Términos
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Privacidad
                </Link>
                <Link 
                  to="/complaints-book" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Libro de Reclamaciones
                </Link>
                
                {user ? (
                  <>
                    <Button 
                      onClick={() => { navigate("/dashboard"); setIsOpen(false); }} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mi Panel
                    </Button>
                    <Button 
                      onClick={() => { supabase.auth.signOut(); setIsOpen(false); }} 
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => { navigate("/auth"); setIsOpen(false); }} 
                    className="w-full"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
