// /agenda · Calendario de GHL para quien calificó.
// Sin calendario configurado no se simula una cita: se ofrece WhatsApp o se informa que un asesor contactará.

import { boot, render, app } from '../boot.js';
import { CONFIG, ROUTES, isLive } from '../config.js';
import { ADVISOR, MESSAGES } from '../content.js';
import { readSession } from '../session.js';
import { track } from '../tracking.js';
import { demoBannerHTML, esc, footerHTML, navHTML, stepsHTML, whatsappLink } from '../ui.js';

const session = readSession();
const preview = new URLSearchParams(location.search).has('preview');

// Solo se llega aquí después de calificar.
if (!preview && session.qualified !== true) {
  location.replace(session.qualified === false ? ROUTES.noCalifica : ROUTES.registro);
} else {
  boot();
  render(pageHTML());
  mountCalendar();
  track('schedule_view', { calendar: CONFIG.ghlCalendarUrl ? 'ghl' : 'fallback' });
}

function firstName() {
  return (session.contact?.nombre || '').split(' ')[0];
}

function calendarUrl() {
  const url = new URL(CONFIG.ghlCalendarUrl);
  const c = session.contact || {};
  const [first, ...rest] = (c.nombre || '').split(' ');
  // Prellenado de datos en el widget de GHL. [VERIFICAR] en la cuenta: si GHL ignora algún parámetro no pasa nada.
  const prefill = { first_name: first, last_name: rest.join(' '), email: c.email, phone: c.phone };
  Object.entries(prefill).forEach(([k, v]) => v && url.searchParams.set(k, v));
  return url.toString();
}

function fallbackHTML() {
  const wa = whatsappLink(
    `Hola, soy ${session.contact?.nombre || ''}. Me registré en la página de BOSCO y quiero agendar mi asesoría.`
  );
  const contacted = isLive() && session.leadDelivered;
  return `
    <div class="calendar-fallback">
      <h2>${contacted ? 'Recibimos tu registro' : 'Agenda en configuración'}</h2>
      <p>${
        contacted
          ? 'Un asesor te escribirá por WhatsApp para confirmar el día y la hora de tu asesoría.'
          : 'La agenda en línea todavía no está disponible en esta versión.'
      }</p>
      ${wa ? `<a class="btn btn-lg" href="${esc(wa)}" target="_blank" rel="noopener" data-track="agenda_whatsapp">Escribir por WhatsApp <span aria-hidden="true" class="arrow">→</span></a>` : ''}
    </div>`;
}

function pageHTML() {
  const name = firstName();
  return `
${navHTML({ action: 'back' })}
${demoBannerHTML()}
<main class="funnel funnel-wide">
  <div class="funnel-card">
    ${stepsHTML(3)}
    <p class="eyebrow">Último paso</p>
    <h1>${name ? `${esc(name)}, elige` : 'Elige'} <em>tu horario.</em></h1>
    <p class="funnel-intro">Reserva tu asesoría con ${esc(ADVISOR.name)}. Ahí conocerás el proyecto, el contrato y resolverás tus dudas.</p>
    ${session.needsClarification ? `<p class="notice">${esc(MESSAGES.residenceClarification)}</p>` : ''}
    <div id="calendar" class="calendar">
      ${CONFIG.ghlCalendarUrl ? '<p class="calendar-loading" role="status">Cargando horarios disponibles…</p>' : fallbackHTML()}
    </div>
    ${CONFIG.ghlCalendarUrl ? '<p class="fine">Antes de confirmar, revisa que la zona horaria del calendario sea la tuya.</p>' : ''}
  </div>
</main>
${footerHTML()}`;
}

function mountCalendar() {
  if (!CONFIG.ghlCalendarUrl) return;
  const box = app.querySelector('#calendar');
  let src;
  try {
    src = calendarUrl();
  } catch {
    box.innerHTML = fallbackHTML();
    return;
  }
  const frame = document.createElement('iframe');
  frame.src = src;
  frame.title = `Calendario para agendar tu asesoría con ${ADVISOR.name}`;
  frame.className = 'calendar-frame';
  frame.id = `ghl-calendar-${Date.now()}`;
  frame.setAttribute('scrolling', 'no');
  frame.addEventListener('load', () => box.querySelector('.calendar-loading')?.remove(), { once: true });
  box.append(frame);

  // Script oficial de GHL: ajusta la altura del iframe y gestiona la redirección tras reservar.
  const script = document.createElement('script');
  script.src = CONFIG.ghlEmbedScript;
  script.async = true;
  document.body.append(script);
}
