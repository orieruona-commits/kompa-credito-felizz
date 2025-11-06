import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  full_name: string;
  email: string;
  phone: string;
  dni: string;
  amount: number;
  employment_status: string;
  monthly_income: number;
  loan_purpose: string;
  address: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    console.log("Sending notification for loan application:", data);

    const employmentLabels: Record<string, string> = {
      employed: "Empleado",
      self_employed: "Independiente",
      student: "Estudiante",
      unemployed: "Desempleado",
    };

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "TuKompa <onboarding@resend.dev>",
      to: ["tukompaprestamo@gmail.com"],
      subject: `Nueva Solicitud Completa - ${data.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7C3AED;">Nueva Solicitud de Préstamo Completa</h1>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Información Personal</h2>
            <p><strong>Nombre Completo:</strong> ${data.full_name}</p>
            <p><strong>DNI:</strong> ${data.dni}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.phone}</p>
            <p><strong>Dirección:</strong> ${data.address}</p>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Detalles del Préstamo</h2>
            <p><strong>Monto Solicitado:</strong> S/ ${data.amount}</p>
            <p><strong>Motivo:</strong> ${data.loan_purpose}</p>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Información Laboral</h2>
            <p><strong>Estado Laboral:</strong> ${employmentLabels[data.employment_status] || data.employment_status}</p>
            <p><strong>Ingreso Mensual:</strong> S/ ${data.monthly_income}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Contacta al solicitante por WhatsApp: 
              <a href="https://wa.me/${data.phone.replace(/\D/g, '')}" style="color: #7C3AED;">
                ${data.phone}
              </a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        email: emailResponse,
        whatsapp_info: `Contact: https://wa.me/${data.phone.replace(/\D/g, '')}`
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-loan-details-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
