import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LoanCalculator } from "@/components/LoanCalculator";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Calculator Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <LoanCalculator />
            </div>
          </div>
        </section>

        <Features />

        {/* Partners Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Nuestros aliados de confianza
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <div className="text-4xl font-bold text-muted-foreground">VISA</div>
              <div className="text-4xl font-bold text-muted-foreground">Mastercard</div>
              <div className="text-4xl font-bold text-muted-foreground">BCP</div>
              <div className="text-4xl font-bold text-muted-foreground">Interbank</div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section id="faq" className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Preguntas frecuentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Todo lo que necesitas saber sobre nuestros préstamos
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="bg-background p-6 rounded-lg shadow-card">
                <summary className="font-semibold cursor-pointer">
                  ¿Cuáles son los requisitos para solicitar un préstamo?
                </summary>
                <p className="mt-3 text-muted-foreground">
                  Solo necesitas ser mayor de 18 años, tener DNI peruano vigente, y contar con un ingreso mensual verificable. ¡Así de simple!
                </p>
              </details>
              <details className="bg-background p-6 rounded-lg shadow-card">
                <summary className="font-semibold cursor-pointer">
                  ¿Cuánto tiempo demora la aprobación?
                </summary>
                <p className="mt-3 text-muted-foreground">
                  La aprobación es inmediata. Una vez completada tu solicitud, recibirás una respuesta en minutos. El desembolso se realiza en 24 horas hábiles.
                </p>
              </details>
              <details className="bg-background p-6 rounded-lg shadow-card">
                <summary className="font-semibold cursor-pointer">
                  ¿Puedo pagar antes de tiempo?
                </summary>
                <p className="mt-3 text-muted-foreground">
                  ¡Por supuesto! Puedes pagar tu préstamo antes de tiempo sin penalidades. Además, te beneficiarás de un descuento en los intereses.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Necesitas ayuda?
              </h2>
              <p className="text-lg text-muted-foreground">
                Estamos aquí para ti. Contáctanos por tu canal preferido.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              <a href="tel:+51999888777" className="p-6 border rounded-lg hover:shadow-soft transition-smooth text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Teléfono</h3>
                <p className="text-muted-foreground">+51 999 888 777</p>
              </a>
              
              <a href="mailto:hola@tukompa.com" className="p-6 border rounded-lg hover:shadow-soft transition-smooth text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">hola@tukompa.com</p>
              </a>
              
              <a href={`https://wa.me/51999888777?text=${encodeURIComponent("Hola, necesito información sobre préstamos")}`} target="_blank" rel="noopener noreferrer" className="p-6 border rounded-lg hover:shadow-soft transition-smooth text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-muted-foreground">Chat directo</p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
