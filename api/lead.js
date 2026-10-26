// POST /api/lead · Recibe el registro del formulario y lo reenvía a:
//   1) GHL: Inbound Webhook de un workflow de la subcuenta de ESTA campaña (GHL_WEBHOOK_URL).
//   2) Meta Conversions API: evento Lead con el mismo event_id que el Pixel (solo registros calificados).
//
// Variables de entorno (Vercel → Settings → Environment Variables). Ninguna es pública:
//   GHL_WEBHOOK_URL, META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE (opcional), META_API_VERSION (opcional)
//
// Respuesta: { ok, forwarded: { ghl, capi }, error? }. Sin GHL_WEBHOOK_URL responde ok:false, error:'not_configured'.

import { clean, forwardToGhl, readJson, send, sendCapiEvent } from './_lib.js';

const CAMPAIGN = 'BOSCO landing 2 · Meta Ads';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COUNTRY = { MX: 'mx', US: 'us', CA: 'ca' };

export function buildGhlPayload(body) {
  const stage = body.stage === 'completo' ? 'completo' : 'parcial';
  const qualified = stage === 'completo' ? body.qualified === true : null;
  const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
  const tags = ['bosco-landing-2', stage === 'parcial' ? 'registro-incompleto' : 'registro-completo'];
  if (stage === 'completo') tags.push(qualified ? 'califica' : 'no-califica');

  return {
    lead_id: clean(body.lead_id, 64),
    etapa_registro: stage,
    califica: qualified === null ? '' : qualified ? 'si' : 'no',
    first_name: clean(body.first_name, 60),
    last_name: clean(body.last_name, 80),
    full_name: clean(body.nombre, 100),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 20),
    estado: clean(body.estado, 60),
    experiencia: clean(body.experiencia, 80),
    plazo: clean(body.plazo, 80),
    objetivo: clean(body.objetivo, 80),
    capital: clean(body.capital, 80),
    consentimiento: body.consent === true ? 'si' : 'no',
    consentimiento_texto: clean(body.consent_text, 300),
    consentimiento_fecha: clean(body.consent_at, 40),
    source: CAMPAIGN,
    tags,
    utm_source: clean(attribution.utm_source),
    utm_medium: clean(attribution.utm_medium),
    utm_campaign: clean(attribution.utm_campaign),
    utm_content: clean(attribution.utm_content),
    utm_term: clean(attribution.utm_term),
    fbclid: clean(attribution.fbclid, 300),
    referrer: clean(attribution.referrer, 300),
    page_url: clean(body.page_url, 500),
    submitted_at: new Date().toISOString(),
  };
}

export function validate(body) {
  const errors = [];
  if (clean(body.nombre, 100).length < 3) errors.push('nombre');
  if (!EMAIL_RE.test(clean(body.email, 254))) errors.push('email');
  if (!/^\+\d{8,15}$/.test(clean(body.phone, 20))) errors.push('phone');
  if (body.consent !== true) errors.push('consent');
  if (body.stage === 'completo' && typeof body.qualified !== 'boolean') errors.push('qualified');
  return errors;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    return send(res, error.status || 400, { ok: false, error: 'invalid_json' });
  }

  // Trampa anti-bots: campo oculto lleno o envío en menos de 1.5 s. Se responde ok sin reenviar.
  if (clean(body.website) || (Number(body.elapsed_ms) > 0 && Number(body.elapsed_ms) < 1500)) {
    return send(res, 200, { ok: true, forwarded: { ghl: false, capi: false } });
  }

  const errors = validate(body);
  if (errors.length) return send(res, 422, { ok: false, error: 'invalid_fields', fields: errors });

  const payload = buildGhlPayload(body);
  const isQualifiedLead = payload.etapa_registro === 'completo' && payload.califica === 'si';

  const [ghl, capi] = await Promise.all([
    forwardToGhl(payload),
    isQualifiedLead
      ? sendCapiEvent({
          eventName: 'Lead',
          eventId: clean(body.event_id, 64),
          sourceUrl: payload.page_url,
          req,
          user: {
            email: payload.email,
            phone: payload.phone,
            firstName: payload.first_name,
            lastName: payload.last_name,
            externalId: payload.lead_id,
            country: COUNTRY[body.phone_country],
            fbp: body.fbp,
            fbc: body.fbc,
          },
          customData: { lead_type: 'calificado', content_name: 'BOSCO landing 2' },
        })
      : Promise.resolve({ configured: false, ok: false }),
  ]);

  if (!ghl.configured) {
    return send(res, 503, { ok: false, error: 'not_configured', forwarded: { ghl: false, capi: capi.ok } });
  }
  if (!ghl.ok) {
    console.error('[api/lead] GHL respondió con error', ghl);
    return send(res, 502, { ok: false, error: 'ghl_error', forwarded: { ghl: false, capi: capi.ok } });
  }
  return send(res, 200, { ok: true, forwarded: { ghl: true, capi: capi.ok } });
}
