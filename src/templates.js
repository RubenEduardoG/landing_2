import { ASSET_BASE as A } from './config.js';
import {
  TESTIMONIALS,
  NOT_QUALIFIED_MESSAGE,
  THANK_YOU_MESSAGE,
  RESIDENCE_CLARIFICATION,
  DISCLAIMER_RESULTS,
} from './content.js';

const cta = (label = 'QUIERO CONOCER EL PROYECTO') =>
  `<a class="btn" href="#registro">${label} <span aria-hidden="true">↗</span></a>`;

// Contenedor responsivo para media. Si el archivo falta, media.js añade .is-missing y muestra el placeholder.
const media = ({ src, alt, ratio = '16/9', label, cls = '', loading = 'lazy' }) => `
  <div class="media ${cls}" style="aspect-ratio:${ratio}">
    <img src="${src}" alt="${alt}" loading="${loading}" decoding="async">
    <span class="media-missing">${label}</span>
  </div>`;

const testimonialMedia = (t) =>
  t.video
    ? `
  <div class="media media-portrait" style="aspect-ratio:4/5">
    <video controls playsinline preload="none" poster="${A}imagenes/${t.poster}" aria-label="Video de testimonio de ${t.name}">
      <source src="${A}videos/${t.video}" type="video/mp4">
    </video>
    <span class="media-missing">Video pendiente: ${t.video}</span>
  </div>`
    : media({
        src: `${A}imagenes/${t.poster}`,
        alt: `Testimonio de ${t.name}`,
        ratio: '4/5',
        cls: 'media-portrait',
        label: `Imagen pendiente: ${t.poster}`,
      });

const testimonialCards = () =>
  TESTIMONIALS.map(
    (t) => `
    <article class="testimonial">
      ${testimonialMedia(t)}
      <div class="card-content">
        <h3>${t.name}</h3>
        <p>“${t.quote}”</p>
        <div class="testimonial-result"><span>Plusvalía reportada</span><strong>${t.result}</strong></div>
      </div>
    </article>`
  ).join('');

const qualifyForm = () => `
  <form id="qualify" novalidate>
    <label>Nombre completo
      <input required name="nombre" autocomplete="name" placeholder="Tu nombre completo">
    </label>
    <label>WhatsApp
      <input required name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="+52 999 000 0000">
    </label>
    <label>Correo electrónico
      <input required name="email" type="email" autocomplete="email" placeholder="nombre@correo.com">
    </label>
    <label>¿Ya has invertido en bienes raíces antes?
      <select name="experiencia" required><option value="">Selecciona una opción</option><option>Sí</option><option>No</option></select>
    </label>
    <label>¿En cuánto tiempo quieres invertir?
      <select name="plazo" required><option value="">Selecciona una opción</option><option>Ahora mismo</option><option>En los próximos 3 meses</option><option>En los próximos 6 meses</option><option>Todavía estoy evaluando</option></select>
    </label>
    <label>¿Para qué te gustaría tener un departamento?
      <select name="objetivo" required><option value="">Selecciona una opción</option><option>Para irme a vivir a Mérida</option><option>Para que me genere dinero</option><option>Para que sea mi lugar de vacaciones</option></select>
    </label>
    <label>¿Con cuánto capital cuentas hoy para invertir?
      <select name="capital" required><option value="">Selecciona una opción</option><option>No tengo capital disponible</option><option>$250,000 – $300,000 MXN</option><option>Más de $300,000 MXN</option></select>
    </label>
    <label class="consent">
      <input type="checkbox" name="privacidad" required>
      <span>Acepto el aviso de privacidad y recibir comunicaciones de BOSCO por WhatsApp y correo electrónico.</span>
    </label>
    <button class="btn full" type="submit">CONTINUAR AL CALENDARIO <span aria-hidden="true">↗</span></button>
    <p class="fine">Vista de desarrollo: tus datos todavía no se envían. La conexión con GHL está pendiente.</p>
  </form>`;

export function landingHTML() {
  return `
<header class="nav">
  <a class="brand" href="#inicio">BOSCO<span> / DEPARTAMENTOS</span></a>
  <a class="navlink" href="#registro">AGENDAR ASESORÍA <span aria-hidden="true">↗</span></a>
</header>
<main>
  <section id="inicio" class="hero wrap">
    <div class="hero-video media" style="aspect-ratio:16/9">
      <video id="vsl" autoplay muted playsinline preload="metadata" poster="${A}imagenes/construccion.webp" aria-label="Presentación del proyecto">
        <source src="${A}videos/vsl.mp4" type="video/mp4">
      </video>
      <span class="media-missing">Video de presentación pendiente: vsl.mp4</span>
      <button id="sound" class="sound" type="button" aria-pressed="false">🔊 Activar sonido</button>
      <div class="video-label">PRESENTACIÓN DEL PROYECTO</div>
    </div>

    <p class="lead">Invierte en el norte de Mérida en el proyecto donde más de 50 familias regias han invertido, con avance de obra real y ubicación privilegiada.</p>

    <div class="center">${cta()}</div>

    <h1>INVIERTE EN EL <em>NORTE DE MÉRIDA.</em></h1>

    <div class="hero-facts">
      <div><strong>15%</strong><span>Plusvalía histórica declarada*</span></div>
      <div><strong>15 años</strong><span>Experiencia indicada del desarrollador</span></div>
      <div><strong>MÉRIDA</strong><span>Yucatán, México</span></div>
    </div>
    <p class="fine legal">*Dato declarado por el cliente, pendiente de verificación documental. La plusvalía pasada no garantiza rendimientos futuros.</p>
  </section>

  <section id="registro" class="section cream">
    <div class="wrap form-layout">
      <div>
        <p class="eyebrow red">01 / COMIENZA AQUÍ</p>
        <h2>CUÉNTANOS UN POCO <em>SOBRE TI.</em></h2>
        <p class="intro-large">Responde unas preguntas para conocer tus objetivos de inversión. Solo toma un minuto.</p>
        <ul class="form-points">
          <li>✓ Conoce las alternativas del proyecto</li>
          <li>✓ Agenda una conversación con el equipo</li>
          <li>✓ Sin compromiso de compra</li>
        </ul>
      </div>
      <div class="form-card">
        ${qualifyForm()}
        <div id="calendar" hidden tabindex="-1">
          <h3>Elige tu cita</h3>
          <p id="clarify" class="clarify" hidden>${RESIDENCE_CLARIFICATION}</p>
          <p>¡Tu perfil cumple con el requisito de capital! Elige un horario disponible a continuación.</p>
          <div class="calendar-slot">
            <div class="placeholder">CALENDARIO GHL · PENDIENTE DE CONEXIÓN</div>
          </div>
          <p class="fine">Las reservas se limitan a los próximos 2 días. Se configura en el calendario de GHL. No hay citas reales disponibles en esta vista.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section wrap">
    <p class="eyebrow">02 / EXPERIENCIAS REALES</p>
    <h2>PERSONAS COMO TÚ <em>YA PUSIERON SU DINERO A TRABAJAR.</em></h2>
    <p class="section-intro">Te compartimos testimonios de nuestros clientes que están contentos con su inversión en BOSCO.
      <span class="testimonial-disclaimer">${DISCLAIMER_RESULTS}</span></p>
    <div class="cards">${testimonialCards()}</div>
    <div class="center spaced">${cta()}</div>
  </section>

  <section class="section soft">
    <div class="wrap">
      <p class="eyebrow red">03 / ¿TE IDENTIFICAS?</p>
      <h2>QUE TU DINERO <em>NO SE QUEDE QUIETO.</em></h2>
      <div class="three">
        <article class="info"><span>01</span><h3>¿Te preocupa un fraude?</h3><p>Conoce los documentos y elementos de protección del proyecto antes de decidir.</p></article>
        <article class="info"><span>02</span><h3>¿No sabes por dónde empezar?</h3><p>Una asesoría puede ayudarte a entender los pasos y las alternativas disponibles.</p></article>
        <article class="info"><span>03</span><h3>¿Buscas diversificar?</h3><p>Explora cómo una inversión inmobiliaria podría encajar en tus objetivos.</p></article>
      </div>
    </div>
  </section>

  <section class="section security-section">
    <div class="wrap">
      <p class="eyebrow">04 / SEGURIDAD DE TU INVERSIÓN</p>
      <h2>4 RAZONES PARA CONOCER <em>LA PROTECCIÓN DE TU INVERSIÓN.</em></h2>
      <div class="security-grid">
        <article class="security-card"><span>01</span><h3>Contrato y documentación</h3><p>Solicita y revisa el contrato antes de decidir. Cualquier registro ante PROFECO debe comprobarse documentalmente.</p></article>
        <article class="security-card"><span>02</span><h3>Desarrollador CONSUR</h3><p>El material del proyecto señala 15 años de experiencia del desarrollador.</p></article>
        <article class="security-card"><span>03</span><h3>Avance y ubicación</h3><p>Conoce el estado de la obra, la ubicación y las condiciones de entrega.</p></article>
        <article class="security-card"><span>04</span><h3>Acompañamiento</h3><p>Resuelve tus dudas y revisa las condiciones comerciales y los riesgos.</p></article>
      </div>
      <p class="fine">La información legal y comercial debe verificarse con documentos oficiales.</p>
      <div class="center spaced">${cta()}</div>
    </div>
  </section>

  <section class="section soft" id="beneficios">
    <div class="wrap">
      <p class="eyebrow red">EL PROYECTO</p>
      <h2>TODO LO QUE OBTIENES <em>AL INVERTIR EN ESTE PROYECTO.</em></h2>
      <p class="section-intro">Un departamento que trabaja por ti, con acompañamiento durante el proceso.</p>
      <div class="benefits-grid">
        <article class="info"><span>01</span><h3>Tu departamento en preventa</h3><p>Opciones de enganche desde $250,000 MXN, según las condiciones comerciales del proyecto.</p></article>
        <article class="info"><span>02</span><h3>Plusvalía histórica</h3><p>El material comercial reporta 15% de plusvalía histórica. Los resultados pasados no garantizan rendimientos futuros.</p></article>
        <article class="info"><span>03</span><h3>Departamento amueblado y equipado</h3><p>Consulta con el equipo el equipamiento, las condiciones de entrega y la disponibilidad de las unidades.</p></article>
        <article class="info"><span>04</span><h3>Acompañamiento de Marisol</h3><p>Asesoría durante el proceso de inversión para resolver dudas y conocer los siguientes pasos.</p></article>
        <article class="info benefit-wide"><span>05</span><h3>Acceso a recorrido en obra</h3><p>Solicita información sobre visitas y avances de construcción disponibles.</p></article>
      </div>
    </div>
  </section>

  <section class="section cream">
    <div class="wrap split">
      ${media({ src: `${A}imagenes/marisol.webp`, alt: 'Marisol Caro, asesora de inversión inmobiliaria', ratio: '4/5', cls: 'media-portrait', label: 'Foto pendiente: reemplazo de Marisol (ver PENDING_CLIENT_ASSETS.md)' })}
      <div>
        <p class="eyebrow red">05 / ASESORÍA</p>
        <h2>CONOCE A <em>MARISOL CARO.</em></h2>
        <p>Asesora en inversión inmobiliaria. Ha acompañado a más de 60 familias y cuenta con experiencia ayudando a invertir en bienes raíces.</p>
        ${cta()}
      </div>
    </div>
  </section>

  <section class="section wrap">
    <p class="eyebrow">06 / AVANCE DE OBRA</p>
    <h2>EL PROYECTO AVANZA. <em>TU INVERSIÓN, TAMBIÉN.</em></h2>

    <div class="gallery">
      ${media({ src: `${A}imagenes/construccion.webp`, alt: 'Construcción del proyecto BOSCO', ratio: '4/3', label: 'Imagen pendiente: construccion.webp' })}
      ${media({ src: `${A}imagenes/consur-mio.jpg`, alt: 'Imagen de desarrollo CONSUR', ratio: '4/3', label: 'Imagen pendiente: consur-mio.jpg' })}
      ${media({ src: `${A}imagenes/consur-temozon.jpg`, alt: 'Imagen de desarrollo inmobiliario en Mérida', ratio: '4/3', label: 'Imagen pendiente: consur-temozon.jpg' })}
    </div>
    <div class="stats">
      <div><strong>DIC 2028</strong><span>Entrega estimada, sujeta a aprobación del cliente</span></div>
      <div><strong>CONSUR</strong><span>Desarrollador indicado</span></div>

    </div>
  </section>

  <section class="section soft" id="plusvalia">
    <div class="wrap split">
      <div>
        <p class="eyebrow red">07 / CRECIMIENTO DEL PATRIMONIO</p>
        <div class="big-number" aria-label="15 por ciento">15<span>%</span></div>
        <h2>PLUSVALÍA <em>HISTÓRICA DECLARADA.</em></h2>
        <p>El material del cliente menciona una plusvalía sostenida del 15% en los últimos cuatro años. Este dato debe verificarse documentalmente antes de publicar la campaña.</p>
        <p class="fine">La plusvalía pasada no garantiza rendimientos futuros. No constituye una promesa de inversión.</p>
      </div>
      <figure class="plusvalia-figure">
        ${media({ src: `${A}imagenes/tabla-plusvalia-bosco.webp`, alt: 'Tabla comparativa de plusvalía de BOSCO frente a CETES', ratio: '1170/639', cls: 'media-table', label: 'Tabla comparativa BOSCO y CETES', loading: 'lazy' })}
        <figcaption class="fine">Escenario ilustrativo con cifras facilitadas por el cliente, pendientes de validación. No son comparables directamente sin aclarar supuestos, costos y riesgos.</figcaption>
      </figure>
    </div>
  </section>

  <section class="section wrap">
    <p class="eyebrow">08 / MÉRIDA EN LOS MEDIOS</p>
    <h2>¿POR QUÉ GRANDES EMPRESAS <em>APUESTAN POR YUCATÁN?</em></h2>
    <div class="three news">
      <article>
        ${media({ src: `${A}imagenes/noticias/heinekenmerida.png`, alt: 'Nota sobre la inversión de Heineken en Yucatán', label: 'Imagen pendiente: heinekenmerida.png' })}
        <h3>IMER Noticias</h3><p>Inversión de Heineken en Yucatán.</p>
      </article>
      <article>
        ${media({ src: `${A}imagenes/noticias/walmartmerida.png`, alt: 'Nota sobre el centro de distribución de Walmart en Yucatán', label: 'Imagen pendiente: walmartmerida.png' })}
        <h3>Forbes México</h3><p>Centro de distribución de Walmart en Yucatán.</p>
      </article>
      <article>
        ${media({ src: `${A}imagenes/noticias/merida.png`, alt: 'Nota sobre perspectivas de inversión en Mérida', label: 'Imagen pendiente: merida.png' })}
        <h3>El Economista</h3><p>Perspectivas de inversión en Yucatán.</p>
      </article>
    </div>
  </section>

  <section class="section final-cta">
    <div class="wrap center">
      <p class="eyebrow">09 / DA EL SIGUIENTE PASO</p>
      <h2>EL MEJOR MOMENTO PARA <em>INFORMARTE ES HOY.</em></h2>
      <p>Conoce el proyecto, resuelve tus dudas y evalúa si encaja con tus objetivos.</p>
      ${cta()}
    </div>
  </section>
</main>
<footer>
  <div class="wrap footer-inner">
    <strong>BOSCO / DEPARTAMENTOS</strong>
    <span>© 2026 · Versión de desarrollo. Información legal y avisos pendientes de confirmación.</span>
  </div>
</footer>`;
}

function simplePage(title, body) {
  return `
<header class="nav">
  <a class="brand" href="/">BOSCO<span> / DEPARTAMENTOS</span></a>
  <a class="navlink" href="/">VOLVER AL INICIO <span aria-hidden="true">↗</span></a>
</header>
<main class="simple">
  <p class="eyebrow">BOSCO · MÉRIDA</p>
  <h1>${title}</h1>
  <p>${body}</p>
  <a class="btn" href="/">VOLVER A LA LANDING <span aria-hidden="true">↗</span></a>
</main>
<footer>
  <div class="wrap footer-inner"><strong>BOSCO / DEPARTAMENTOS</strong><span>© 2026 · Versión de desarrollo</span></div>
</footer>`;
}

export const notQualifiedHTML = () => simplePage('GRACIAS POR TU INTERÉS', NOT_QUALIFIED_MESSAGE);
export const thankYouHTML = () => simplePage('¡GRACIAS!', THANK_YOU_MESSAGE);
