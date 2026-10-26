// Utilidades de servidor para las funciones de Vercel (/api). Sin dependencias externas.
// Los archivos que empiezan con "_" no se publican como endpoints.

import { createHash } from 'node:crypto';

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export async function readJson(req, limit = 32 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body; // Vercel ya lo parseó
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('payload_too_large'), { status: 413 });
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export const clean = (value, max = 200) =>
  typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
}

export const env = (name) => (process.env[name] || '').trim();

async function fetchWithTimeout(url, options, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Reenvía el registro al Inbound Webhook de un workflow de GHL. */
export async function forwardToGhl(payload) {
  const url = env('GHL_WEBHOOK_URL');
  if (!url) return { configured: false, ok: false };
  try {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { configured: true, ok: response.ok, status: response.status };
  } catch (error) {
    return { configured: true, ok: false, error: error.name };
  }
}

/**
 * Envía un evento a Meta Conversions API.
 * Requiere META_PIXEL_ID y META_CAPI_TOKEN (solo en el servidor). META_TEST_EVENT_CODE es opcional para pruebas.
 */
export async function sendCapiEvent({ eventName, eventId, sourceUrl, req, user = {}, customData = {} }) {
  const pixelId = env('META_PIXEL_ID');
  const token = env('META_CAPI_TOKEN');
  if (!pixelId || !token || !eventId) return { configured: Boolean(pixelId && token), ok: false };

  const userData = {
    client_ip_address: clientIp(req) || undefined,
    client_user_agent: clean(req.headers['user-agent'], 400) || undefined,
    fbp: clean(user.fbp) || undefined,
    fbc: clean(user.fbc) || undefined,
  };
  if (user.email) userData.em = [sha256(user.email.trim().toLowerCase())];
  if (user.phone) userData.ph = [sha256(user.phone.replace(/\D/g, ''))];
  if (user.firstName) userData.fn = [sha256(user.firstName.trim().toLowerCase())];
  if (user.lastName) userData.ln = [sha256(user.lastName.trim().toLowerCase())];
  if (user.externalId) userData.external_id = [sha256(user.externalId)];
  if (user.country) userData.country = [sha256(user.country.toLowerCase())];

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: sourceUrl || undefined,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };
  const testCode = env('META_TEST_EVENT_CODE');
  if (testCode) body.test_event_code = testCode;

  const version = env('META_API_VERSION') || 'v21.0';
  try {
    const response = await fetchWithTimeout(
      `https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    return { configured: true, ok: response.ok, status: response.status };
  } catch (error) {
    return { configured: true, ok: false, error: error.name };
  }
}
