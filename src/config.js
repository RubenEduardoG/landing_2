// Configuración pública de la segunda landing BOSCO (campaña Meta · Daniel Barrios y Gabriel García).
//
// Todos los valores se leen de variables de entorno VITE_* (ver .env.example).
// Un valor vacío = integración PENDIENTE: la página sigue funcionando y muestra una alternativa honesta.
//
// IMPORTANTE
// - No usar identificadores, calendarios, números ni dominios de la primera landing (Marisol Caro, embudo orgánico)
//   sin verificar que pertenecen a la cuenta de esta campaña.
// - Nunca colocar tokens secretos aquí (Meta CAPI, GHL). Todo lo que empieza con VITE_ termina en el JavaScript público.
//   Los secretos van en las variables de entorno del servidor (Vercel) y los usa /api.

const env = import.meta.env ?? {};
const str = (value) => (typeof value === 'string' ? value.trim() : '');
const digits = (value) => str(value).replace(/\D/g, '');

export const ASSET_BASE = '/assets/';

export const ROUTES = {
  home: '/',
  registro: '/registro',
  agenda: '/agenda',
  gracias: '/gracias',
  noCalifica: '/no-califica',
  privacidad: '/aviso-de-privacidad',
};

export const CONFIG = {
  // 'demo' (por defecto): muestra un aviso de versión de prueba en el embudo.
  // 'live': solo cuando GHL, calendario y mensajería estén conectados y probados.
  funnelMode: str(env.VITE_FUNNEL_MODE) === 'live' ? 'live' : 'demo',

  // URL pública definitiva (dominio o subdominio de esta campaña). Se usa para OG/canonical.
  siteUrl: str(env.VITE_SITE_URL).replace(/\/+$/, ''),

  // VSL. Mientras no exista el reproductor de VTurb se usa el MP4 del proyecto.
  // Para VTurb: pegar el código de inserción en src/vsl-embed.js (no inventar URLs).
  vslMp4: str(env.VITE_VSL_MP4_URL) || `${ASSET_BASE}videos/vsl.mp4`,
  vslPoster: `${ASSET_BASE}imagenes/vsl-poster.webp`,

  // GHL · URL del widget de reserva del calendario de ESTA campaña
  // (Calendars → Share → Embed / permanent link). Vacío = alternativa por WhatsApp.
  ghlCalendarUrl: str(env.VITE_GHL_CALENDAR_URL),
  // Script oficial de inserción de GHL (redimensiona el iframe). Se puede sobrescribir si GHL lo cambia.
  ghlEmbedScript: str(env.VITE_GHL_EMBED_SCRIPT) || 'https://link.msgsndr.com/js/form_embed.js',

  // Endpoint propio (función serverless en /api) que reenvía el registro al webhook de GHL y a Meta CAPI.
  leadEndpoint: str(env.VITE_LEAD_ENDPOINT) || '/api/lead',
  eventEndpoint: str(env.VITE_EVENT_ENDPOINT) || '/api/event',

  // WhatsApp de contacto de la campaña, solo dígitos con lada internacional (ej. 5299XXXXXXXX). Vacío = oculto.
  whatsappNumber: digits(env.VITE_WHATSAPP_NUMBER),

  // Medición (IDs públicos). Vacío = no se carga ningún script de terceros.
  ga4Id: str(env.VITE_GA4_ID),
  metaPixelId: digits(env.VITE_META_PIXEL_ID),

  // Aviso de privacidad. Por defecto, la página incluida en el proyecto.
  privacyUrl: str(env.VITE_PRIVACY_URL) || ROUTES.privacidad,
};

export const isLive = () => CONFIG.funnelMode === 'live';
