// ============================================
// MAIN.JS — HLN Ingeniería
// Refactorizado: un solo DOMContentLoaded,
// sin duplicados, errores de formulario corregidos.
// ============================================

// ============================================
// VIEWPORT HEIGHT DINÁMICO
// ============================================

function setDynamicVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dvh', `${vh}px`);
}

setDynamicVH();
window.addEventListener('resize', setDynamicVH, { passive: true });

// ============================================
// ANIMACIONES AL SCROLL — INTERSECTION OBSERVER
// Sistema unificado: agrega clase .show al entrar
// en viewport. Las transiciones están definidas en CSS.
// ============================================

function initScrollAnimations() {
    // En desktop: excluir elementos del hero (GSAP los controla).
    // En móvil: incluirlos también porque GSAP no corre,
    // así el IntersectionObserver los hace visibles al entrar en viewport.
    const isDesktop = window.innerWidth >= 768;

    const selector = isDesktop
        ? '.fade-in:not(.section--hero *), .fade-in-up:not(.section--hero *), .fade-in-left:not(.section--hero *), .fade-in-right:not(.section--hero *)'
        : '.fade-in, .fade-in-up, .fade-in-left, .fade-in-right';

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach(el => {
        const delay = parseFloat(el.getAttribute('data-delay') || 0);
        if (delay > 0) el.style.transitionDelay = `${delay}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// ANIMACIÓN DE CONTADORES (números)
// ============================================

function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');

                const target   = parseInt(entry.target.getAttribute('data-target'), 10);
                const suffix   = entry.target.getAttribute('data-suffix') || '';
                const duration = 2000;
                const start    = Date.now();

                function animate() {
                    const progress = Math.min((Date.now() - start) / duration, 1);
                    entry.target.textContent = Math.floor(progress * target) + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        entry.target.textContent = target + suffix;
                    }
                }

                animate();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -80px 0px'
    });

    statNumbers.forEach(el => observer.observe(el));
}

// ============================================
// NAVEGACIÓN MÓVIL — HAMBURGER
// ============================================

function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLL PARA ANCHORS INTERNOS
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href   = this.getAttribute('href');
            const target = href !== '#' && document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// CARRUSEL INFINITO — CLIENTES
// ============================================

function initClientsCarousel() {
    const track = document.querySelector('.clients-track');
    if (!track) return;

    // Duplicar contenido una sola vez
    if (!track.dataset.inited) {
        track.innerHTML += track.innerHTML;
        track.dataset.inited = '1';
    }

    function recalculate() {
        const originalWidth = Math.floor(track.scrollWidth / 2) || 0;
        track.style.setProperty('--scroll-distance', originalWidth + 'px');
        const duration = Math.max(5, Math.round(originalWidth / 200));
        track.style.setProperty('--scroll-duration', duration + 's');
    }

    recalculate();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(recalculate, 200);
    }, { passive: true });
}

// ============================================
// CARRUSEL INFINITO — PROVEEDORES
// ============================================

function initProvidersCarousel() {
    const track = document.querySelector('.providers-track');
    if (!track) return;

    if (!track.dataset.inited) {
        track.innerHTML += track.innerHTML;
        track.dataset.inited = '1';
    }

    function recalculate() {
        const originalWidth = Math.floor(track.scrollWidth / 2) || 0;
        track.style.setProperty('--providers-distance', originalWidth + 'px');
        const duration = Math.max(10, Math.round(originalWidth / 150));
        track.style.setProperty('--providers-duration', duration + 's');
    }

    recalculate();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(recalculate, 200);
    }, { passive: true });
}

// ============================================
// CARRUSEL INFINITO — IMÁGENES (fix --move)
// ============================================

function initImageCarousel() {
    const track = document.querySelector('.carousel-track');
    const base  = document.getElementById('carouselBase');
    if (!track || !base) return;

    function recalculate() {
        track.style.setProperty('--move', `-${base.scrollWidth}px`);
    }

    recalculate();
    window.addEventListener('resize', recalculate, { passive: true });
}

// ============================================
// TABS — PROYECTOS
// ============================================

const projects = {
    planos: {
        title: 'Planos Técnicos Detallados',
        desc:  'Realizamos planos técnicos detallados para requerimientos de precisión y cumplimiento de normas. Entregamos documentación lista para fabricación y validación.',
        image: 'assets/images/plano.jpeg'
    },
    proceso: {
        title: 'Montaje y Cableado',
        desc:  'Montaje, cableado y verificación de cada tablero eléctrico con controles de calidad estrictos y pruebas funcionales.',
        image: 'assets/images/fabricacion.jpeg'
    },
    resultado: {
        title: 'Entrega y Puesta en Marcha',
        desc:  'Entrega final de tableros listos para operación, con pruebas realizadas y documentación técnica completa.',
        image: 'assets/images/carru9.jpg'
    }
};

function showProjectDetail(key, skipScroll) {
    const detail = document.getElementById('proyecto-detail');
    const imgWrap = document.getElementById('detail-image');
    const imgTag  = document.getElementById('detail-image-img');
    const title   = document.getElementById('detail-title');
    const desc    = document.getElementById('detail-desc');
    const inner   = document.querySelector('.detail-inner');

    if (!detail || !projects[key]) return;

    title.textContent = projects[key].title;
    desc.textContent  = projects[key].desc;

    imgWrap.style.backgroundImage    = `url('${projects[key].image}')`;
    imgWrap.style.backgroundSize     = 'cover';
    imgWrap.style.backgroundPosition = 'center';

    if (imgTag) {
        imgTag.src = projects[key].image;
        imgTag.alt = projects[key].title;
    }

    inner.classList.toggle('reverse', key === 'proceso');

    imgWrap.classList.remove('animate-left', 'animate-right');
    title.classList.remove('animate-wow');
    desc.classList.remove('animate-wow');
    void imgWrap.offsetWidth;

    imgWrap.classList.add(key === 'proceso' ? 'animate-right' : 'animate-left');
    title.classList.add('animate-wow');
    desc.classList.add('animate-wow');

    detail.style.display = 'block';
    // Solo hacer scroll si el usuario hizo clic (no en la carga inicial)
    if (!skipScroll) {
        detail.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function initProjectTabs() {
    document.querySelectorAll('.proyecto-tabs .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.proyecto-tabs .tab-button')
                    .forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            showProjectDetail(this.getAttribute('data-tab'), false); // scroll SÍ al clic
        });
    });

    // Carga inicial: mostrar tab activa SIN scroll
    const defaultBtn = document.querySelector('.proyecto-tabs .tab-button.active')
                    || document.querySelector('.proyecto-tabs .tab-button[data-tab="planos"]');
    if (defaultBtn) showProjectDetail(defaultBtn.getAttribute('data-tab'), true);
}

// ============================================
// TABS — EQUIPOS ELÉCTRICOS
// ============================================

const equipments = {
    domestico: {
        title: 'Autoportante',
        desc:  'Los tableros autoportantes son estructuras de libre apoyo diseñadas para soportar componentes de gran peso sin necesidad de anclaje a muros. Destacan por su diseño modular y robusto, ideal para centros de control y distribución de alta potencia en entornos industriales.',
        image: 'assets/images/autoportante.jpeg'
    },
    adosado: {
        title: 'Adosado',
        desc:  'Los productos de HLN cumplen con las normas vigentes. Están diseñados para facilitar inspecciones, pruebas y mantenimiento, e incluyen una placa base para el montaje del sistema de barras de interruptores.',
        image: 'assets/images/ados.jpeg'
    },
    autosoportado: {
        title: 'Autosoportado',
        desc:  'Ofrecemos tableros autosoportados diseñados para instalaciones industriales y comerciales de alta demanda. Montados sobre una base sólida que brinda estabilidad, están fabricados en planchas galvanizadas y cuentan con puertas con cerraduras, ventilación adecuada y perforaciones pre troqueladas para el ingreso y salida de cables.',
        image: 'assets/images/auto.jpeg'
    },
    empotrables: {
        title: 'Empotrables',
        desc:  'Ofrecemos tableros empotrables para llaves termomagnéticas, ideales para centralizar líneas de distribución y circuitos en instalaciones residenciales, industriales y pequeñas comerciales de baja carga. Fabricados en planchas galvanizadas, incluyen perforaciones pre troqueladas de cables y se fijan a la pared.',
        image: 'assets/images/empo.jpeg'
    },
    transformadores: {
        title: 'Transformadores',
        desc:  'Ofrecemos transformadores eléctricos para aplicaciones industriales y comerciales, diseñados para garantizar una distribución eficiente y segura de la energía. Fabricados bajo estándares de calidad, incluyen protección térmica, aislamiento reforzado y configuraciones personalizadas según la necesidad del proyecto.',
        image: 'assets/images/trafo.jpeg'
    }
};

function showEquipmentDetail(key, skipScroll) {
    const detail  = document.getElementById('equipo-detail');
    const imgWrap = document.getElementById('equipo-detail-image');
    const imgTag  = document.getElementById('equipo-detail-image-img');
    const title   = document.getElementById('equipo-detail-title');
    const desc    = document.getElementById('equipo-detail-desc');

    if (!detail || !equipments[key]) return;

    title.textContent = equipments[key].title;
    desc.textContent  = equipments[key].desc;

    imgWrap.style.backgroundImage    = `url('${equipments[key].image}')`;
    imgWrap.style.backgroundSize     = 'cover';
    imgWrap.style.backgroundPosition = 'center';

    if (imgTag) {
        imgTag.src = equipments[key].image;
        imgTag.alt = equipments[key].title;
    }

    imgWrap.classList.remove('animate-left', 'animate-right');
    title.classList.remove('animate-wow');
    desc.classList.remove('animate-wow');
    void imgWrap.offsetWidth;

    imgWrap.classList.add('animate-left');
    title.classList.add('animate-wow');
    desc.classList.add('animate-wow');

    detail.style.display = 'block';
    if (!skipScroll) {
        detail.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function initEquipmentTabs() {
    document.querySelectorAll('.equipo-tabs .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.equipo-tabs .tab-button')
                    .forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            showEquipmentDetail(this.getAttribute('data-tab'), false); // scroll SÍ al clic
        });
    });

    // Carga inicial: SIN scroll
    const defaultBtn = document.querySelector('.equipo-tabs .tab-button.active')
                    || document.querySelector('.equipo-tabs .tab-button[data-tab="domestico"]');
    if (defaultBtn) showEquipmentDetail(defaultBtn.getAttribute('data-tab'), true);
}

// ============================================
// SLIDER QUIÉNES SOMOS — ROTACIÓN DE IMAGEN
// ============================================

function initQuienesImageSlider() {
    const img = document.querySelector('.quienes-image img');
    if (!img) return;

    const images = [
        'assets/images/equipo.jpeg',
        'assets/images/equipo2.jpeg',
        'assets/images/equipo3.jpeg',
        'assets/images/equipo4.jpeg'
    ];

    let index = 0;
    let timer = null;

    function cycle() {
        img.classList.add('fade-out');
        setTimeout(() => {
            index = (index + 1) % images.length;
            img.src = images[index];
            img.classList.remove('fade-out');
        }, 400);
    }

    // Pausar cuando la tab no está visible para no desincronizar
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(timer);
        } else {
            timer = setInterval(cycle, 5000);
        }
    });

    timer = setInterval(cycle, 5000);
}

// ============================================
// BLOQUE DE VIDEOS — ROTACIÓN AUTOMÁTICA
// ============================================

function initVideoStrip() {
    const videos = document.querySelectorAll('.video-grid video');
    if (!videos.length) return;

    const sources = [
        'assets/images/videos/video1.mp4',
        'assets/images/videos/video3.mp4',
        'assets/images/videos/video2.mp4',
        'assets/images/videos/video4.mp4',
        'assets/images/videos/video5.mp4',
        'assets/images/videos/video6.mp4',
        'assets/images/videos/video7.mp4'
    ];

    let index = 0;

    function loadAndPlay(videoEl) {
        const src = sources[index % sources.length];
        index++;

        videoEl.classList.add('fade-out');
        setTimeout(() => {
            videoEl.pause();
            videoEl.src = src;
            videoEl.load();
            videoEl.onloadeddata = () => {
                videoEl.classList.remove('fade-out');
                videoEl.currentTime = 0;
                videoEl.play().catch(() => {});
            };
        }, 200);
    }

    videos.forEach(video => {
        loadAndPlay(video);
        video.addEventListener('ended', () => loadAndPlay(video));
    });
}

// ============================================
// CARRUSEL DE VIDEOS — MÓVIL
// ============================================

function initVideoCarousel() {
    const slides  = document.querySelectorAll('.video-slide');
    const prevBtn = document.getElementById('videoPrev');
    const nextBtn = document.getElementById('videoNext');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    showSlide(0);

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    });
}

// ============================================
// WHATSAPP FLOTANTE
// ============================================

function initWhatsAppFloat(number, message) {
    const float  = document.getElementById('whatsappFloat');
    if (!float) return;

    const anchor = float.querySelector('a');
    if (!anchor) return;

    anchor.href = `https://wa.me/${number}?text=${encodeURIComponent(message || 'Hola, vi su página web y estoy interesado en sus servicios. Me gustaría cotizar un proyecto/licitación y recibir asesoría. Gracias.')}`;

    // Animación de entrada
    float.style.opacity   = '0';
    float.style.transform = 'translateY(8px)';
    setTimeout(() => {
        float.style.transition = 'opacity 300ms ease, transform 300ms ease';
        float.style.opacity    = '1';
        float.style.transform  = 'translateY(0)';
    }, 250);
}

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

// Campos presentes en el HTML (sin 'asunto' — no existe en el form)
const FORM_FIELDS = ['nombre', 'email', 'mensaje', 'terminos'];

function validateField(fieldName, value) {
    switch (fieldName) {
        case 'nombre':
            if (!value || value.trim().length < 3)
                return 'El nombre debe tener al menos 3 caracteres';
            break;
        case 'email': {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value))
                return 'Email inválido';
            break;
        }
        case 'mensaje':
            if (!value || value.trim().length < 10)
                return 'El mensaje debe tener al menos 10 caracteres';
            break;
        case 'terminos':
            if (!document.getElementById('terminos').checked)
                return 'Debes aceptar los términos';
            break;
    }
    return null; // sin error
}

function showFieldError(fieldName, errorMessage) {
    const field        = document.getElementById(fieldName);
    const errorEl      = document.getElementById(`${fieldName}-error`);

    // Guard: si el campo no existe en el DOM, ignorar
    if (!field) return;

    const formGroup = field.parentElement;

    if (errorMessage) {
        formGroup.classList.add('error');
        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.classList.add('show');
        }
    } else {
        formGroup.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    }
}

function validateForm() {
    let isValid = true;

    FORM_FIELDS.forEach(fieldName => {
        const el    = document.getElementById(fieldName);
        if (!el) return; // campo no existe en DOM, saltar

        const value = fieldName === 'terminos' ? el.checked : el.value;
        const error = validateField(fieldName, value);

        showFieldError(fieldName, error);
        if (error) isValid = false;
    });

    return isValid;
}

function showFormMessage(element, message, type) {
    element.textContent  = message;
    element.className    = `form-message ${type}`;
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (type === 'success') {
        setTimeout(() => {
            element.className = 'form-message';
        }, 5000);
    }
}

function initContactForm() {
    const form      = document.getElementById('contactForm');
    const formMsg   = document.getElementById('form-message');
    const submitBtn = document.querySelector('.submit-button');

    if (!form) return;

    // Validación en tiempo real al salir de cada campo
    FORM_FIELDS.forEach(fieldName => {
        const el = document.getElementById(fieldName);
        if (!el) return;
        el.addEventListener('blur', () => {
            const value = fieldName === 'terminos' ? el.checked : el.value;
            showFieldError(fieldName, validateField(fieldName, value));
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showFormMessage(formMsg, 'Por favor, completa todos los campos correctamente.', 'error');
            return;
        }

        submitBtn.disabled    = true;
        submitBtn.textContent = 'Enviando...';

        const nombre  = document.getElementById('nombre').value.trim();
        const email   = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // ── Envío vía Formspree ──────────────────────
        // Formspree reenvía el formulario a administracion@hln.com.pe.
        // INSTRUCCIONES para activar:
        //   1. Ir a https://formspree.io y crear cuenta gratuita
        //   2. Crear nuevo form → poner email: administracion@hln.com.pe
        //   3. Reemplazar 'YOUR_FORM_ID' por el ID que Formspree asigna
        //      (ejemplo: 'xpzgkwqr')
        const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← reemplazar con el ID real

        if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
            // Formspree configurado: enviar via API
            try {
                const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ nombre, email, mensaje }),
                });
                const data = await res.json();
                if (res.ok) {
                    showFormMessage(formMsg, '¡Mensaje enviado! Nos pondremos en contacto a la brevedad.', 'success');
                    form.reset();
                    document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
                    document.querySelectorAll('.error-message').forEach(m => m.classList.remove('show'));
                } else {
                    throw new Error(data?.errors?.[0]?.message || 'Error de envío');
                }
            } catch (err) {
                showFormMessage(formMsg, 'Error al enviar. Por favor escríbenos a administracion@hln.com.pe', 'error');
            }
        } else {
            // Fallback mailto: abre el cliente de correo del usuario
            // con los datos pre-completados hacia administracion@hln.com.pe
            const subject = encodeURIComponent(`Consulta de ${nombre} — HLN Ingeniería`);
            const body    = encodeURIComponent(
                `Nombre: ${nombre}\nCorreo: ${email}\n\nMensaje:\n${mensaje}`
            );
            window.location.href = `mailto:administracion@hln.com.pe?subject=${subject}&body=${body}`;
            showFormMessage(formMsg, 'Se abrirá tu cliente de correo para enviar el mensaje.', 'success');
        }

        submitBtn.disabled    = false;
        submitBtn.textContent = 'Enviar';
    });
}

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada:', event.reason);
});

// ============================================
// CARRUSEL MÓVIL — TABLERO (3 fases)
// ============================================

function initTblMobileCarousel() {
    const track  = document.getElementById('tblMobileTrack');
    const prev   = document.getElementById('tblPrev');
    const next   = document.getElementById('tblNext');
    const dots   = document.querySelectorAll('.tbl-mobile-dot');

    if (!track || !prev || !next) return;

    const slides = track.querySelectorAll('.tbl-mobile-slide');
    let current = 0;

    function goTo(idx) {
        current = Math.max(0, Math.min(idx, slides.length - 1));
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('tbl-mobile-dot--active', i === current));
    }

    // CSS transition en el track
    track.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1)';

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    // Swipe táctil
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    goTo(0);
}

// ============================================
// WIDGET FLOTANTE — FOTO PLC
// ============================================

function initPanelFloat() {
    const btn   = document.getElementById('panelFloatBtn');
    const modal = document.getElementById('panelModal');
    const close = document.getElementById('panelModalClose');

    if (!btn || !modal || !close) return;

    let open = false;

    btn.addEventListener('click', function() {
        if (open) {
            // Cerrar
            open = false;
            modal.classList.remove('is-open');
            setTimeout(function() { modal.style.display = 'none'; }, 250);
        } else {
            // Abrir
            open = true;
            modal.style.display = 'block';
            // doble rAF para que el browser pinte display:block antes de transición
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    modal.classList.add('is-open');
                });
            });
        }
    });

    close.addEventListener('click', function() {
        if (!open) return;
        open = false;
        modal.classList.remove('is-open');
        setTimeout(function() { modal.style.display = 'none'; }, 250);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && open) {
            open = false;
            modal.classList.remove('is-open');
            setTimeout(function() { modal.style.display = 'none'; }, 250);
        }
    });
}

// ============================================
// INICIALIZACIÓN — UN SOLO DOMContentLoaded
// ─────────────────────────────────────────────
// NOTA: initScrollScenes() (GSAP) se llama desde
// window 'load' en el HTML, no aquí, porque necesita
// que los scripts de CDN (gsap + ScrollTrigger)
// estén completamente cargados antes de ejecutarse.
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCountUp();
    initMobileNav();
    initSmoothScroll();
    initImageCarousel();
    initClientsCarousel();
    initProvidersCarousel();
    initProjectTabs();
    initEquipmentTabs();
    initQuienesImageSlider();
    initVideoStrip();
    initVideoCarousel();
    initContactForm();
    initWhatsAppFloat(
  '51915236931',
  'Hola, soy [Nombre]. Tengo un proyecto o licitación y me gustaría cotizar con ustedes. ¿Podrían brindarme asesoría?'
);
    initTblMobileCarousel();

    // 🔥 ESTA LÍNEA FALTABA
    initPanelFloat();

    console.log('✅ HLN Ingeniería — JS iniciado correctamente');
});