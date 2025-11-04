import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FloatingWhatsApp />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Aviso Legal</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Naturaleza del Servicio</h2>
            <p>
              TuKompa es una plataforma de procesamiento y gestión de solicitudes de préstamos personales. 
              Actuamos como intermediarios facilitando la conexión entre solicitantes y proveedores de servicios financieros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">No Garantía de Aprobación</h2>
            <p className="mb-4">
              <strong>IMPORTANTE:</strong> TuKompa <strong>NO GARANTIZA</strong> la aprobación de ninguna solicitud de préstamo. 
              Cada solicitud es evaluada de manera individual según criterios específicos que incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Historial crediticio del solicitante</li>
              <li>Capacidad de pago demostrable</li>
              <li>Documentación completa y verificable</li>
              <li>Cumplimiento de requisitos mínimos</li>
              <li>Evaluación de riesgo crediticio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Tarifa de Verificación</h2>
            <p className="mb-4">
              La tarifa de verificación de S/65 soles es un pago único y <strong>NO REEMBOLSABLE</strong> que cubre:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesamiento y revisión de la solicitud</li>
              <li>Verificación de identidad y documentos</li>
              <li>Evaluación crediticia inicial</li>
              <li>Costos administrativos del proceso</li>
            </ul>
            <p className="mt-4">
              Este pago se requiere independientemente del resultado de la solicitud (aprobada o rechazada) 
              y <strong>NO</strong> constituye un adelanto del préstamo solicitado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Responsabilidad del Usuario</h2>
            <p className="mb-4">
              Al utilizar nuestros servicios, el usuario acepta y comprende que:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Debe proporcionar información veraz y completa</li>
              <li>Es responsable de leer y entender todos los términos antes de aplicar</li>
              <li>La aprobación está sujeta a evaluación y no está garantizada</li>
              <li>El pago de verificación es un requisito para procesar la solicitud</li>
              <li>Cualquier información falsa puede resultar en el rechazo automático</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitación de Responsabilidad</h2>
            <p>
              TuKompa no se hace responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Rechazos de solicitudes por no cumplir con los criterios establecidos</li>
              <li>Demoras en el proceso de aprobación debido a documentación incompleta</li>
              <li>Cambios en las condiciones de préstamo por parte de entidades financieras</li>
              <li>Pérdidas o daños indirectos derivados del uso de nuestros servicios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Protección de Datos</h2>
            <p>
              Toda la información personal proporcionada es tratada de acuerdo con nuestra 
              <a href="/privacy" className="text-primary hover:underline ml-1">Política de Privacidad</a> 
              y las leyes de protección de datos aplicables en Perú.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contacto</h2>
            <p>
              Para cualquier consulta sobre este aviso legal, puede contactarnos a través de:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li>📧 Email: tukompaprestamo@gmail.com</li>
              <li>📱 WhatsApp: +234 802 562 6573</li>
            </ul>
          </section>

          <section className="bg-muted/50 p-6 rounded-lg border">
            <p className="text-sm">
              <strong>Última actualización:</strong> Noviembre 2025
            </p>
            <p className="text-sm mt-2">
              Nos reservamos el derecho de modificar este aviso legal en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en este sitio web.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;
