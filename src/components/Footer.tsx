import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/tukompa-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img src={logo} alt="tuKOMPA Logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-white/80 mb-4 font-secondary">
              Tu crédito rápido y seguro. Tu kompa de confianza para préstamos personales en Perú.
            </p>
            <div className="text-sm text-white/70">
              <p className="font-semibold">RUC: 20612345678</p>
              <p className="mt-1">tuKOMPA SAC</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-white/80 hover:text-secondary transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-white/80 hover:text-secondary transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="/#contacto" className="text-white/80 hover:text-secondary transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/complaints-book" className="text-white/80 hover:text-secondary transition-colors">
                  Libro de Reclamaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-white/80 hover:text-secondary transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white/80 hover:text-secondary transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/complaints-book" className="text-white/80 hover:text-secondary transition-colors">
                  Libro de Reclamaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                <a href="mailto:tukompaprestamo@gmail.com" className="text-white/90 hover:text-secondary transition-colors">
                  tukompaprestamo@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                <p className="text-white/80">
                  Av. Javier Prado Este 123<br />
                  San Isidro, Lima, Perú
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/70">
          <p>© {new Date().getFullYear()} tuKOMPA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
