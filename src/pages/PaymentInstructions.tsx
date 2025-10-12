import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, MessageCircle, CreditCard, Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const PaymentInstructions = () => {
  const location = useLocation();
  const applicationData = location.state?.applicationData;
  
  const phoneNumber = "2348025626573";
  const userName = applicationData?.full_name || "[Nombre completo]";
  const message = encodeURIComponent(
    `Hola, ya realicé mi pago de tasa de evaluación para mi préstamo. Mi nombre es ${userName}.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Realiza tu pago de evaluación
            </h1>
            <p className="text-xl text-muted-foreground">
              Para procesar tu préstamo, es necesario completar el siguiente paso
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Tasa de Evaluación: S/30
                </h2>
                <p className="text-muted-foreground">
                  Este pago es necesario para procesar y evaluar tu solicitud de préstamo.
                </p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Métodos de Pago Disponibles
              </h3>
              
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold mb-2">Yape o Plin</p>
                  <p className="text-sm text-muted-foreground">Número: +234 802 562 6573</p>
                </div>
                
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold mb-2">Transferencia Bancaria</p>
                  <p className="text-sm text-muted-foreground">Banco: BCP</p>
                  <p className="text-sm text-muted-foreground">Cuenta: 194-XXXXXXX-X-XX</p>
                  <p className="text-sm text-muted-foreground">Titular: TuKompa SAC</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Pasos a Seguir
              </h3>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Realiza el pago de S/30 mediante cualquiera de los métodos indicados</li>
                <li>Guarda el comprobante de pago (captura de pantalla)</li>
                <li>Haz clic en el botón de abajo para confirmar tu pago por WhatsApp</li>
                <li>Envíanos el comprobante por WhatsApp</li>
              </ol>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" className="w-full text-lg h-14">
                <MessageCircle className="w-6 h-6 mr-2" />
                Confirmar pago por WhatsApp
              </Button>
            </a>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Una vez confirmado tu pago, tu solicitud será evaluada en un plazo de 24 a 48 horas.
            </p>
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
