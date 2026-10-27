// Página principal: VSL → promesa y CTA → beneficios → proyecto y ubicación → obra → testimonios
// → seguridad y respaldo → CTA final → footer legal.

import { ASSET_BASE as A, ROUTES } from './config.js';
import {
  ADVISOR, BENEFITS, FINAL_CTA, FLAGS, HERO, INVESTOR_PHOTOS, MESSAGES, NEWS, OBRA, PROJECT,
  SECURITY, SECURITY_MEDIA, TESTIMONIALS,
} from './content.js';
import { iconBox } from './icons.js';
import { ctaLink, esc, footerHTML, img, navHTML } from './ui.js';
import { vslHTML } from './vsl.js';

const pad = (n) => String(n).padStart(2, '0');

const heroSection = () => `
<section class="hero" id="inicio" aria-labelledby="hero-title">
  <div class="wrap hero-offer">
    <h1 id="hero-title">${HERO.titleHTML}</h1>
    <p class="lead">${esc(HERO.lead)}</p>
  </div>
  <div class="hero-video">${vslHTML()}</div>
  <div class="wrap hero-copy">
    <div class="hero-cta">
      ${ctaLink(HERO.cta, { cls: 'btn-lg', id: 'hero-cta', track: 'hero_cta' })}
      <p class="microcopy">${esc(HERO.microcopy)}</p>
    </div>
    <ul class="hero-facts" aria-label="Datos del proyecto">
      ${HERO.facts.map((f) => `<li><strong>${esc(f.value)}</strong><span>${esc(f.label)}</span></li>`).join('')}
    </ul>
  </div>
</section>`;

const benefitCard = (b) =>
  b.highlight
    ? `
        <article class="benefit benefit-highlight">
          ${b.chip ? `<span class="benefit-chip">${esc(b.chip)}</span>` : ''}
          <div>
            <p class="benefit-figure" aria-hidden="true">${esc(b.figure)}<span>%</span></p>
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.text)}</p>
            ${b.note ? `<p class="benefit-note">${esc(b.note)}</p>` : ''}
          </div>
        </article>`
    : `
        <article class="benefit">
          ${iconBox(b.icon)}
          <div>
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.text)}</p>
          </div>
        </article>`;

const benefitsSection = () => `
<section class="section" id="beneficios" aria-labelledby="beneficios-title">
  <div class="wrap">
    <p class="eyebrow">Beneficios</p>
    <h2 id="beneficios-title">Todo lo que obtienes <em>al invertir en BOSCO.</em></h2>
    <div class="benefits">
      ${BENEFITS.map(benefitCard).join('')}
    </div>
    ${
      FLAGS.plusvaliaTable
        ? `<figure class="table-figure">${img({ src: `${A}imagenes/tabla-plusvalia-bosco.webp`, alt: 'Escenario ilustrativo de BOSCO frente a CETES', ratio: '1170/639', cls: 'media-contain' })}
           <figcaption class="fine">Escenario ilustrativo. No constituye una promesa de rendimiento.</figcaption></figure>`
        : ''
    }
  </div>
</section>`;

const projectSection = () => `
<section class="section section-alt" id="proyecto" aria-labelledby="proyecto-title">
  <div class="wrap">
    <div class="project-grid">
      <div>
        <p class="eyebrow">El proyecto</p>
        <h2 id="proyecto-title">${esc(PROJECT.name)}, <em>norte de Mérida.</em></h2>
        <p class="section-intro">${esc(PROJECT.intro)}</p>
      </div>
      <div class="location card">
        <p class="eyebrow">Ubicación</p>
        <h3>Mérida, Yucatán</h3>
        <p>${esc(PROJECT.location)}</p>
        <a class="text-link" href="${esc(PROJECT.mapUrl)}" target="_blank" rel="noopener">${esc(PROJECT.mapLabel)} <span aria-hidden="true">↗</span></a>
      </div>
    </div>

    <ul class="project-gallery" aria-label="Datos del proyecto">
      ${PROJECT.facts
        .map(
          (f) => `
        <li class="project-card">
          <img src="${esc(f.image)}" alt="${esc(f.alt)}" loading="lazy" decoding="async">
          <div class="project-card-text">
            <span>${esc(f.label)}</span>
            <strong>${esc(f.value)}</strong>
          </div>
        </li>`
        )
        .join('')}
    </ul>
    <p class="fine gallery-note">${esc(PROJECT.galleryNote)}</p>

    <h3 class="subhead">¿Por qué grandes empresas apuestan por Yucatán?</h3>
    <div class="news">
      ${NEWS.map(
        (n) => `
        <a class="news-card" href="${esc(n.url)}" target="_blank" rel="noopener">
          ${img({ src: n.image, alt: '', ratio: '16/10' })}
          <span class="news-source">${esc(n.source)} <span aria-hidden="true">↗</span></span>
          <span class="news-title">${esc(n.title)}</span>
        </a>`
      ).join('')}
    </div>
  </div>
</section>`;

const obraSection = () => `
<section class="section" id="obra" aria-labelledby="obra-title">
  <div class="wrap">
    <p class="eyebrow">Avance de obra</p>
    <h2 id="obra-title">El proyecto avanza. <em>Tu inversión, también.</em></h2>
    <div class="obra-grid">
      ${OBRA.photos
        .map((p, i) =>
          img({
            src: p.src,
            alt: p.alt,
            ratio: p.portrait ? '3/4' : '16/9',
            cls: `obra-item${i === 0 ? ' obra-main' : ''}${p.portrait ? ' obra-portrait' : ''}`,
          })
        )
        .join('')}
    </div>
    <p class="fine obra-caption">${esc(OBRA.caption)}</p>
    <div class="center spaced">${ctaLink('Quiero agendar un recorrido', { track: 'obra_cta' })}</div>
  </div>
</section>`;

const testimonialCard = (t) => {
  const showFigure = FLAGS.testimonialFigures && t.figure;
  return `
  <article class="testimonial">
    <div class="media media-video" style="aspect-ratio:9/16">
      <video controls playsinline preload="none" poster="${A}imagenes/${esc(t.poster)}" aria-label="Testimonio en video de ${esc(t.name)}">
        <source src="${A}videos/${esc(t.video)}" type="video/mp4">
      </video>
    </div>
    <div class="testimonial-body">
      <h3>${esc(t.name)}</h3>
      ${t.quote ? `<p>“${esc(t.quote)}”</p>` : '<p class="muted">Mira su experiencia en video.</p>'}
      ${showFigure ? `<p class="testimonial-figure">${esc(t.figure)}</p>` : ''}
    </div>
  </article>`;
};

const testimonialsSection = () => `
<section class="section section-alt" id="testimonios" aria-labelledby="testimonios-title">
  <div class="wrap">
    <p class="eyebrow">Testimonios</p>
    <h2 id="testimonios-title">Personas como tú <em>ya invirtieron en BOSCO.</em></h2>
    <p class="section-intro">Escucha directamente a inversionistas del proyecto.</p>
  </div>
  <div class="testimonials" tabindex="0" aria-label="Testimonios en video, desliza para ver más">
    ${TESTIMONIALS.map(testimonialCard).join('')}
  </div>
  <div class="wrap">
    <p class="fine">${esc(MESSAGES.disclaimerResults)}</p>
    <h3 class="subhead">Más de 50 familias ya forman parte del proyecto</h3>
    <div class="investors">
      ${INVESTOR_PHOTOS.map((p) => img({ src: p.src, alt: p.alt, ratio: '4/5' })).join('')}
    </div>
  </div>
</section>`;

const securitySection = () => `
<section class="section" id="seguridad" aria-labelledby="seguridad-title">
  <div class="wrap">
    <p class="eyebrow">Seguridad de tu inversión</p>
    <h2 id="seguridad-title">4 razones para invertir <em>con tranquilidad.</em></h2>
    <div class="security">
      <ol class="security-list">
        ${SECURITY.map(
          (s, i) => `
          <li>
            ${iconBox(s.icon)}
            <div>
              <span class="num">${pad(i + 1)}</span>
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.text)}</p>
            </div>
          </li>`
        ).join('')}
      </ol>
      <div class="security-collage">
        <figure class="collage-main">
          ${img({ src: SECURITY_MEDIA.main.src, alt: SECURITY_MEDIA.main.alt, ratio: '4/3.4' })}
          <figcaption class="photo-tag"><span aria-hidden="true"></span>${esc(SECURITY_MEDIA.main.tag)}</figcaption>
        </figure>
        ${SECURITY_MEDIA.extra.map((im) => img({ src: im.src, alt: im.alt, ratio: '1/1' })).join('')}
        <p class="fine collage-caption">${esc(SECURITY_MEDIA.caption)}</p>
      </div>
    </div>

    <div class="advisor">
      ${img({ src: ADVISOR.photo, alt: `${ADVISOR.name}, ${ADVISOR.role}`, ratio: '4/5', cls: 'advisor-photo' })}
      <div>
        <p class="eyebrow">Tu asesora</p>
        <h2>Conoce a <em>${esc(ADVISOR.name)}.</em></h2>
        <p class="advisor-role">${esc(ADVISOR.role)}</p>
        <p>${esc(ADVISOR.bio)}</p>
        ${ctaLink('Agendar mi asesoría', { track: 'advisor_cta' })}
      </div>
    </div>
  </div>
</section>`;

const finalCtaSection = () => `
<section class="section final-cta" aria-labelledby="final-title">
  <div class="wrap center">
    <h2 id="final-title">${FINAL_CTA.title}</h2>
    <p>${esc(FINAL_CTA.text)}</p>
    ${ctaLink(FINAL_CTA.cta, { cls: 'btn-dark btn-lg', track: 'final_cta' })}
  </div>
</section>`;

const stickyCta = () => `
<div class="sticky-cta" id="sticky-cta" aria-hidden="true">
  <a class="btn btn-block" href="${ROUTES.registro}" tabindex="-1" data-track="sticky_cta">${esc(HERO.cta)} <span aria-hidden="true" class="arrow">→</span></a>
</div>`;

export function landingHTML() {
  return `
<a class="skip" href="#beneficios">Saltar al contenido</a>
${navHTML()}
<main>
  ${heroSection()}
  ${benefitsSection()}
  ${projectSection()}
  ${obraSection()}
  ${testimonialsSection()}
  ${securitySection()}
  ${finalCtaSection()}
</main>
${footerHTML()}
${stickyCta()}`;
}
