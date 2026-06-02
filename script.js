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
    var secondaryCta = document.querySelector('.hero__secondary-cta');

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

    if (secondaryCta) {
      gsap.to(secondaryCta, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.15,
      });
    }
  }

  /* --- Sticky Nav --- */

  function initStickyNav() {
    var nav = document.getElementById('stickyNav');
    if (!nav) return;

    var lastScrollY = 0;
    var scrollThreshold = 100;

    function handleScroll() {
      var currentScrollY = window.scrollY;

      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down — hide
          nav.classList.add('nav--hidden');
        } else {
          // Scrolling up — show
          nav.classList.remove('nav--hidden');
        }
      } else {
        nav.classList.remove('nav--hidden');
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* --- Smooth Anchor Scrolling --- */

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        var navHeight = 80;
        var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        if (state.lenis) {
          state.lenis.scrollTo(targetPosition, { duration: 1.2 });
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  /* --- FAQ Accordion --- */

  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('is-open');
          var otherBtn = otherItem.querySelector('.faq__question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --- Scroll Animations --- */

  function initScrollAnimations() {
    if (state.reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // --- Niche section ---
    var nicheTrusted = document.querySelector('.niche__trusted');
    if (nicheTrusted) {
      gsap.to(nicheTrusted, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.niche',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    var nicheCards = document.querySelectorAll('.niche-card');
    if (nicheCards.length) {
      gsap.to(nicheCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.niche__cards',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- Metrics section ---
    var metricsItems = document.querySelectorAll('.metrics__item');
    if (metricsItems.length) {
      gsap.to(metricsItems, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.metrics',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- Portfolio section ---
    var portfolioHeaders = document.querySelectorAll(
      '.portfolio > .container > [data-stagger]'
    );
    if (portfolioHeaders.length) {
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
    }

    var featuredCards = document.querySelectorAll('.portfolio__featured .video-card');
    if (featuredCards.length) {
      gsap.to(featuredCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.portfolio__featured',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }

    var moreLabel = document.querySelector('.portfolio__more-label');
    if (moreLabel) {
      gsap.to(moreLabel, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.portfolio__more-label',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    var portfolioCards = document.querySelectorAll('.portfolio__grid .video-card');
    if (portfolioCards.length) {
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
    }

    // --- Outcomes section ---
    var outcomesHeaders = document.querySelectorAll(
      '.outcomes > .container > [data-stagger]'
    );
    if (outcomesHeaders.length) {
      gsap.to(outcomesHeaders, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.outcomes',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    var outcomeCards = document.querySelectorAll('.outcome-card');
    if (outcomeCards.length) {
      gsap.to(outcomeCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.outcomes__cards',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- Pricing section ---
    var pricingHeader = document.querySelectorAll(
      '.pricing > .container > [data-stagger]'
    );
    if (pricingHeader.length) {
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
    }

    var pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length) {
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
    }

    // Guarantee
    var guarantee = document.querySelector('.guarantee');
    if (guarantee) {
      gsap.to(guarantee, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.guarantee',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- Testimonials section ---
    var testimonialsHeaders = document.querySelectorAll(
      '.testimonials > .container > [data-stagger]'
    );
    if (testimonialsHeaders.length) {
      gsap.to(testimonialsHeaders, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    var testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length) {
      gsap.to(testimonialCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials__grid',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- Founder section ---
    var founderHeaders = document.querySelectorAll(
      '.founder > .container > [data-stagger]'
    );
    if (founderHeaders.length) {
      gsap.to(founderHeaders, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.founder',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    var founderContent = document.querySelectorAll('.founder__content [data-stagger]');
    if (founderContent.length) {
      gsap.to(founderContent, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.founder__content',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- FAQ section ---
    var faqHeaders = document.querySelectorAll(
      '.faq > .container > [data-stagger]'
    );
    if (faqHeaders.length) {
      gsap.to(faqHeaders, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    var faqItems = document.querySelectorAll('.faq__item');
    if (faqItems.length) {
      gsap.to(faqItems, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq__list',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- Audit / Lead Magnet section ---
    var auditText = document.querySelectorAll('.audit__text [data-stagger]');
    if (auditText.length) {
      gsap.to(auditText, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.audit',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    var auditCalendly = document.querySelector('.audit__calendly-wrapper');
    if (auditCalendly) {
      gsap.to(auditCalendly, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.audit__calendly-wrapper',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    // --- CTA section ---
    var ctaHeadline = document.querySelector('.cta-section__headline');
    if (ctaHeadline) {
      gsap.to(ctaHeadline, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    var ctaChecklist = document.querySelector('.cta-section__checklist');
    if (ctaChecklist) {
      gsap.to(ctaChecklist, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section__checklist',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    var ctaSub = document.querySelector('.cta-section__sub');
    if (ctaSub) {
      gsap.to(ctaSub, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section__sub',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    var ctaBtn = document.querySelector('.cta-section__btn');
    if (ctaBtn) {
      gsap.to(ctaBtn, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section__btn',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }
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
      initStickyNav();
      initSmoothAnchors();
      initFaqAccordion();
      initScrollAnimations();
      initParallax();
      initMicroInteractions();
      initAccordion();
      initVideoModal();
    });
  });
})();
