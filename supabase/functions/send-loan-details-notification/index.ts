import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Twilio credentials
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM");
const TWILIO_WHATSAPP_TO = Deno.env.get("TWILIO_WHATSAPP_TO");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LoanDetailsNotification {
  applicationId: string;
  full_name: string;
  dni: string;
  phone: string;
  address: string;
  amount: number;
  loan_purpose: string;
  email: string;
  preferred_contact_method: "whatsapp" | "email";
}

async function sendWhatsAppNotification(data: LoanDetailsNotification): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) {
    console.log("Twilio credentials not configured, skipping WhatsApp notification");
    return;
  }

  const submissionDate = new Date().toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const whatsappMessage = `📩 *Nueva Solicitud de Préstamo Recibida!*

👤 *Nombre:* ${data.full_name}
📱 *Teléfono:* ${data.phone}
💳 *Monto Solicitado:* S/ ${data.amount.toLocaleString('es-PE')}
🕒 *Fecha de Envío:* ${submissionDate}

✅ Por favor revisa esta solicitud en el panel de administración.`;

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const authHeader = `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`;

  const formData = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: TWILIO_WHATSAPP_TO,
    Body: whatsappMessage,
  });

  try {
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio WhatsApp error:", errorText);
      throw new Error(`Twilio API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("WhatsApp notification sent successfully:", result.sid);
  } catch (error: any) {
    console.error("Failed to send WhatsApp notification:", error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: LoanDetailsNotification = await req.json();

    const contactMethod = data.preferred_contact_method === "whatsapp" ? "WhatsApp" : "Correo Electrónico";

    const emailResponse = await resend.emails.send({
      from: "tuKOMPA Préstamos <onboarding@resend.dev>",
      to: ["tukompaprestamo@gmail.com"],
      subject: `🆕 Nueva Solicitud de Préstamo - ${data.full_name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .detail-row {
                display: flex;
                padding: 12px 0;
                border-bottom: 1px solid #e0e0e0;
              }
              .detail-label {
                font-weight: bold;
                color: #8B5CF6;
                min-width: 180px;
              }
              .detail-value {
                color: #333;
                flex: 1;
              }
              .amount {
                font-size: 24px;
                font-weight: bold;
                color: #EC4899;
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                margin: 20px 0;
              }
              .purpose {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
                border-left: 4px solid #8B5CF6;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #8B5CF6;
                color: #666;
                font-size: 12px;
              }
              .link-button {
                display: inline-block;
                background: #8B5CF6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">💰 Nueva Solicitud de Préstamo</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">
                Un cliente ha completado su solicitud después de confirmar el pago
              </p>
            </div>
            
            <div class="content">
              <h2 style="color: #8B5CF6; margin-top: 0;">Información del Solicitante</h2>
              
              <div class="detail-row">
                <div class="detail-label">ID de Solicitud:</div>
                <div class="detail-value"><code>${data.applicationId}</code></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Nombre Completo:</div>
                <div class="detail-value">${data.full_name}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">DNI:</div>
                <div class="detail-value">${data.dni}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Teléfono:</div>
                <div class="detail-value">${data.phone}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${data.email}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Dirección:</div>
                <div class="detail-value">${data.address}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Contacto Preferido:</div>
                <div class="detail-value"><strong>${contactMethod}</strong></div>
              </div>
              
              <div class="amount">
                Monto Solicitado: S/ ${data.amount.toLocaleString('es-PE')}
              </div>
              
              <h3 style="color: #8B5CF6;">Motivo del Préstamo:</h3>
              <div class="purpose">
                ${data.loan_purpose}
              </div>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get("SUPABASE_URL")}/admin" class="link-button">
                  Ver en Panel de Admin
                </a>
              </div>
              
              <div class="footer">
                <p><strong>tuKOMPA Préstamos</strong></p>
                <p>Este correo fue generado automáticamente por el sistema de solicitudes.</p>
                <p style="margin-top: 15px;">
                  <strong>Siguiente paso:</strong> Revisar la solicitud y contactar al cliente por ${contactMethod}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Send WhatsApp notification
    try {
      await sendWhatsAppNotification(data);
    } catch (whatsappError: any) {
      console.error("WhatsApp notification failed, but continuing:", whatsappError);
      // Don't fail the entire request if WhatsApp fails
    }

    return new Response(JSON.stringify({ 
      email: emailResponse,
      whatsapp: "sent"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-loan-details-notification function:", error);
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