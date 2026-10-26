// /gracias · Confirmación del registro o de la reserva.
// GHL debe redirigir aquí tras reservar: https://DOMINIO/gracias?cita=1 (ver docs/INTEGRACIONES.md).
// La conversión principal (Schedule / schedule_appointment) solo se envía si el visitante calificó en esta sesión.

import { boot, render } from '../boot.js';
import { ROUTES } from '../config.js';
import { ADVISOR } from '../content.js';
import { readSession, writeSession, newId } from '../session.js';
import { sendServerEvent } from '../lead.js';
import { track } from '../tracking.js';
import { demoBannerHTML, esc, footerHTML, navHTML, whatsappLink } from '../ui.js';

// Si GHL abrió esta página dentro del iframe del calendario, se lleva a la ventana principal.
let framed = false;
try {
  framed = window.top !== window.self;
  if (framed) window.top.location.href = location.href;
} catch {
  framed = false;
}

if (!framed) {
  const params = new URLSearchParams(location.search);
  const session = readSession();
  const booked = params.get('cita') === '1';
  const name = (session.contact?.nombre || '').split(' ')[0];

  boot();
  render(pageHTML({ booked, name }));

  if (booked && session.qualified === true && !session.scheduleTracked) {
    const eventId = newId();
    writeSession({ scheduleTracked: true, booked: true });
    track('schedule_appointment', { calendar: 'ghl' }, { meta: 'Schedule', eventId });
    sendServerEvent({
      event_name: 'Schedule',
      event_id: eventId,
      lead_id: session.leadId,
      email: session.contact?.email,
      phone: session.contact?.phone,
      nombre: session.contact?.nombre,
    });
  }
}

function pageHTML({ booked, name }) {
  const wa = whatsappLink('Hola, acabo de registrarme en la página de BOSCO y tengo una pregunta.');
  const steps = booked
    ? [
        ['Revisa tu WhatsApp y tu correo', 'Te enviaremos la confirmación con la fecha, la hora y el enlace de la llamada.'],
        ['Guarda la cita en tu calendario', 'Si necesitas cambiar el horario, usa el enlace de la confirmación.'],
        ['Prepara tus preguntas', `En la llamada, ${ADVISOR.name} te explicará el proyecto, el contrato y las formas de pago.`],
      ]
    : [
        ['Mantente pendiente de tu WhatsApp', 'Un asesor se pondrá en contacto contigo para confirmar tu asesoría.'],
        ['Revisa tu correo', 'Ahí también recibirás la información de tu registro.'],
        ['Prepara tus preguntas', 'Resolveremos tus dudas sobre el proyecto, el contrato y las formas de pago.'],
      ];

  return `
${navHTML({ action: 'back' })}
${demoBannerHTML()}
<main class="funnel">
  <div class="funnel-card">
    <div class="check" aria-hidden="true">✓</div>
    <p class="eyebrow">${booked ? 'Reserva recibida' : 'Registro recibido'}</p>
    <h1>${name ? `¡Gracias, ${esc(name)}!` : '¡Gracias!'} <em>${booked ? 'Tu asesoría está en camino.' : 'Ya casi está.'}</em></h1>
    <ol class="next-steps">
      ${steps.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('')}
    </ol>
    <div class="resources">
      <p class="eyebrow">Mientras tanto</p>
      <a class="text-link" href="${ROUTES.home}#testimonios">Ver testimonios de inversionistas <span aria-hidden="true">→</span></a>
      <a class="text-link" href="${ROUTES.home}#obra">Ver el avance de obra <span aria-hidden="true">→</span></a>
      ${wa ? `<a class="text-link" href="${esc(wa)}" target="_blank" rel="noopener">¿Dudas? Escríbenos por WhatsApp <span aria-hidden="true">↗</span></a>` : ''}
    </div>
  </div>
</main>
${footerHTML()}`;
}
