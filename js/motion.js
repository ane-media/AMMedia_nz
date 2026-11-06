/* ==========================================================================
   MOTION — kept quiet on purpose
   1. Soft shadow under the header once the page scrolls
   2. One gentle fade-up per section as it comes into view
   Styles live in css/style.css → section 20.
   Visitors with "reduce motion" switched on get a still page.
   ========================================================================== */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Header shadow ----------------------------------------------------- */
  var header = document.querySelector('.site-header');
  function headerShadow() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', headerShadow, { passive: true });
  headerShadow();

  /* Pause the hero reel for visitors who prefer less motion */
  if (reduced) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.removeAttribute('autoplay'); v.pause();
    });
  }

  if (reduced || !('IntersectionObserver' in window)) return;

  /* 2. Fade-ups ------------------------------------------------------------
     Whole blocks fade in together, never line by line.
     The top of each page (hero, intro) is left still so it shows instantly.
     Add or remove selectors below to change what fades in.               */
  var BLOCKS = [
    '.teaser-inner', '.manifesto',
    '.disc-intro', '.disc-row',
    '.section-alt > .stack-center',
    '#projects > .stack-center', '.project-list',
    '.about-photo', '.about-text',
    '#prices .stack-center', '.price-grid', '.price-details',
    '#book > .stack-center', '.steps', '.form', '.contact-line',
    '.insta',
    '.offering', '.gallery-grid', '.feature', '.cta',
    '.project-head', '.horizon', '.brand-list',
    '.film-head', '.film-frame', '.wedding-notes'
  ].join(', ');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

  // Remove the classes once settled, so nothing lingers on the element
  function settle(e) {
    if (e.propertyName !== 'opacity') return;
    e.currentTarget.classList.remove('reveal', 'is-visible');
    e.currentTarget.removeEventListener('transitionend', settle);
  }

  document.querySelectorAll(BLOCKS).forEach(function (el) {
    // Anything already on screen at load stays put — no pop-in
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add('reveal');
    el.addEventListener('transitionend', settle);
    observer.observe(el);
  });
})();
