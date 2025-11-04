import { Card } from "@/components/ui/card";
import { FileText, CreditCard, CheckCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: FileText,
      title: "Completa el formulario",
      description: "Llena tus datos en nuestro formulario de solicitud de préstamo de forma rápida y sencilla."
    },
    {
      number: "2",
      icon: CreditCard,
      title: "Pago de verificación de S/65",
      description: "Realiza el pago de verificación por WhatsApp para confirmar tu solicitud."
    },
    {
      number: "3",
      icon: CheckCircle,
      title: "Espera la aprobación",
      description: "Nuestro equipo revisará tu solicitud y te contactará para la aprobación final."
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Obtén tu préstamo en 3 simples pasos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-8 hover:shadow-soft transition-smooth text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <div className="mb-6 mt-4 flex justify-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
