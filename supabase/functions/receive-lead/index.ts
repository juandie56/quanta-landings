import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===== CORS HEADERS =====
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ===== 1. PARSEAR PAYLOAD =====
    const payload = await req.json();
    const { lead, campaign, metadata, schema_version } = payload;

    // Validación básica
    if (!lead?.email || !lead?.nombre) {
      return new Response(
        JSON.stringify({ error: "Campos requeridos: nombre y email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== 2. GUARDAR EN SUPABASE =====
    const supabase = createClient(
      Deno.env.get("DB_URL") ?? "",
      Deno.env.get("DB_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase.from("leads").insert({
      nombre:          lead.nombre,
      empresa:         lead.empresa,
      indicativo:      lead.indicativo,
      telefono:        lead.telefono,
      email:           lead.email,
      industria:       lead.industria,
      tamano_empresa:  lead.tamano_empresa,
      operarios:       lead.operarios,
      campaign_name:   campaign.name,
      utm_source:      campaign.utm_source,
      utm_medium:      campaign.utm_medium,
      utm_campaign:    campaign.utm_campaign,
      utm_content:     campaign.utm_content,
      utm_term:        campaign.utm_term,
      gclid:           campaign.gclid,
      fbclid:          campaign.fbclid,
      landing_url:     metadata.landing_url,
      referrer:        metadata.referrer,
      session_id:      metadata.session_id,
      schema_version:  schema_version,
    });

    if (dbError) throw new Error(`DB Error: ${dbError.message}`);

    // ===== 3. DISPARAR WEBHOOKS (Dapta + n8n) =====
    const webhooks = [
      Deno.env.get("DAPTA_WEBHOOK_URL"),
      Deno.env.get("N8N_WEBHOOK_URL"),
    ].filter(Boolean);

    await Promise.allSettled(
      webhooks.map((url) =>
        fetch(url!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      )
    );

    // ===== 4. RESPUESTA OK =====
    return new Response(
      JSON.stringify({ success: true, message: "Lead recibido correctamente" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[receive-lead] Error:", err.message);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
