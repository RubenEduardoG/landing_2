// Piezas compartidas entre páginas: escape, navegación, footer, media y avisos.
import { CONFIG, ROUTES, isLive } from './config.js';
import { LEGAL, MESSAGES } from './content.js';

export const esc = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const arrow = '<span aria-hidden="true" class="arrow">→</span>';

export const ctaLink = (label, { cls = '', id = '', track = 'cta' } = {}) =>
  `<a class="btn ${cls}" href="${ROUTES.registro}" data-track="${track}"${id ? ` id="${id}"` : ''}>${esc(label)} ${arrow}</a>`;

export const brand = (href = ROUTES.home) =>
  `<a class="brand" href="${href}" aria-label="BOSCO, inicio">BOSCO<span>DEPARTAMENTOS · MÉRIDA</span></a>`;

export function navHTML({ action = 'cta' } = {}) {
  const right =
    action === 'back'
      ? `<a class="navlink" href="${ROUTES.home}"><span aria-hidden="true">←</span> Volver al proyecto</a>`
      : `<a class="navlink" href="${ROUTES.registro}" data-track="nav_cta">Agendar asesoría ${arrow}</a>`;
  return `<header class="nav"><div class="wrap nav-inner">${brand()}${right}</div></header>`;
}

export function demoBannerHTML() {
  if (isLive()) return '';
  return `<p class="demo-banner" role="note">${esc(MESSAGES.demoBanner)}</p>`;
}

export function footerHTML() {
  const year = new Date().getFullYear();
  const owner = LEGAL.responsable ? ` · ${esc(LEGAL.responsable)}` : '';
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      ${brand()}
      <nav aria-label="Enlaces legales"><a href="${esc(CONFIG.privacyUrl)}">Aviso de privacidad</a></nav>
    </div>
    <p class="footer-legal">${esc(LEGAL.disclaimer)}</p>
    <p class="footer-copy">© ${year} BOSCO Departamentos${owner} · Mérida, Yucatán, México</p>
  </div>
</footer>`;
}

// Imagen con relación de aspecto fija. Si el archivo falla, media.js muestra un respaldo neutro.
export const img = ({ src, alt, ratio = '4/3', cls = '', loading = 'lazy', sizes = '' }) => `
  <div class="media ${cls}" style="aspect-ratio:${ratio}">
    <img src="${esc(src)}" alt="${esc(alt)}" loading="${loading}" decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>
  </div>`;

export function stepsHTML(current) {
  const steps = ['Tus datos', 'Tu perfil', 'Agenda'];
  return `<ol class="steps" aria-label="Pasos del registro">${steps
    .map((label, i) => {
      const n = i + 1;
      const state = n < current ? 'done' : n === current ? 'current' : '';
      return `<li class="${state}"${n === current ? ' aria-current="step"' : ''}><span>${n < current ? '✓' : n}</span>${label}</li>`;
    })
    .join('')}</ol>`;
}

export function whatsappLink(text) {
  if (!CONFIG.whatsappNumber) return '';
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function bindMediaFallbacks(root = document) {
  root.querySelectorAll('.media img').forEach((image) => {
    const fail = () => image.closest('.media')?.classList.add('is-missing');
    image.addEventListener('error', fail, { once: true });
    if (image.complete && image.naturalWidth === 0 && image.src) fail();
  });
}
