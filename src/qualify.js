// Reglas del formulario sin dependencias del DOM (se prueban con `npm test`).

import { NO_CAPITAL, RESIDENCE_GOAL, PHONE_COUNTRIES } from './content.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value = '') {
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

export function isValidName(value = '') {
  const v = value.trim();
  return v.length >= 3 && v.length <= 100 && /\p{L}/u.test(v);
}

/**
 * Normaliza un teléfono a formato E.164 (+521234567890) según el país elegido.
 * Devuelve '' si no es válido.
 */
export function normalizePhone(country, raw = '') {
  let digits = String(raw).replace(/\D/g, '');
  const entry = PHONE_COUNTRIES.find((c) => c.code === country);

  if (!entry || entry.code === 'OTRO') {
    // Otro país: se espera el número completo con lada internacional.
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : '';
  }

  if (entry.code === 'MX') {
    if (digits.length === 13 && digits.startsWith('521')) digits = digits.slice(3); // formato móvil antiguo
    else if (digits.length === 12 && digits.startsWith('52')) digits = digits.slice(2);
    return digits.length === 10 ? `+52${digits}` : '';
  }

  // US / CA
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  return digits.length === 10 ? `+1${digits}` : '';
}

export function splitName(full = '') {
  const parts = full.trim().replace(/\s+/g, ' ').split(' ');
  return { first_name: parts.shift() || '', last_name: parts.join(' ') };
}

/** Regla de calificación: sin capital disponible => no califica. */
export function evaluateQualification(answers) {
  if (answers.capital === NO_CAPITAL) return { qualified: false, reason: 'sin_capital' };
  return { qualified: true, needsClarification: answers.objetivo === RESIDENCE_GOAL };
}
