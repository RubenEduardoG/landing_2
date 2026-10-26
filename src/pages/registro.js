// /registro · Formulario de calificación en dos pasos.
// Paso 1: datos de contacto + consentimiento (se envía como registro parcial para seguimiento).
// Paso 2: perfil de inversión → califica: /agenda · no califica: /no-califica.

import { boot, render, app } from '../boot.js';
import { CONFIG, ROUTES } from '../config.js';
import { FORM_OPTIONS, PHONE_COUNTRIES } from '../content.js';
import { evaluateQualification, isValidEmail, isValidName, normalizePhone, splitName } from '../qualify.js';
import { readSession, writeSession, newId } from '../session.js';
import { sendLead } from '../lead.js';
import { track } from '../tracking.js';
import { demoBannerHTML, esc, footerHTML, navHTML, stepsHTML } from '../ui.js';

const CONSENT_TEXT =
  'Acepto el aviso de privacidad y autorizo que BOSCO me contacte por WhatsApp, llamada y correo electrónico sobre este proyecto.';

const options = (list, selected = '') =>
  `<option value="">Selecciona una opción</option>${list
    .map((o) => `<option${o === selected ? ' selected' : ''}>${esc(o)}</option>`)
    .join('')}`;

const field = (name, label, control, hint = '') => `
  <div class="field" data-field="${name}">
    <label for="f-${name}">${label}</label>
    ${control}
    ${hint ? `<p class="hint" id="hint-${name}">${hint}</p>` : ''}
    <p class="error" id="err-${name}" aria-live="polite"></p>
  </div>`;

const select = (name, label, list, value) =>
  field(name, label, `<select id="f-${name}" name="${name}" required aria-describedby="err-${name}">${options(list, value)}</select>`);

function pageHTML(saved) {
  const a = saved.answers || {};
  const c = saved.contact || {};
  return `
${navHTML({ action: 'back' })}
${demoBannerHTML()}
<main class="funnel">
  <div class="funnel-card">
    <div id="steps">${stepsHTML(1)}</div>

    <form id="step-1" class="step" novalidate>
      <p class="eyebrow">Paso 1 de 2</p>
      <h1>Cuéntanos <em>sobre ti.</em></h1>
      <p class="funnel-intro">Para preparar tu asesoría sobre BOSCO necesitamos algunos datos. Solo toma un minuto.</p>
      ${field('nombre', 'Nombre completo', `<input id="f-nombre" name="nombre" autocomplete="name" maxlength="100" required value="${esc(c.nombre || '')}" aria-describedby="err-nombre">`)}
      ${field(
        'whatsapp',
        'WhatsApp',
        `<div class="phone">
          <select name="pais" aria-label="Lada del país">${PHONE_COUNTRIES.map(
            (p) => `<option value="${p.code}"${p.code === (c.pais || 'MX') ? ' selected' : ''}>${esc(p.label)}</option>`
          ).join('')}</select>
          <input id="f-whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="20" required placeholder="10 dígitos" value="${esc(c.whatsapp || '')}" aria-describedby="hint-whatsapp err-whatsapp">
        </div>`,
        'Te enviaremos la confirmación de tu cita por WhatsApp.'
      )}
      ${field('email', 'Correo electrónico', `<input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required placeholder="nombre@correo.com" value="${esc(c.email || '')}" aria-describedby="err-email">`)}
      <div class="trap" aria-hidden="true"><label>Empresa<input name="empresa" tabindex="-1" autocomplete="off"></label></div>
      <div class="field" data-field="consentimiento">
        <label class="consent">
          <input type="checkbox" name="consentimiento" required${c.consentimiento ? ' checked' : ''} aria-describedby="err-consentimiento">
          <span>Acepto el <a href="${esc(CONFIG.privacyUrl)}" target="_blank" rel="noopener">aviso de privacidad</a> y autorizo que BOSCO me contacte por WhatsApp, llamada y correo electrónico sobre este proyecto.</span>
        </label>
        <p class="error" id="err-consentimiento" aria-live="polite"></p>
      </div>
      <button class="btn btn-block btn-lg" type="submit">Continuar <span aria-hidden="true" class="arrow">→</span></button>
      <p class="fine center">Tus datos se usan solo para darte información sobre BOSCO.</p>
    </form>

    <form id="step-2" class="step" novalidate hidden>
      <p class="eyebrow">Paso 2 de 2</p>
      <h1>Tu perfil <em>de inversión.</em></h1>
      <p class="funnel-intro">Con estas respuestas preparamos una asesoría a tu medida.</p>
      ${select('estado', '¿En qué estado de México vives?', FORM_OPTIONS.estado, a.estado)}
      ${select('experiencia', '¿Ya has invertido en bienes raíces antes?', FORM_OPTIONS.experiencia, a.experiencia)}
      ${select('plazo', '¿En cuánto tiempo quieres invertir?', FORM_OPTIONS.plazo, a.plazo)}
      ${select('objetivo', '¿Para qué te gustaría tener un departamento?', FORM_OPTIONS.objetivo, a.objetivo)}
      ${select('capital', '¿Con cuánto capital cuentas hoy para invertir?', FORM_OPTIONS.capital, a.capital)}
      <button class="btn btn-block btn-lg" type="submit">Ver horarios disponibles <span aria-hidden="true" class="arrow">→</span></button>
      <button class="text-button" type="button" id="back-1"><span aria-hidden="true">←</span> Editar mis datos</button>
      <p class="status" id="status" role="status" aria-live="polite"></p>
    </form>
  </div>
</main>
${footerHTML()}`;
}

function setError(form, name, message) {
  const wrap = form.querySelector(`[data-field="${name}"]`);
  wrap?.classList.toggle('has-error', Boolean(message));
  const el = form.querySelector(`#err-${name}`);
  if (el) el.textContent = message || '';
  const control = form.elements[name];
  if (control?.setAttribute) control.setAttribute('aria-invalid', String(Boolean(message)));
}

function showErrors(form, errors) {
  Object.keys(errors).forEach((name) => setError(form, name, errors[name]));
  const first = Object.keys(errors).find((k) => errors[k]);
  if (first) form.elements[first]?.focus();
  return !first;
}

function validateStep1(form) {
  const f = form.elements;
  const phone = normalizePhone(f.pais.value, f.whatsapp.value);
  const errors = {
    nombre: isValidName(f.nombre.value) ? '' : 'Escribe tu nombre completo.',
    whatsapp: phone
      ? ''
      : f.pais.value === 'OTRO'
        ? 'Escribe tu número completo con lada internacional.'
        : 'Escribe un número de WhatsApp de 10 dígitos.',
    email: isValidEmail(f.email.value) ? '' : 'Escribe un correo electrónico válido.',
    consentimiento: f.consentimiento.checked ? '' : 'Necesitamos tu autorización para contactarte.',
  };
  return { ok: showErrors(form, errors), phone };
}

function validateStep2(form) {
  const errors = {};
  ['estado', 'experiencia', 'plazo', 'objetivo', 'capital'].forEach((name) => {
    errors[name] = form.elements[name].value ? '' : 'Selecciona una opción.';
  });
  return showErrors(form, errors);
}

function setStep(n) {
  const one = app.querySelector('#step-1');
  const two = app.querySelector('#step-2');
  one.hidden = n !== 1;
  two.hidden = n !== 2;
  app.querySelector('#steps').innerHTML = stepsHTML(n);
  const target = n === 1 ? one : two;
  target.querySelector('h1').setAttribute('tabindex', '-1');
  target.querySelector('h1').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

boot();
const saved = readSession();
render(pageHTML(saved));

const step1 = app.querySelector('#step-1');
const step2 = app.querySelector('#step-2');
const startedAt = Date.now();
const leadId = saved.leadId || newId();
writeSession({ leadId });

// Inicio del formulario (una vez por sesión).
let started = Boolean(saved.formStarted);
app.addEventListener('focusin', (event) => {
  if (started || !event.target.closest('form')) return;
  started = true;
  writeSession({ formStarted: true });
  track('form_start', { form_id: 'calificacion' });
});

// Limpia el error de un campo al corregirlo.
app.addEventListener('input', (event) => {
  const form = event.target.form;
  const name = event.target.name === 'pais' ? 'whatsapp' : event.target.name;
  if (form && name) setError(form, name, '');
});
app.addEventListener('change', (event) => {
  const form = event.target.form;
  if (form && event.target.name) setError(form, event.target.name === 'pais' ? 'whatsapp' : event.target.name, '');
});

const basePayload = (contact) => {
  const session = readSession();
  return {
    lead_id: leadId,
    nombre: contact.nombre,
    ...splitName(contact.nombre),
    email: contact.email,
    phone: contact.phone,
    phone_country: contact.pais,
    consent: true,
    consent_text: CONSENT_TEXT,
    consent_at: contact.consent_at,
    website: step1.elements.empresa.value, // trampa anti-bots
    elapsed_ms: Date.now() - startedAt,
    attribution: session.attribution || {},
  };
};

step1.addEventListener('submit', (event) => {
  event.preventDefault();
  const { ok, phone } = validateStep1(step1);
  if (!ok) return;
  const f = step1.elements;
  const contact = {
    nombre: f.nombre.value.trim().replace(/\s+/g, ' '),
    email: f.email.value.trim().toLowerCase(),
    whatsapp: f.whatsapp.value.trim(),
    pais: f.pais.value,
    phone,
    consentimiento: true,
    consent_at: new Date().toISOString(),
  };
  writeSession({ contact });
  track('form_step_complete', { form_id: 'calificacion', step: 1 });
  // Registro parcial: permite dar seguimiento a quien no termina. No bloquea al usuario.
  sendLead({ ...basePayload(contact), stage: 'parcial' }, { timeoutMs: 4000 });
  setStep(2);
});

app.querySelector('#back-1').addEventListener('click', () => setStep(1));

let submitting = false;
step2.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting || !validateStep2(step2)) return;
  submitting = true;
  const button = step2.querySelector('button[type=submit]');
  const status = app.querySelector('#status');
  button.disabled = true;
  status.textContent = 'Guardando tus respuestas…';

  const f = step2.elements;
  const answers = {
    estado: f.estado.value,
    experiencia: f.experiencia.value,
    plazo: f.plazo.value,
    objetivo: f.objetivo.value,
    capital: f.capital.value,
  };
  const result = evaluateQualification(answers);
  const { contact } = readSession();
  const eventId = newId();

  const response = await sendLead({
    ...basePayload(contact),
    ...answers,
    stage: 'completo',
    qualified: result.qualified,
    event_id: result.qualified ? eventId : undefined,
  });

  writeSession({
    answers,
    qualified: result.qualified,
    needsClarification: Boolean(result.needsClarification),
    leadDelivered: response.delivered,
  });

  track('form_step_complete', { form_id: 'calificacion', step: 2 });
  if (result.qualified) {
    track(
      'generate_lead',
      { form_id: 'calificacion', capital: answers.capital, plazo: answers.plazo, estado: answers.estado },
      { meta: 'Lead', eventId }
    );
    location.assign(ROUTES.agenda);
  } else {
    track('lead_not_qualified', { form_id: 'calificacion', reason: result.reason });
    location.assign(ROUTES.noCalifica);
  }
});

// Si el visitante regresa con el paso 1 completo, continúa en el paso 2.
if (saved.contact?.phone && saved.contact?.consentimiento) setStep(2);
