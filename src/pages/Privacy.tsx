import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">
              Última actualización: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introducción</h2>
              <p>
                En TuKompa SAC (en adelante "TuKompa"), respetamos su privacidad y nos comprometemos a proteger 
                sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos 
                y protegemos su información en cumplimiento con la Ley N° 29733 - Ley de Protección de Datos 
                Personales del Perú.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Información que Recopilamos</h2>
              <p>Recopilamos la siguiente información personal cuando utiliza nuestros servicios:</p>
              
              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">2.1 Datos de Identificación</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre completo</li>
                <li>Número de DNI</li>
                <li>Fecha de nacimiento</li>
                <li>Fotografía del DNI</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">2.2 Datos de Contacto</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono celular</li>
                <li>Dirección física</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">2.3 Información Financiera</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ingresos mensuales</li>
                <li>Información laboral</li>
                <li>Historial crediticio (si aplica)</li>
                <li>Datos bancarios para desembolso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Uso de la Información</h2>
              <p>Utilizamos su información personal para los siguientes propósitos:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Procesar y evaluar su solicitud de préstamo</li>
                <li>Verificar su identidad y prevenir fraudes</li>
                <li>Comunicarnos con usted sobre su solicitud y préstamo</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Mejorar nuestros servicios y experiencia del usuario</li>
                <li>Enviar notificaciones importantes sobre su cuenta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Compartir Información</h2>
              <p>
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los 
                siguientes casos:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Con entidades financieras para el procesamiento de préstamos</li>
                <li>Con centrales de riesgo crediticio (cuando sea necesario)</li>
                <li>Con proveedores de servicios que nos ayudan a operar (bajo acuerdos de confidencialidad)</li>
                <li>Cuando lo requiera la ley o autoridades competentes</li>
                <li>Con su consentimiento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Seguridad de los Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su 
                información personal contra acceso no autorizado, alteración, divulgación o destrucción:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Encriptación SSL/TLS para todas las transmisiones de datos</li>
                <li>Servidores seguros con acceso restringido</li>
                <li>Protocolos de autenticación robustos</li>
                <li>Auditorías de seguridad periódicas</li>
                <li>Capacitación continua del personal en protección de datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Sus Derechos</h2>
              <p>
                De acuerdo con la Ley de Protección de Datos Personales, usted tiene los siguientes derechos:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos</li>
                <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos en ciertos casos</li>
                <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos, contáctenos a: tukompaprestamo@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies y Tecnologías Similares</h2>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web, 
                analizar el tráfico y personalizar el contenido. Puede configurar su navegador para rechazar 
                cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Retención de Datos</h2>
              <p>
                Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos 
                descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Menores de Edad</h2>
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente 
                información de menores de edad.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Cambios a esta Política</h2>
              <p>
                Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios 
                significativos publicando la nueva política en nuestro sitio web con una fecha de actualización.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Contacto</h2>
              <p>
                Si tiene preguntas o inquietudes sobre esta Política de Privacidad o el tratamiento de sus datos, 
                contáctenos:
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

export default Privacy;
