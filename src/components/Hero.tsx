import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Tu préstamo personal,{" "}
              <span className="text-primary">
                rápido y seguro
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Obtén hasta S/ 5,000 en minutos. 100% online, sin papeleos, con las mejores tasas del mercado. 
              ¡Tu kompa de confianza!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8">
                ¡A un clic de distancia!
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Más información
              </Button>
            </div>
            
            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Sin aval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Aprobación inmediata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>100% seguro</span>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Préstamos personales rápidos y seguros en Perú" 
              className="w-full h-auto rounded-2xl shadow-soft"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
