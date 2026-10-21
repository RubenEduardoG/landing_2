// Configuración de integraciones.
// Todos los valores vacíos son PENDIENTES. No publicar hasta completarlos y probar un contacto y una cita reales.
// No colocar tokens secretos (p. ej. Meta CAPI) en este archivo: deben vivir en el backend o en variables de entorno del servidor.

export const ASSET_BASE = '/assets/';

export const ROUTES = {
  thanks: '/gracias',
  notQualified: '/no-califica',
};

export const CONFIG = {
  // PENDIENTE (GHL, subcuenta Agencia Bosco Blue): URL embed del calendario. Vacío = placeholder visible.
  ghlCalendarUrl: '',
  // PENDIENTE (GHL): endpoint o webhook de creación de contacto para el formulario.
  ghlFormEndpoint: '',
  // PENDIENTE (WhatsApp Business): número emisor y plantillas aprobadas.
  whatsappNumber: '',
  // PENDIENTE (Meta): Pixel ID. Los eventos se disparan solo tras acciones reales y con consentimiento.
  metaPixelId: '',
  // PENDIENTE (aprobación legal): aviso de privacidad.
  privacyNoticeUrl: '',
};
