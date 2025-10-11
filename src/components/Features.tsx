import { Clock, Shield, Smartphone, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Aprobación en minutos",
      description: "Respuesta inmediata a tu solicitud. Sin esperas, sin complicaciones.",
    },
    {
      icon: Smartphone,
      title: "100% online",
      description: "Todo el proceso desde tu celular o computadora. Sin salir de casa.",
    },
    {
      icon: Shield,
      title: "Totalmente seguro",
      description: "Tus datos protegidos con encriptación de última generación.",
    },
    {
      icon: CheckCircle,
      title: "Sin papeleos",
      description: "Solo necesitas tu DNI y un par de datos. Así de simple.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por qué elegir TuKompa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos tu mejor aliado financiero. Simple, rápido y confiable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-soft transition-smooth">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
