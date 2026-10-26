// Medición: Google Analytics 4 + Meta Pixel (navegador) con event_id compartido para deduplicar con Meta CAPI.
//
// - Sin VITE_GA4_ID / VITE_META_PIXEL_ID no se carga ningún script de terceros: track() solo deja rastro en
//   window.dataLayer y, con ?debug=1, en la consola.
// - Los eventos de conversión (Lead, Schedule) usan el mismo event_id en navegador y servidor (/api).
//
// Eventos GA4 preparados:
//   page_view (automático) · cta_click · vsl_play · vsl_progress · form_start · form_step_complete
//   generate_lead (registro calificado) · lead_not_qualified · schedule_view · schedule_appointment (conversión principal)

import { CONFIG } from './config.js';
import { readSession, writeSession } from './session.js';

const debug = (() => {
  try {
    return new URLSearchParams(location.search).has('debug');
  } catch {
    return false;
  }
})();

window.dataLayer = window.dataLayer || [];

function loadScript(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.append(s);
}

function initGA4() {
  if (!CONFIG.ga4Id) return;
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
  };
  window.gtag('js', new Date());
  window.gtag('config', CONFIG.ga4Id, { debug_mode: debug || undefined });
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4Id)}`);
}

function initPixel() {
  if (!CONFIG.metaPixelId) return;
  /* Código base oficial de Meta Pixel, sin modificar su lógica. */
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', CONFIG.metaPixelId);
  window.fbq('track', 'PageView');
}

// Guarda la atribución de la primera visita de la sesión (UTM, fbclid, gclid).
export function captureAttribution() {
  const params = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  const found = Object.fromEntries(
    keys.filter((k) => params.get(k)).map((k) => [k, params.get(k).slice(0, 200)])
  );
  const session = readSession();
  if (!session.attribution && (Object.keys(found).length || document.referrer)) {
    writeSession({
      attribution: { ...found, landing_page: location.pathname, referrer: document.referrer.slice(0, 300) },
    });
  }
  // Si hay fbclid y el Pixel no está activo, se conserva _fbc para que CAPI lo reciba.
  if (found.fbclid && !readCookie('_fbc')) {
    setCookie('_fbc', `fb.1.${Date.now()}.${found.fbclid}`);
  }
}

export function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function setCookie(name, value) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=7776000; Path=/; SameSite=Lax`;
  } catch {
    /* cookies bloqueadas */
  }
}

export function initTracking() {
  captureAttribution();
  initGA4();
  initPixel();
}

/**
 * Envía un evento a GA4 y, opcionalmente, un evento estándar de Meta.
 * @param {string} name   nombre del evento GA4
 * @param {object} params parámetros (sin datos personales)
 * @param {{meta?: string, eventId?: string}} options
 */
export function track(name, params = {}, { meta, eventId } = {}) {
  window.dataLayer.push({ event: name, ...params, event_id: eventId });
  if (window.gtag && CONFIG.ga4Id) window.gtag('event', name, { ...params, event_id: eventId });
  if (meta && window.fbq && CONFIG.metaPixelId) {
    window.fbq('track', meta, params, eventId ? { eventID: eventId } : undefined);
  }
  if (debug) console.info('[BOSCO tracking]', name, params, meta ? `Meta:${meta}` : '', eventId || '');
}

// Envía clics en cualquier elemento con data-track="..."
export function bindClickTracking(root = document) {
  root.addEventListener('click', (event) => {
    const el = event.target.closest('[data-track]');
    if (el) track('cta_click', { cta_id: el.dataset.track, page: location.pathname });
  });
}
