import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TerminosDePago = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-background to-secondary/20 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              🧾 Términos y Condiciones de Pago
            </h1>
            <p className="text-xl text-muted-foreground">
              Información importante sobre el pago de verificación
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                En <span className="font-bold text-primary">tuKOMPA</span>, todos los solicitantes deben realizar un{" "}
                <span className="font-semibold text-secondary">pago de verificación de 65 soles</span> antes de procesar su solicitud de préstamo.
              </p>

              <div className="space-y-6 my-8">
                <div className="flex items-start gap-4 bg-muted/50 p-6 rounded-lg">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Validación y Seguridad</h3>
                    <p className="text-muted-foreground">
                      Este pago se utiliza para validar los datos del solicitante y prevenir fraudes, 
                      asegurando un proceso transparente y confiable para todos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-muted/50 p-6 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Privacidad de Datos Bancarios</h3>
                    <p className="text-muted-foreground">
                      Los detalles bancarios se envían únicamente por WhatsApp para mayor seguridad. 
                      Nunca compartimos esta información públicamente en el sitio web.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-muted/50 p-6 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Comprobante de Pago</h3>
                    <p className="text-muted-foreground">
                      Una vez realizado el pago, debe enviarse el comprobante de pago por WhatsApp 
                      al número oficial de tuKOMPA para su verificación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-muted/50 p-6 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Proceso de Verificación</h3>
                    <p className="text-muted-foreground">
                      Tras la verificación del pago, el solicitante recibirá una confirmación 
                      y se procederá con el análisis de crédito de manera inmediata.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8">
                <h3 className="font-semibold text-lg mb-3">
                  ¿Tienes dudas sobre el proceso de pago?
                </h3>
                <p className="text-muted-foreground mb-4">
                  En caso de cualquier duda, contáctenos en{" "}
                  <a href="mailto:tukompaprestamo@gmail.com" className="text-primary hover:underline font-semibold">
                    tukompaprestamo@gmail.com
                  </a>{" "}
                  o por nuestro WhatsApp oficial.
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <a
                    href="https://wa.me/+2348025626573"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>

              <p className="text-center text-lg font-semibold text-primary mt-8">
                Gracias por confiar en tuKOMPA, su aliado en préstamos personales seguros y confiables.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TerminosDePago;
