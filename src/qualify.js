import { CONFIG, ROUTES } from './config.js';
import { NO_CAPITAL, RESIDENCE_GOAL } from './content.js';

const PHONE_MESSAGE = 'Ingresa un número de WhatsApp con 10 a 15 dígitos.';

export function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

// Regla de calificación: sin capital disponible => no califica.
export function evaluateQualification(data) {
  if (data.get('capital') === NO_CAPITAL) return { qualified: false };
  return { qualified: true, needsClarification: data.get('objetivo') === RESIDENCE_GOAL };
}

// Captura UTMs para atribución. Se conservan solo si el visitante acepta (ver consentimiento).
export function getUtmParams(search = location.search) {
  const params = new URLSearchParams(search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  return Object.fromEntries(
    keys.filter((k) => params.get(k)).map((k) => [k, params.get(k).slice(0, 120)])
  );
}

function renderCalendar(calendar) {
  if (!CONFIG.ghlCalendarUrl) return;
  const slot = calendar.querySelector('.calendar-slot');
  const frame = document.createElement('iframe');
  frame.src = CONFIG.ghlCalendarUrl;
  frame.title = 'Calendario para agendar asesoría de BOSCO';
  frame.loading = 'lazy';
  frame.className = 'calendar-frame';
  slot.replaceChildren(frame);
}

export function bindQualificationForm(root) {
  const form = root.querySelector('#qualify');
  const calendar = root.querySelector('#calendar');
  const clarify = root.querySelector('#clarify');
  const phone = form.elements.whatsapp;

  phone.addEventListener('input', () => phone.setCustomValidity(''));

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    phone.setCustomValidity(isValidPhone(phone.value) ? '' : PHONE_MESSAGE);
    if (!form.reportValidity()) return;

    const result = evaluateQualification(new FormData(form));
    if (!result.qualified) {
      location.assign(ROUTES.notQualified);
      return;
    }

    // Los datos no se envían ni se registran aquí hasta configurar GHL.
    form.hidden = true;
    clarify.hidden = !result.needsClarification;
    renderCalendar(calendar);
    calendar.hidden = false;
    calendar.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    calendar.focus({ preventScroll: true });
  });
}
