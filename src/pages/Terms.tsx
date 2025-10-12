import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">
              Última actualización: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar los servicios de TuKompa SAC (en adelante "TuKompa", "nosotros" o "nuestro"), 
                usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte 
                de estos términos, no debe utilizar nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Servicios Ofrecidos</h2>
              <p>
                TuKompa ofrece servicios de intermediación para préstamos personales en línea. Actuamos como 
                plataforma que conecta a solicitantes de préstamos con potenciales prestamistas.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Préstamos personales desde S/500 hasta S/5,000</li>
                <li>Plazos de 3 a 24 meses</li>
                <li>Proceso 100% digital</li>
                <li>Evaluación en minutos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Requisitos para Solicitar</h2>
              <p>Para solicitar un préstamo a través de TuKompa, debe cumplir con los siguientes requisitos:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Ser mayor de 18 años</li>
                <li>Tener DNI peruano vigente</li>
                <li>Contar con ingresos mensuales verificables</li>
                <li>Tener un número de celular activo</li>
                <li>Proporcionar una dirección de correo electrónico válida</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Tasa de Evaluación</h2>
              <p>
                Para procesar su solicitud de préstamo, se requiere el pago de una tasa de evaluación de S/30. 
                Esta tasa cubre los costos administrativos y de verificación de la solicitud. El pago se realiza 
                de manera offline mediante transferencia bancaria, Yape o Plin, y debe ser confirmado por WhatsApp.
              </p>
              <p className="mt-3">
                <strong>Importante:</strong> La tasa de evaluación no garantiza la aprobación del préstamo y 
                no es reembolsable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Tasas de Interés y Comisiones</h2>
              <p>
                Las tasas de interés y comisiones varían según el monto del préstamo, el plazo seleccionado y 
                el perfil crediticio del solicitante. Todas las tasas son informadas claramente antes de la 
                aceptación del préstamo.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Tasa de Costo Efectivo Anual (TCEA): desde 45% hasta 120%</li>
                <li>Sin comisiones ocultas</li>
                <li>Prepago sin penalidades</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Proceso de Aprobación</h2>
              <p>
                Una vez recibida su solicitud y confirmado el pago de la tasa de evaluación:
              </p>
              <ol className="list-decimal pl-6 mt-3 space-y-2">
                <li>Evaluamos su solicitud en un plazo de 24 a 48 horas</li>
                <li>Verificamos la información proporcionada</li>
                <li>Le notificamos la decisión por correo electrónico y/o WhatsApp</li>
                <li>Si es aprobado, procedemos con el desembolso</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Obligaciones del Usuario</h2>
              <p>El usuario se compromete a:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Proporcionar información veraz y actualizada</li>
                <li>Realizar los pagos en las fechas acordadas</li>
                <li>Notificar cualquier cambio en su información de contacto</li>
                <li>Usar el préstamo de manera responsable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Protección de Datos</h2>
              <p>
                Toda la información personal que nos proporcione será tratada de acuerdo con nuestra 
                Política de Privacidad y la Ley de Protección de Datos Personales del Perú (Ley N° 29733).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Modificaciones</h2>
              <p>
                TuKompa se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. 
                Las modificaciones serán notificadas a través de nuestro sitio web y entrarán en vigencia 
                inmediatamente después de su publicación.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos:
              </p>
              <ul className="list-none mt-3 space-y-2">
                <li><strong>Email:</strong> tukompaprestamo@gmail.com</li>
                <li><strong>WhatsApp:</strong> +234 802 562 6573</li>
                <li><strong>Dirección:</strong> Av. Javier Prado Este 123, San Isidro, Lima, Perú</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
