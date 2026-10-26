// Envío del registro al endpoint propio (/api/lead), que lo reenvía al webhook de GHL y a Meta CAPI.
// El navegador nunca habla directo con GHL ni con Meta CAPI: así no se exponen URLs ni tokens.

import { CONFIG } from './config.js';
import { readCookie } from './tracking.js';

async function postJSON(url, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, ...data };
  } catch (error) {
    return { ok: false, status: 0, error: error.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

export function metaCookies() {
  return { fbp: readCookie('_fbp'), fbc: readCookie('_fbc') };
}

/** Envía el registro. Nunca lanza: devuelve { ok, delivered, ... }. */
export async function sendLead(payload, { timeoutMs = 6000 } = {}) {
  const body = { ...payload, ...metaCookies(), page_url: location.href.split('#')[0] };
  let result = await postJSON(CONFIG.leadEndpoint, body, timeoutMs);
  // Un reintento ante fallos de red o del servidor (no ante datos inválidos).
  if (!result.ok && (result.status === 0 || result.status >= 500) && result.error !== 'not_configured') {
    result = await postJSON(CONFIG.leadEndpoint, body, timeoutMs);
  }
  return { ...result, delivered: Boolean(result.ok && result.forwarded?.ghl) };
}

/** Evento de servidor para Meta CAPI (p. ej. Schedule) con el mismo event_id del Pixel. */
export function sendServerEvent(payload) {
  return postJSON(CONFIG.eventEndpoint, { ...payload, ...metaCookies(), page_url: location.href.split('#')[0] }, 5000);
}
