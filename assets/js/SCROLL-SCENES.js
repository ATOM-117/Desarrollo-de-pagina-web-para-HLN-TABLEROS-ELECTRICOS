// ============================================
// SCROLL-SCENES.JS — HLN Ingeniería
// Motor GSAP + ScrollTrigger.
// ============================================

function gsapReady() {
    if (typeof gsap === 'undefined') {
        console.error('[scroll-scenes] gsap no disponible.');
        return false;
    }
    if (typeof ScrollTrigger === 'undefined') {
        console.error('[scroll-scenes] ScrollTrigger no disponible.');
        return false;
    }
    return true;
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// ESCENA 1 — HERO
// ============================================

function initScene_Hero() {
    const scene     = document.querySelector('.section--hero .scene--hero');
    const pinTarget = document.querySelector('.section--hero .sticky-container');
    const overlay   = document.querySelector('.section--hero .hero-overlay');
    const heading   = document.querySelector('.section--hero .hero-content h2');
    const paragraph = document.querySelector('.section--hero .hero-content p');
    const buttons   = document.querySelector('.section--hero .hero-buttons');

    if (!scene || !pinTarget || !heading || !paragraph || !buttons) {
        console.warn('[Hero] Elementos no encontrados.');
        return;
    }

    // En móvil (768px) el CSS pone height:auto en sticky-container y scene.
    // No aplicamos GSAP pin ni animaciones de opacidad — los elementos
    // deben ser visibles directamente.
    if (window.innerWidth < 768) {
        // Asegurar que los elementos sean visibles en móvil
        [heading, paragraph, buttons].forEach(el => {
            el.classList.remove('fade-in-up', 'fade-in', 'fade-in-left', 'fade-in-right');
        });
        return;
    }

    scene.style.height = '150vh';

    [heading, paragraph, buttons].forEach(el => {
        el.classList.remove('fade-in-up', 'fade-in', 'fade-in-left', 'fade-in-right');
        gsap.set(el, { opacity: 0, y: 50 });
    });

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
      .to([heading, paragraph, buttons], { opacity: 0, y: -60, duration: 0.35, ease: 'power2.in', stagger: 0.04 }, 0.65)
      .to(overlay,   { backgroundColor: 'rgba(0,26,51,0.75)', duration: 0.35, ease: 'none' }, 0.65);

    console.log('[Hero] OK');
}

// ============================================
// ESCENA 2 — TABLERO (3 fases)
// ============================================

function initScene_Tablero() {
    const scene     = document.querySelector('.section--tablero .scene--tablero');
    const pinTarget = document.querySelector('.section--tablero .sticky-container');

    if (!scene || !pinTarget) {
        console.warn('[Tablero] Estructura no encontrada.');
        return;
    }

    const img1 = scene.querySelector('.tbl-img--1');
    const img2 = scene.querySelector('.tbl-img--2');
    const img3 = scene.querySelector('.tbl-img--3');
    const msg1 = scene.querySelector('.tbl-msg--1');
    const msg2 = scene.querySelector('.tbl-msg--2');
    const msg3 = scene.querySelector('.tbl-msg--3');
    const fill = scene.querySelector('.tbl-progress__fill');
    const hint = scene.querySelector('.tbl-hint');

    if (!img1 || !img2 || !img3 || !msg1 || !msg2 || !msg3) {
        console.warn('[Tablero] Elementos internos no encontrados.');
        return;
    }

    // En móvil: sin GSAP. El CSS media query maneja todo el layout.
    // Las imágenes se muestran apiladas en columna, los mensajes fluyen.
    // No aplicamos ningún gsap.set() para no pisar el CSS.
    if (window.innerWidth < 768) {
        return;
    }

    // DESKTOP: animación con pin + scrub
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

    tl.to(img1, { opacity: 0, duration: 0.12, ease: 'power2.inOut' }, 0.22)
      .to(img2, { opacity: 1, duration: 0.12, ease: 'power2.inOut' }, 0.24)
      .to(msg1, { opacity: 0, y: -12, duration: 0.10, ease: 'power2.in'  }, 0.22)
      .to(msg2, { opacity: 1, y:   0, duration: 0.10, ease: 'power2.out' }, 0.28)
      .to(img2, { opacity: 0, duration: 0.11, ease: 'power2.inOut' }, 0.54)
      .to(img3, { opacity: 1, duration: 0.11, ease: 'power2.inOut' }, 0.56)
      .to(msg2, { opacity: 0, y: -12, duration: 0.09, ease: 'power2.in'  }, 0.54)
      .to(msg3, { opacity: 1, y:   0, duration: 0.09, ease: 'power2.out' }, 0.60);

    console.log('[Tablero] OK');
}

// ============================================
// PUNTO DE ENTRADA
// ============================================

function initScrollScenes() {
    if (!gsapReady()) return;

    if (prefersReducedMotion()) {
        document.querySelectorAll(
            '.section--hero .hero-content h2,.section--hero .hero-content p,.section--hero .hero-buttons'
        ).forEach(el => el.classList.remove('fade-in-up', 'fade-in'));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ markers: false });
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize' });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    }, { passive: true });

    initScene_Hero();
    initScene_Tablero();

    console.log('[scroll-scenes] Motor OK');
}