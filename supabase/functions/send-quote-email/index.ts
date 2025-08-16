import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  to: string;
  subject: string;
  message: string;
  quote: {
    quote_number: string;
    customer_company: string;
    mode: string;
    origin: string;
    destination: string;
    charges: Array<{
      name: string;
      buy: number;
      sell: number;
      margin: number;
    }>;
  };
  totalSell: number;
  totalMargin: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, quote, totalSell, totalMargin }: QuoteEmailRequest = await req.json();

    // Generate HTML content for the quote
    const chargesHTML = quote.charges
      .filter(charge => charge.name && (charge.sell > 0 || charge.buy > 0))
      .map(charge => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: left;">${charge.name}</td>
          <td style="padding: 12px; text-align: right; font-weight: 600;">$${charge.sell.toFixed(2)}</td>
        </tr>
      `).join('');

    const quoteHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Freight Quote - ${quote.quote_number}</title>
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #3730a3 50%, #1e293b 100%); padding: 32px; text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 32px; height: 32px; background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 16px; height: 16px; background-color: white; border-radius: 2px;"></div>
                </div>
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">LogisticIntel</h1>
              </div>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 0; font-size: 14px;">Trade Intelligence Platform</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">Quote ${quote.quote_number}</h2>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="color: #6b7280; text-transform: uppercase; font-size: 12px; font-weight: 600;">
                    ${quote.mode} Freight
                  </span>
                  <span style="color: #374151; font-weight: 500;">
                    ${quote.origin || 'Origin'} → ${quote.destination || 'Destination'}
                  </span>
                </div>
              </div>

              <div style="white-space: pre-line; margin-bottom: 32px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #3730a3;">
                ${message}
              </div>

              <!-- Quote Details -->
              <div style="margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #111827; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Quote Details</h3>
                
                <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                  <thead>
                    <tr style="background-color: #f3f4f6;">
                      <th style="padding: 16px; text-align: left; font-weight: 600; color: #374151;">Service</th>
                      <th style="padding: 16px; text-align: right; font-weight: 600; color: #374151;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${chargesHTML}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #1e293b;">
                      <td style="padding: 16px; font-weight: bold; color: white; font-size: 16px;">Total</td>
                      <td style="padding: 16px; text-align: right; font-weight: bold; color: white; font-size: 18px;">$${totalSell.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Contact Info -->
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #374151; font-weight: 500;">Questions about this quote?</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Reply to this email or contact our team directly.</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                © 2024 LogisticIntel. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "LogisticIntel <quotes@resend.dev>",
      to: [to],
      subject: subject,
      html: quoteHTML,
    });

    console.log("Quote email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
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