import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, MessageCircle, CreditCard, Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const PaymentInstructions = () => {
  const location = useLocation();
  const applicationData = location.state?.applicationData;
  
  const phoneNumber = "+2348025626573";
  const userName = applicationData?.full_name || "[Nombre completo]";
  const message = encodeURIComponent(
    `Hola, acabo de enviar mi solicitud en tuKOMPA y deseo realizar el pago de verificación de 65 soles. Mi nombre es ${userName}.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Tu solicitud ha sido recibida
            </h1>
            <p className="text-xl text-muted-foreground">
              Para continuar, realiza un pago de verificación de 65 soles
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-primary">
                  Pago de Verificación: S/65
                </h2>
                <p className="text-muted-foreground">
                  Este pago es necesario para validar tus datos y procesar tu solicitud de préstamo.
                </p>
              </div>
            </div>

            <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-primary">
                <MessageCircle className="w-5 h-5 text-secondary" />
                Instrucciones de Pago
              </h3>
              
              <div className="bg-background rounded-lg p-6">
                <p className="text-lg font-semibold mb-3 text-primary">
                  Contáctanos por WhatsApp para recibir los detalles de cuenta
                </p>
                <p className="text-muted-foreground mb-4">
                  Por tu seguridad y privacidad, los detalles bancarios se envían únicamente 
                  por WhatsApp. Haz clic en el botón de abajo para contactarnos y recibirás 
                  de inmediato la información necesaria para realizar tu pago.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Proceso 100% seguro y verificado</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5 text-secondary" />
                Pasos a Seguir
              </h3>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Haz clic en el botón de WhatsApp para contactarnos</li>
                <li>Recibirás los detalles de cuenta para realizar el pago de S/65</li>
                <li>Realiza el pago mediante Yape, Plin o transferencia bancaria</li>
                <li>Guarda el comprobante de pago (captura de pantalla)</li>
                <li>Envíanos el comprobante por WhatsApp para confirmar tu pago</li>
              </ol>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-6"
            >
              <Button size="lg" className="w-full text-lg h-16 text-base">
                <MessageCircle className="w-6 h-6 mr-2" />
                Contactar por WhatsApp para Detalles de Pago
              </Button>
            </a>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  🟡
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">Estado: Esperando confirmación de pago</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Una vez confirmado tu pago, cambiaremos el estado a "Pago Confirmado" 
                    y procesaremos tu préstamo en un plazo de 24 a 48 horas.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-2">¿Tienes dudas?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Si necesitas ayuda o tienes preguntas sobre el proceso de pago, contáctanos:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild>
                <a href="mailto:tukompaprestamo@gmail.com">
                  Enviar email
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentInstructions;
