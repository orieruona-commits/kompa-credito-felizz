import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Heart, Shield, Users } from "lucide-react";

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: "Seguridad",
      description: "Protegemos tus datos con los más altos estándares de seguridad y encriptación."
    },
    {
      icon: Heart,
      title: "Compromiso",
      description: "Estamos comprometidos con tu bienestar financiero y tu tranquilidad."
    },
    {
      icon: Users,
      title: "Cercanía",
      description: "Somos tu kompa de confianza, siempre disponibles cuando nos necesites."
    },
    {
      icon: Target,
      title: "Transparencia",
      description: "Sin letra chica ni sorpresas. Todo claro desde el primer momento."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre TuKompa
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Somos una empresa peruana dedicada a facilitar el acceso a préstamos personales 
                de manera rápida, segura y 100% digital. Tu aliado financiero de confianza.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  Nuestra Misión
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Democratizar el acceso a servicios financieros en Perú, ofreciendo préstamos 
                  personales de forma rápida, transparente y accesible para todos los peruanos 
                  que necesitan apoyo financiero inmediato.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  Nuestra Visión
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la plataforma líder de préstamos personales en Perú, reconocida por 
                  nuestra tecnología, transparencia y compromiso con el bienestar financiero 
                  de nuestros clientes.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nuestros Valores
              </h2>
              <p className="text-lg text-muted-foreground">
                Los principios que guían nuestro trabajo cada día
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-soft transition-smooth">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Información de la Empresa</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-semibold">Razón Social:</span>
                    <span className="text-muted-foreground">TuKompa SAC</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-semibold">RUC:</span>
                    <span className="text-muted-foreground">20612345678</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-semibold">Dirección:</span>
                    <span className="text-muted-foreground text-right">
                      Av. Javier Prado Este 123, San Isidro, Lima, Perú
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-semibold">Email:</span>
                    <span className="text-muted-foreground">tukompaprestamo@gmail.com</span>
                  </div>
                  
                  <div className="flex justify-between py-3">
                    <span className="font-semibold">Año de fundación:</span>
                    <span className="text-muted-foreground">2023</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
