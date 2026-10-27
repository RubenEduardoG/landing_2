// Textos visibles al público · español de México (es-MX).
//
// Origen del contenido:
// - Promesa principal: propuesta por el cliente (informe 24/10).
// - 5 beneficios y 4 razones de seguridad: contenido aprobado del proyecto BOSCO, redactado con cautela
//   (se quitaron "garantizada", ingresos estimados por renta y otras promesas no verificadas).
// - Fotos de obra: cuadros extraídos de la propia VSL entregada (material real del proyecto).
//
// Todo dato marcado con [VERIFICAR] debe confirmarse con documentos antes de pautar en producción.
// La lista completa está en docs/PENDIENTES-PRODUCCION.md.

import { ASSET_BASE as A } from './config.js';

// Interruptores de contenido sensible. Activar solo con autorización por escrito.
export const FLAGS = {
  // Cifras de plusvalía por testimonio ($385,000 / $400,000 MXN). [VERIFICAR] autorización y respaldo.
  testimonialFigures: false,
  // Tabla de proyección BOSCO vs CETES. Es una proyección a futuro y la imagen usa 7% mientras
  // el resto del material habla de 15%. Mantener apagada hasta aclararlo.
  plusvaliaTable: false,
};

export const ADVISOR = {
  // [VERIFICAR] Asesora que da la cara en la VSL y atiende las citas de esta campaña.
  name: 'Marisol Caro',
  role: 'Asesora en inversión inmobiliaria',
  photo: `${A}imagenes/marisol.webp`,
  // [VERIFICAR] "más de 60 familias" proviene del material anterior.
  bio: 'Ha acompañado a más de 60 familias en su inversión inmobiliaria. Te explica el proyecto, el contrato y los pasos con claridad, sin presión.',
};

export const HERO = {
  titleHTML: 'Invierte en el <em>norte de Mérida</em>',
  // [VERIFICAR] "más de 50 familias regias".
  lead: 'En el proyecto donde más de 50 familias regias han invertido, con avance de obra real y ubicación privilegiada.',
  cta: 'Continuar registro',
  microcopy: 'Toma 1 minuto · Sin compromiso de compra',
  facts: [
    { value: '+50', label: 'familias regias invirtiendo' },
    { value: 'Dic 2028', label: 'entrega estimada' },
    { value: 'CONSUR', label: 'desarrollador con 15 años de experiencia' },
  ],
};

export const BENEFITS = [
  // La tarjeta destacada va primero: en escritorio ocupa la columna izquierda completa y en móvil aparece arriba.
  {
    highlight: true,
    chip: 'Dato histórico',
    figure: '15',
    title: 'Plusvalía en los últimos 4 años',
    text: 'Es el crecimiento de valor que ha registrado el proyecto en ese periodo.',
    note: 'La plusvalía pasada no garantiza rendimientos futuros.',
  },
  {
    icon: 'llave',
    title: 'Tu departamento en preventa',
    text: 'Enganche desde $250,000 MXN. El precio aumenta conforme avanza la obra, por eso entrar en preventa es la mejor etapa.',
  },
  {
    icon: 'sillon',
    title: 'Amueblado y equipado',
    text: 'Se entrega listo para habitarlo, rentarlo o publicarlo en plataformas de renta vacacional.',
  },
  {
    icon: 'chat',
    title: `Acompañamiento de ${ADVISOR.name.split(' ')[0]}`,
    text: 'Te guía desde la firma del contrato hasta la entrega. Resuelve tus dudas y trámites por WhatsApp.',
  },
  {
    icon: 'casa',
    title: 'Recorrido en obra',
    text: 'Puedes visitar el terreno y ver el avance de la construcción en persona.',
  },
];

export const PROJECT = {
  name: 'BOSCO Temozón',
  intro:
    'Departamentos en Temozón Norte, una de las zonas de mayor crecimiento de Mérida, desarrollados por CONSUR.',
  // Datos del proyecto mostrados como tarjetas con imagen.
  // Imágenes provisionales: renders tomados de la VSL. Reemplazar por los renders oficiales del cliente
  // (mismo nombre de archivo en public/assets/imagenes/renders/ o cambiar la ruta aquí).
  facts: [
    { label: 'Tipología', value: 'Departamentos de 1 y 2 recámaras', image: `${A}imagenes/renders/render-interior.webp`, alt: 'Render del interior de un departamento de BOSCO' },
    { label: 'Amenidades', value: 'Más de 15 amenidades', image: `${A}imagenes/renders/render-alberca.webp`, alt: 'Render de la alberca y áreas verdes de BOSCO' },
    { label: 'Desarrollador', value: 'CONSUR', image: `${A}imagenes/renders/render-fachada.webp`, alt: 'Render de la fachada de BOSCO' },
    { label: 'Entrega estimada', value: 'Diciembre 2028', image: `${A}imagenes/obra/obra-aerea-2.webp`, alt: 'Vista aérea del avance de obra de BOSCO' },
  ],
  galleryNote: 'Imágenes ilustrativas del proyecto. La última foto corresponde al avance de obra.',
  location:
    'Mérida es reconocida como una de las ciudades más seguras y con mejor calidad de vida de México. El proyecto está a unos 20 minutos de la playa y a 20 minutos del Centro Histórico.',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Temoz%C3%B3n+Norte%2C+M%C3%A9rida%2C+Yucat%C3%A1n',
  mapLabel: 'Ver la zona en Google Maps',
};

export const NEWS = [
  {
    source: 'IMER Noticias',
    title: 'Heineken invertirá 2,750 millones de dólares en una nueva planta en Yucatán.',
    url: 'https://noticias.imer.mx/blog/heineken-invertira-2-mil-750-mdd-en-mexico-habra-nueva-planta-cervecera-en-yucatan/',
    image: `${A}imagenes/noticias/heinekenmerida.webp`,
  },
  {
    source: 'Forbes México',
    title: 'Walmart abre su primer centro de distribución omnicanal en Yucatán.',
    url: 'https://forbes.com.mx/negocios-walmart-yucatan-primer-centro-distribucion-omnicanal/',
    image: `${A}imagenes/noticias/walmartmerida.webp`,
  },
  {
    source: 'El Economista',
    title: 'Yucatán se ha convertido en un estado ideal para invertir.',
    url: 'https://www.eleconomista.com.mx/estados/Yucatan-se-ha-convertido-en-un-estado-ideal-para-invertir-Mauricio-Vila-20231124-0008.html',
    image: `${A}imagenes/noticias/merida.webp`,
  },
];

// Fotos de avance de obra. Agregar nuevas fotos fechadas al inicio del arreglo.
export const OBRA = {
  // [VERIFICAR] Fecha de las tomas y porcentaje de avance.
  caption: 'Tomas del avance de obra incluidas en la presentación del proyecto.',
  photos: [
    { src: `${A}imagenes/obra/obra-aerea-2.webp`, alt: 'Vista aérea de los edificios de BOSCO en construcción' },
    { src: `${A}imagenes/obra/obra-fachada.webp`, alt: 'Fachada de BOSCO en obra negra' },
    { src: `${A}imagenes/obra/obra-aerea-1.webp`, alt: 'Vista aérea lateral del avance de obra de BOSCO' },
    { src: `${A}imagenes/construccion.webp`, alt: `${ADVISOR.name} recorriendo el interior de la obra`, portrait: true },
  ],
};

// Testimonios en video entregados por BOSCO. Las citas se conservan tal como estaban; no editarlas sin respaldo.
// figure solo se muestra con FLAGS.testimonialFigures.
export const TESTIMONIALS = [
  {
    name: 'Francelia',
    quote: 'Mi miedo era perder mi dinero en un fraude. Marisol me mostró el contrato, me explicó todo, y entendí que estaba protegida.',
    figure: '$385,000 MXN de plusvalía en menos de un año',
    poster: 'francelia-video.webp',
    video: 'francelia.mp4',
  },
  {
    name: 'Paul',
    quote: 'No sabía nada de bienes raíces. Marisol me explicó todo con tanta claridad que firmé con confianza.',
    figure: '$400,000 MXN de plusvalía antes de la entrega',
    poster: 'paul-video.webp',
    video: 'paul.mp4',
  },
  {
    name: 'Majo',
    quote: 'Nos dio mucha claridad y paciencia para explicarnos lo legal, la ubicación y las formas de invertir.',
    poster: 'majo-video.webp',
    video: 'majo.mp4',
  },
  {
    name: 'Ana Karen',
    quote: '',
    poster: 'ana-karen-video.webp',
    video: 'ana-karen.mp4',
  },
  {
    name: 'Rogel',
    quote: '',
    poster: 'rogel.webp',
    video: 'rogel.mp4',
  },
];

export const INVESTOR_PHOTOS = [
  { src: `${A}imagenes/inversionistas-1.webp`, alt: 'Inversionistas de BOSCO Temozón con su reconocimiento' },
  { src: `${A}imagenes/inversionistas-2.webp`, alt: 'Inversionista firmando su contrato' },
  { src: `${A}imagenes/inversionistas-3.webp`, alt: 'Pareja de inversionistas firmando su contrato' },
];

export const SECURITY = [
  {
    icon: 'contrato',
    title: 'Contrato adherido a PROFECO',
    // [VERIFICAR] número de registro del contrato de adhesión.
    text: 'El contrato de compraventa está adherido a la Procuraduría Federal del Consumidor. Puedes revisarlo completo antes de firmar.',
  },
  {
    icon: 'edificio',
    title: 'CONSUR, 15 años de experiencia',
    text: 'CONSUR cuenta con 15 años de experiencia en desarrollo inmobiliario.',
  },
  {
    icon: 'escudo',
    title: 'Licencias y permisos vigentes',
    // [VERIFICAR] licencias y factibilidades vigentes.
    text: 'BOSCO cuenta con licencia de construcción, factibilidades y permisos municipales. Puedes solicitarlos durante tu asesoría.',
  },
  {
    icon: 'persona',
    title: `${ADVISOR.name.split(' ')[0]} también invirtió aquí`,
    text: 'No solo recomienda el proyecto: decidió poner su propio dinero en él.',
  },
];

// Collage de la sección de seguridad: foto principal + renders de otros proyectos de CONSUR.
export const SECURITY_MEDIA = {
  main: {
    src: `${A}imagenes/construccion.webp`,
    alt: `${ADVISOR.name} recorriendo la obra de BOSCO`,
    tag: `${ADVISOR.name.split(' ')[0]} en la obra de BOSCO`,
  },
  extra: [
    { src: `${A}imagenes/consur-temozon.jpg`, alt: 'Render de Centro Temozón, proyecto de CONSUR' },
    { src: `${A}imagenes/consur-mio.jpg`, alt: 'Render de MIO, proyecto de CONSUR' },
  ],
  caption: 'Otros proyectos de CONSUR: Centro Temozón y MIO.',
};

export const FINAL_CTA = {
  title: 'El mejor momento para <em>informarte es hoy.</em>',
  text: 'Responde unas preguntas, elige un horario y resuelve tus dudas con una asesora. Sin compromiso de compra.',
  cta: 'Continuar registro',
};

// ---------- Formulario de calificación ----------
// Opciones del formulario aprobado de la segunda landing. [VERIFICAR] contra el formulario final.

export const NO_CAPITAL = 'No tengo capital disponible';
export const RESIDENCE_GOAL = 'Para irme a vivir a Mérida';

export const FORM_OPTIONS = {
  estado: [
    'Nuevo León', 'Ciudad de México', 'Estado de México', 'Jalisco', 'Yucatán', 'Coahuila', 'Tamaulipas',
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Michoacán', 'Morelos', 'Nayarit', 'Oaxaca', 'Puebla',
    'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tlaxcala', 'Veracruz',
    'Zacatecas', 'Vivo fuera de México',
  ],
  experiencia: ['Sí, ya he invertido', 'No, sería mi primera inversión'],
  plazo: ['Ahora mismo', 'En los próximos 3 meses', 'En los próximos 6 meses', 'Todavía estoy evaluando'],
  objetivo: [RESIDENCE_GOAL, 'Para que me genere dinero', 'Para que sea mi lugar de vacaciones'],
  capital: [NO_CAPITAL, '$250,000 – $300,000 MXN', 'Más de $300,000 MXN'],
};

export const PHONE_COUNTRIES = [
  { code: 'MX', dial: '52', label: 'México (+52)' },
  { code: 'US', dial: '1', label: 'Estados Unidos (+1)' },
  { code: 'CA', dial: '1', label: 'Canadá (+1)' },
  { code: 'OTRO', dial: '', label: 'Otro país' },
];

export const MESSAGES = {
  residenceClarification:
    'Antes de agendar, te aclaramos que BOSCO está pensado como inversión inmobiliaria y no necesariamente como vivienda inmediata. Si aun así quieres conocer el proyecto, con gusto te atendemos.',
  notQualifiedTitle: 'Gracias por tu interés en BOSCO',
  notQualified:
    'Por ahora, el proyecto requiere un capital inicial disponible para el enganche, por lo que no podemos agendarte una asesoría en este momento. Si tu situación cambia, puedes registrarte de nuevo cuando lo desees.',
  demoBanner:
    'Versión de prueba: los datos todavía no se envían al CRM y no se crean citas reales.',
  disclaimerResults: 'Experiencias individuales. Los resultados pasados no garantizan rendimientos futuros.',
};

// ---------- Datos legales ----------
// [VERIFICAR] Completar con datos reales del responsable de esta campaña. Vacío = la página lo marca como pendiente.
export const LEGAL = {
  responsable: '', // Nombre o razón social del responsable del tratamiento de datos
  domicilio: '',
  emailPrivacidad: '', // Correo para solicitudes de derechos ARCO
  actualizado: '',     // Fecha de última actualización del aviso (ej. "24 de octubre de 2026")
  disclaimer:
    'La información de este sitio es de carácter informativo y no constituye una oferta vinculante ni asesoría financiera. Precios, disponibilidad, fechas de entrega y condiciones están sujetos a cambio y a lo establecido en el contrato. Los rendimientos pasados no garantizan rendimientos futuros.',
};
