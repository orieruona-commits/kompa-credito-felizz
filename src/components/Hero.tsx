import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";
import logo from "@/assets/tukompa-logo.png";

export const Hero = () => {
  const scrollToCalculator = () => {
    const calculator = document.getElementById('loan-calculator');
    calculator?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <img 
                src={logo} 
                alt="tuKOMPA Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-3xl font-semibold text-secondary">
              Tu crédito rápido y seguro
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Préstamos rápidos y fáciles de hasta{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                S/5,000 en minutos
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-secondary">
              Obtén hasta S/ 5,000 en minutos. 100% online, sin papeleos, con las mejores tasas del mercado. 
              ¡Tu kompa de confianza!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="text-base px-10 py-6 bg-secondary hover:bg-secondary/90 text-white font-bold uppercase shadow-lg hover:shadow-xl transition-all"
                onClick={scrollToCalculator}
              >
                ¡Solicita Ahora!
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-10 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Más Información
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="font-medium text-foreground">Sin aval</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="font-medium text-foreground">Aprobación inmediata</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="font-medium text-foreground">100% seguro</span>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
            <img 
              src={heroImage} 
              alt="Préstamos personales rápidos y seguros en Perú" 
              className="relative w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
