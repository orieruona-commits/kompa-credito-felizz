import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "María González",
      location: "Lima, Perú",
      rating: 5,
      text: "Excelente servicio. Solicité S/2,000 para un imprevisto y el proceso fue súper rápido. Me aprobaron en menos de 10 minutos. ¡Totalmente recomendado!",
      date: "Hace 2 semanas"
    },
    {
      name: "Carlos Mendoza",
      location: "Arequipa, Perú",
      rating: 5,
      text: "La mejor experiencia en préstamos online. Todo claro, sin letra chica, y el equipo de soporte muy atento. Pagué antes de tiempo sin penalidad.",
      date: "Hace 1 mes"
    },
    {
      name: "Rosa Fernández",
      location: "Cusco, Perú",
      rating: 5,
      text: "Necesitaba dinero urgente para un tratamiento médico. TuKompa me ayudó rápido y sin complicaciones. Muy agradecida con el servicio.",
      date: "Hace 3 semanas"
    },
    {
      name: "Juan Pérez",
      location: "Trujillo, Perú",
      rating: 5,
      text: "Proceso 100% digital y seguro. No tuve que ir a ninguna oficina. Todo desde mi celular. Las cuotas son justas y accesibles.",
      date: "Hace 1 semana"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de peruanos confían en TuKompa para sus préstamos personales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-soft transition-smooth">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                <p className="text-xs text-muted-foreground mt-1">{testimonial.date}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            ⭐ 4.9/5 basado en más de 1,500 reseñas verificadas
          </p>
        </div>
      </div>
    </section>
  );
};
