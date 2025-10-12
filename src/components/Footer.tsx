import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="font-bold text-xl">TuKompa</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tu kompa de confianza para préstamos personales rápidos y seguros en Perú.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">RUC: 20612345678</p>
              <p className="mt-1">TuKompa SAC</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-muted-foreground hover:text-primary transition-smooth">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="/#contacto" className="text-muted-foreground hover:text-primary transition-smooth">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/complaints-book" className="text-muted-foreground hover:text-primary transition-smooth">
                  Libro de Reclamaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="/complaints-book" className="text-muted-foreground hover:text-primary transition-smooth">
                  Libro de reclamaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">+234 802 562 6573</p>
                  <p className="text-xs text-muted-foreground">Lun - Vie: 9am - 6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="mailto:tukompaprestamo@gmail.com" className="text-muted-foreground hover:text-primary transition-smooth">
                  tukompaprestamo@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground">
                  Av. Javier Prado Este 123<br />
                  San Isidro, Lima, Perú
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TuKompa SAC. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
