import { boot, render, app } from '../boot.js';
import { landingHTML } from '../templates.js';
import { bindVsl, bindExclusivePlayback } from '../vsl.js';

boot();
render(landingHTML());
bindVsl(app);
bindExclusivePlayback(app);

// Botón fijo en móvil: aparece cuando el CTA principal sale de pantalla y se oculta cerca del CTA final.
const sticky = document.querySelector('#sticky-cta');
const heroCta = document.querySelector('#hero-cta');
const finalCta = document.querySelector('.final-cta');
if (sticky && heroCta && 'IntersectionObserver' in window) {
  let heroVisible = true;
  let finalVisible = false;
  const link = sticky.querySelector('a');
  const update = () => {
    const show = !heroVisible && !finalVisible && heroCta.getBoundingClientRect().top < 0;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', String(!show));
    link.tabIndex = show ? 0 : -1;
  };
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    update();
  }).observe(heroCta);
  if (finalCta) {
    new IntersectionObserver(([entry]) => {
      finalVisible = entry.isIntersecting;
      update();
    }).observe(finalCta);
  }
}
