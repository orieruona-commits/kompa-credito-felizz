import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ComplaintsBook = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "reclamo",
    fullName: "",
    documentType: "DNI",
    documentNumber: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    requestedAction: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "¡Reclamación registrada!",
        description: "Su reclamo/queja ha sido registrado exitosamente. Nos pondremos en contacto dentro de 30 días hábiles.",
      });
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        type: "reclamo",
        fullName: "",
        documentType: "DNI",
        documentNumber: "",
        phone: "",
        email: "",
        address: "",
        description: "",
        requestedAction: ""
      });
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-background to-muted/20 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Libro de Reclamaciones
            </h1>
            <p className="text-lg text-muted-foreground">
              Tu opinión es importante para nosotros. Registra tu reclamo o queja aquí.
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-2">Información importante</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Reclamo:</strong> Disconformidad relacionada con los productos o servicios.</li>
                <li>• <strong>Queja:</strong> Disconformidad no relacionada con los productos o servicios; o malestar o descontento respecto a la atención al público.</li>
                <li>• <strong>Plazo de respuesta:</strong> 30 días hábiles.</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de reclamación */}
              <div className="space-y-3">
                <Label>Tipo *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reclamo" id="reclamo" />
                    <Label htmlFor="reclamo" className="font-normal cursor-pointer">
                      Reclamo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="queja" id="queja" />
                    <Label htmlFor="queja" className="font-normal cursor-pointer">
                      Queja
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Datos del reclamante */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Juan Pérez García"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de documento *</Label>
                  <select
                    id="documentType"
                    required
                    value={formData.documentType}
                    onChange={(e) => handleChange("documentType", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">Carnet de Extranjería</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Número de documento *</Label>
                  <Input
                    id="documentNumber"
                    required
                    value={formData.documentNumber}
                    onChange={(e) => handleChange("documentNumber", e.target.value)}
                    placeholder="12345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+51 999 888 777"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Av. Principal 123, Lima"
                />
              </div>

              {/* Detalle del reclamo */}
              <div className="space-y-2">
                <Label htmlFor="description">Detalle del reclamo/queja *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describa detalladamente su reclamo o queja..."
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 50 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedAction">Pedido del consumidor *</Label>
                <Textarea
                  id="requestedAction"
                  required
                  value={formData.requestedAction}
                  onChange={(e) => handleChange("requestedAction", e.target.value)}
                  placeholder="¿Qué acción solicita que tomemos?"
                  rows={3}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                  Al enviar este formulario, acepto que TuKompa procese mis datos personales para atender 
                  mi reclamo/queja de acuerdo con nuestra Política de Privacidad. Recibiré una respuesta 
                  en un plazo máximo de 30 días hábiles.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar reclamo/queja"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-3">Información de contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Email:</strong> tukompaprestamo@gmail.com</p>
              <p><strong>WhatsApp:</strong> +234 802 562 6573</p>
              <p><strong>Dirección:</strong> Av. Javier Prado Este 123, San Isidro, Lima, Perú</p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintsBook;
