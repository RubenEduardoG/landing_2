// POST /api/event · Eventos de servidor para Meta CAPI que no pasan por /api/lead (p. ej. Schedule).
// Usa el mismo event_id que el Pixel del navegador para que Meta deduplique.
//
// Nota: la forma más confiable de enviar "Schedule" es desde un workflow de GHL con el disparador
// "Appointment booked" (ver docs/INTEGRACIONES.md). Este endpoint cubre el caso de la página /gracias.

import { clean, readJson, send, sendCapiEvent } from './_lib.js';

const ALLOWED = new Set(['Schedule']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { ok: false, error: 'invalid_json' });
  }

  const eventName = clean(body.event_name, 40);
  const eventId = clean(body.event_id, 64);
  if (!ALLOWED.has(eventName) || !eventId) return send(res, 422, { ok: false, error: 'invalid_event' });

  const [firstName = '', ...rest] = clean(body.nombre, 100).split(' ');
  const result = await sendCapiEvent({
    eventName,
    eventId,
    sourceUrl: clean(body.page_url, 500),
    req,
    user: {
      email: clean(body.email, 254),
      phone: clean(body.phone, 20),
      firstName,
      lastName: rest.join(' '),
      externalId: clean(body.lead_id, 64),
      fbp: body.fbp,
      fbc: body.fbc,
    },
    customData: { content_name: 'BOSCO landing 2' },
  });

  if (!result.configured) return send(res, 503, { ok: false, error: 'not_configured' });
  return send(res, result.ok ? 200 : 502, { ok: result.ok });
}
