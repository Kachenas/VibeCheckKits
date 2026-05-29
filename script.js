/* ============================================
   Vibe Check Kits — Script
   ============================================ */

(function () {
  'use strict';

  /* --- Utilities --- */

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function splitTextIntoSpans(el) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    var words = text.split(/\s+/);
    el.innerHTML = words
      .map(function (word) {
        return (
          '<span class="word"><span class="word-inner">' +
          word +
          '</span></span>'
        );
      })
      .join(' ');
  }

  /* --- State --- */

  var state = {
    isTouch: false,
    reducedMotion: false,
    mouse: { x: 0, y: 0 },
    cursorPos: { x: 0, y: 0 },
    lenis: null,
  };

  /* --- Detection --- */

  function initDetection() {
    state.isTouch = isTouchDevice();
    state.reducedMotion = prefersReducedMotion();
  }

  /* --- Loader --- */

  function initLoader() {
    return new Promise(function (resolve) {
      if (state.reducedMotion) {
        var loader = document.getElementById('loader');
        var main = document.getElementById('mainContent');
        if (loader) loader.style.display = 'none';
        if (main) {
          main.classList.add('is-visible');
        }
        resolve();
        return;
      }

      var letters = document.querySelectorAll('.loader__letter');
      var tagline = document.getElementById('loaderTagline');
      var loader = document.getElementById('loader');
      var main = document.getElementById('mainContent');

      var tl = gsap.timeline({
        onComplete: function () {
          resolve();
        },
      });

      tl.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
      })
        .to(
          tagline,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .to({}, { duration: 0.8 })
        .to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: function () {
            loader.style.display = 'none';
            main.classList.add('is-visible');
            gsap.fromTo(
              main,
              { opacity: 0 },
              { opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
          },
        });
    });
  }

  /* --- Lenis Smooth Scroll --- */

  function initLenis() {
    if (state.reducedMotion) return;

    state.lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      touchMultiplier: 2,
      infinite: false,
    });

    state.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      state.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* --- Custom Cursor --- */

  function initCursor() {
    if (state.isTouch || state.reducedMotion) return;

    var dot = document.getElementById('cursorDot');
    var circle = document.getElementById('cursorCircle');

    if (!dot || !circle) return;

    document.addEventListener('mousemove', function (e) {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    });

    function animateCursor() {
      // Dot follows instantly
      gsap.set(dot, {
        x: state.mouse.x,
        y: state.mouse.y,
      });

      // Circle trails with lerp
      state.cursorPos.x = lerp(state.cursorPos.x, state.mouse.x, 0.15);
      state.cursorPos.y = lerp(state.cursorPos.y, state.mouse.y, 0.15);

      gsap.set(circle, {
        x: state.cursorPos.x,
        y: state.cursorPos.y,
      });

      requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);

    // Expand cursor on interactive elements
    var expandTargets = document.querySelectorAll(
      '[data-cursor-expand], a, button'
    );

    expandTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('expanded');
        circle.classList.add('expanded');
      });

      el.addEventListener('mouseleave', function () {
        dot.classList.remove('expanded');
        circle.classList.remove('expanded');
      });
    });

    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', function () {
      gsap.to([dot, circle], { opacity: 0, duration: 0.2 });
    });

    document.addEventListener('mouseenter', function () {
      gsap.to([dot, circle], { opacity: 1, duration: 0.2 });
    });
  }

  /* --- Kinetic Typography --- */

  function initKineticTypography() {
    var headline = document.getElementById('heroHeadline');
    if (!headline) return;

    splitTextIntoSpans(headline);

    if (state.reducedMotion) {
      headline.querySelectorAll('.word-inner').forEach(function (el) {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      return;
    }

    var wordInners = headline.querySelectorAll('.word-inner');

    gsap.to(wordInners, {
      y: '0%',
      rotateX: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.2,
    });

    // Animate subheadline and CTA
    var subheadline = document.querySelector('.hero__subheadline');
    var heroCta = document.querySelector('.hero__cta');

    gsap.to(subheadline, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.8,
    });

    gsap.to(heroCta, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 1.0,
    });
  }

  /* --- Scroll Animations --- */

  function initScrollAnimations() {
    if (state.reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Problem section
    var problemText = document.querySelectorAll(
      '.problem__text [data-stagger]'
    );
    gsap.to(problemText, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.problem',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    var problemCards = document.querySelectorAll('.problem-card');
    gsap.to(problemCards, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.problem__cards',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // Solution section
    var solutionHeaders = document.querySelectorAll(
      '.solution > .container > [data-stagger]'
    );
    gsap.to(solutionHeaders, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.solution',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    var solutionCards = document.querySelectorAll('.solution-card');
    gsap.to(solutionCards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.solution__cards',
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    // Services section
    var servicesHeader = document.querySelectorAll(
      '.services > .container > [data-stagger]'
    );
    gsap.to(servicesHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    var serviceCards = document.querySelectorAll('.service-card');
    gsap.to(serviceCards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services__cards',
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    // Pricing section
    var pricingHeader = document.querySelectorAll(
      '.pricing > .container > [data-stagger]'
    );
    gsap.to(pricingHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.pricing',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    var pricingCards = document.querySelectorAll('.pricing-card');
    gsap.to(pricingCards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.pricing__cards',
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    // Results section
    var resultsWords = document.querySelectorAll('.results__word');
    gsap.to(resultsWords, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.results',
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    var resultsSub = document.querySelector('.results__sub');
    gsap.to(resultsSub, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.results__sub',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Portfolio section
    var portfolioHeaders = document.querySelectorAll(
      '.portfolio > .container > [data-stagger]'
    );
    gsap.to(portfolioHeaders, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.portfolio',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    var portfolioCards = document.querySelectorAll('.portfolio__grid .video-card');
    gsap.to(portfolioCards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.portfolio__grid',
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    // Demos section
    var demosHeaders = document.querySelectorAll(
      '.demos > .container > [data-stagger]'
    );
    gsap.to(demosHeaders, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.demos',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    var demoCards = document.querySelectorAll('.demos__grid .video-card');
    gsap.to(demoCards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.demos__grid',
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    // CTA section
    var ctaElements = document.querySelectorAll(
      '.cta-section [data-stagger], .cta-section .btn'
    );
    gsap.to(ctaElements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }

  /* --- Mouse Parallax (Hero Shapes) --- */

  function initParallax() {
    if (state.isTouch || state.reducedMotion) return;

    var shapes = document.querySelectorAll('[data-parallax-speed]');
    if (!shapes.length) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var mouseX = e.clientX - rect.left - centerX;
      var mouseY = e.clientY - rect.top - centerY;

      shapes.forEach(function (shape) {
        var speed = parseFloat(shape.dataset.parallaxSpeed) || 0.02;
        gsap.to(shape, {
          x: mouseX * speed * 100,
          y: mouseY * speed * 100,
          duration: 1,
          ease: 'power2.out',
        });
      });
    });
  }

  /* --- Micro Interactions (3D Card Tilt) --- */

  function initMicroInteractions() {
    if (state.isTouch || state.reducedMotion) return;

    var tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }

  /* --- Description Accordion --- */

  function initAccordion() {
    var expandToggles = document.querySelectorAll('.video-card__see-more');

    expandToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var expandWrapper = toggle.closest('.video-card__expand');
        expandWrapper.classList.toggle('is-open');
      });
    });
  }

  /* --- Video Modal --- */

  function initVideoModal() {
    var modal = document.getElementById('videoModal');
    var backdrop = document.getElementById('videoModalBackdrop');
    var closeBtn = document.getElementById('videoModalClose');
    var player = document.getElementById('videoPlayer');
    var source = document.getElementById('videoSource');
    var cards = document.querySelectorAll('.video-card');

    if (!modal || !player || !source) return;

    function openModal(videoSrc) {
      source.src = videoSrc;
      player.load();
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      if (state.lenis) state.lenis.stop();
      player.play().catch(function () {});
      closeBtn.focus();
    }

    function closeModal() {
      player.pause();
      player.currentTime = 0;
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      if (state.lenis) state.lenis.start();
      source.src = '';
    }

    cards.forEach(function (card) {
      function handleClick(e) {
        if (e.target.closest('.video-card__expand')) return;
        var videoSrc = card.getAttribute('data-video');
        if (videoSrc) openModal(videoSrc);
      }

      card.addEventListener('click', handleClick);
      card.addEventListener('keydown', function (e) {
        if (e.target.closest('.video-card__expand')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var videoSrc = card.getAttribute('data-video');
          if (videoSrc) openModal(videoSrc);
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  /* --- Init --- */

  document.addEventListener('DOMContentLoaded', function () {
    initDetection();

    initLoader().then(function () {
      initLenis();
      initCursor();
      initKineticTypography();
      initScrollAnimations();
      initParallax();
      initMicroInteractions();
      initAccordion();
      initVideoModal();
    });
  });
})();
