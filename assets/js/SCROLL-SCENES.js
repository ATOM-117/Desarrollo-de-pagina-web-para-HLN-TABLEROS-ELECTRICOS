// ============================================
// SCROLL-SCENES.JS — HLN Ingeniería
// Se auto-inicializa en DOMContentLoaded.
// No depende de ningún script externo para llamarlo.
// ============================================

function gsapReady() {
    if (typeof gsap === 'undefined') { console.error('[scroll-scenes] gsap no cargó.'); return false; }
    if (typeof ScrollTrigger === 'undefined') { console.error('[scroll-scenes] ScrollTrigger no cargó.'); return false; }
    return true;
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// ESCENA 1 — HERO (solo desktop ≥ 768px)
// ============================================

function initScene_Hero() {
    if (window.innerWidth < 768) return; // móvil: CSS maneja todo

    const scene     = document.querySelector('.section--hero .scene--hero');
    const pinTarget = document.querySelector('.section--hero .sticky-container');
    const overlay   = document.querySelector('.section--hero .hero-overlay');
    const heading   = document.querySelector('.section--hero .hero-content h2');
    const paragraph = document.querySelector('.section--hero .hero-content p');
    const buttons   = document.querySelector('.section--hero .hero-buttons');

    if (!scene || !pinTarget || !heading || !paragraph || !buttons) {
        console.warn('[Hero] Elementos no encontrados.'); return;
    }

    // Quitar clases fade que compiten con GSAP
    [heading, paragraph, buttons].forEach(el => {
        el.classList.remove('fade-in', 'fade-in-up', 'fade-in-left', 'fade-in-right');
        gsap.set(el, { opacity: 0, y: 50 });
    });

    scene.style.height = '150vh';

    ScrollTrigger.create({
        trigger: scene, start: 'top top', end: 'bottom top',
        pin: pinTarget, pinSpacing: false, anticipatePin: 1, id: 'hero-pin',
    });

    const tl = gsap.timeline({
        scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom top', scrub: 1.2, id: 'hero-tl' }
    });

    tl.to(heading,   { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' }, 0)
      .to(paragraph, { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' }, 0.06)
      .to(buttons,   { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' }, 0.12)
      .to([heading, paragraph, buttons], { opacity: 0, y: -60, duration: 0.35, ease: 'power2.in', stagger: 0.04 }, 0.65);
    if (overlay) tl.to(overlay, { backgroundColor: 'rgba(0,26,51,0.75)', duration: 0.35, ease: 'none' }, 0.65);

    console.log('[Hero] OK');
}

// ============================================
// ESCENA 2 — TABLERO 3 FASES (solo desktop ≥ 768px)
// ============================================

function initScene_Tablero() {
    if (window.innerWidth < 768) return; // móvil: carrusel JS en main.js

    const scene     = document.querySelector('.section--tablero .scene--tablero');
    const pinTarget = document.querySelector('.section--tablero .sticky-container');

    if (!scene || !pinTarget) { console.warn('[Tablero] Estructura no encontrada.'); return; }

    const img1 = scene.querySelector('.tbl-img--1');
    const img2 = scene.querySelector('.tbl-img--2');
    const img3 = scene.querySelector('.tbl-img--3');
    const msg1 = scene.querySelector('.tbl-msg--1');
    const msg2 = scene.querySelector('.tbl-msg--2');
    const msg3 = scene.querySelector('.tbl-msg--3');
    const fill = scene.querySelector('.tbl-progress__fill');
    const hint = scene.querySelector('.tbl-hint');

    if (!img1 || !img2 || !img3 || !msg1 || !msg2 || !msg3) {
        console.warn('[Tablero] Elementos no encontrados.'); return;
    }

    scene.style.height = '400vh';

    gsap.set(img1, { opacity: 1 });
    gsap.set(img2, { opacity: 0 });
    gsap.set(img3, { opacity: 0 });
    gsap.set(msg1, { opacity: 1, y: 0 });
    gsap.set(msg2, { opacity: 0, y: 14 });
    gsap.set(msg3, { opacity: 0, y: 14 });
    if (fill) gsap.set(fill, { width: '0%' });

    ScrollTrigger.create({
        trigger: scene, start: 'top top', end: 'bottom top',
        pin: pinTarget, pinSpacing: false, anticipatePin: 1, id: 'tablero-pin',
    });

    const tl = gsap.timeline({
        scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom top', scrub: true, id: 'tablero-tl' }
    });

    if (fill) tl.to(fill, { width: '100%', duration: 1, ease: 'none' }, 0);
    if (hint) tl.to(hint, { opacity: 0, duration: 0.06, ease: 'none' }, 0.01);

    // Fase 1 → 2
    tl.to(img1, { opacity: 0, duration: 0.12, ease: 'power2.inOut' }, 0.22)
      .to(img2, { opacity: 1, duration: 0.12, ease: 'power2.inOut' }, 0.24)
      .to(msg1, { opacity: 0, y: -12, duration: 0.10, ease: 'power2.in'  }, 0.22)
      .to(msg2, { opacity: 1, y:   0, duration: 0.10, ease: 'power2.out' }, 0.28)
    // Fase 2 → 3
      .to(img2, { opacity: 0, duration: 0.11, ease: 'power2.inOut' }, 0.54)
      .to(img3, { opacity: 1, duration: 0.11, ease: 'power2.inOut' }, 0.56)
      .to(msg2, { opacity: 0, y: -12, duration: 0.09, ease: 'power2.in'  }, 0.54)
      .to(msg3, { opacity: 1, y:   0, duration: 0.09, ease: 'power2.out' }, 0.60);

    console.log('[Tablero] OK');
}

// ============================================
// PUNTO DE ENTRADA — auto-llamado en este mismo archivo
// ============================================

function initScrollScenes() {
    if (!gsapReady()) return;
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ markers: false });
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize' });

    window.addEventListener('resize', () => {
        clearTimeout(window._stResizeTimer);
        window._stResizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    }, { passive: true });

    initScene_Hero();
    initScene_Tablero();

    console.log('[scroll-scenes] Motor OK');
}

// ============================================
// INICIALIZACIÓN — espera window.load
// window.load garantiza que GSAP (CDN externo)
// ya está disponible, tanto en local como en
// GitHub Pages con latencia de red.
// DOMContentLoaded NO es suficiente para CDNs.
// ============================================
function waitForGSAP(callback) {
    const maxAttempts = 50; // 5 segundos aprox
    let attempts = 0;

    function check() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            callback();
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(check, 100);
            } else {
                console.error('❌ GSAP no cargó después de varios intentos');
            }
        }
    }

    check();
}

// 🚀 Inicialización ROBUSTA
window.addEventListener('DOMContentLoaded', () => {
    waitForGSAP(() => {
        initScrollScenes();
    });
});