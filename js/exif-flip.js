/* ==========================================================================
   EXIF FLIP — click a photo to flip it and see the camera settings
   Styles: css/style.css → section 22.

   Where the details come from (first match wins):
   1. data- attributes on the .photo frame, typed by hand, e.g.
        <div class="photo ratio-4-5" data-camera="Sony α7 V" data-lens="Sony FE 70-200mm F2.8 GM II"
             data-focal="200mm" data-aperture="f/2.8" data-shutter="1/1600s" data-iso="ISO 400"
             data-date="16 May 2026">
   2. The camera data (EXIF) saved inside the JPG itself.
   Photos with neither stay as normal photos — no empty cards.

   EXIF is read with the free "exifr" library, loaded in each page's <head>.
   ========================================================================== */
(function () {
  // Which photo frames can flip. Links (home rows, Instagram) are left out on purpose.
  var TARGETS = '.gallery-grid > .photo, figure > .photo, .teaser .photo, .horizon-card .photo';

  // Friendly names for camera model codes
  var CAMERAS = {
    'ILCE-7M5': 'Sony α7 V', 'ILCE-7M4': 'Sony α7 IV', 'ILCE-7M3': 'Sony α7 III',
    'ILCE-7RM5': 'Sony α7R V', 'ILCE-7CM2': 'Sony α7C II', 'ILCE-1': 'Sony α1', 'ILCE-9M3': 'Sony α9 III'
  };

  function shutter(t) {
    if (!t) return null;
    return t >= 1 ? t + 's' : '1/' + Math.round(1 / t) + 's';
  }
  function niceDate(d) {
    if (!d) return null;
    var dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt)) return null;
    return dt.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function fromData(el) {
    var d = el.dataset;
    if (!(d.camera || d.lens || d.aperture)) return null;
    return { camera: d.camera, lens: d.lens, focal: d.focal, aperture: d.aperture,
             shutter: d.shutter, iso: d.iso, date: d.date };
  }

  function fromExif(x) {
    if (!x || !(x.Model || x.FNumber)) return null;
    var model = x.Model ? String(x.Model).trim() : '';
    var lens  = x.LensModel ? String(x.LensModel).trim() : null;
    if (lens && /^FE /.test(lens)) lens = 'Sony ' + lens;
    return {
      camera:   CAMERAS[model] || [x.Make, model].filter(Boolean).join(' ') || null,
      lens:     lens,
      focal:    x.FocalLength ? Math.round(x.FocalLength) + 'mm' : null,
      aperture: x.FNumber ? 'f/' + (+x.FNumber).toFixed(1).replace(/\.0$/, '') : null,
      shutter:  shutter(x.ExposureTime),
      iso:      x.ISO ? 'ISO ' + x.ISO : null,
      date:     niceDate(x.DateTimeOriginal)
    };
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Turn a plain .photo frame into a flip card
  function build(el, info) {
    if (el.classList.contains('flip')) return;

    var front = document.createElement('div');
    front.className = 'flip-front';
    while (el.firstChild) front.appendChild(el.firstChild);

    var hint = document.createElement('span');
    hint.className = 'flip-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = 'f/';
    front.appendChild(hint);

    var headline = [info.aperture, info.shutter, info.iso].filter(Boolean).join(' · ');
    // The headline already shows aperture, shutter and ISO, so the list skips them
    var rows = [
      ['camera', 'Camera', info.camera], ['lens', 'Lens', info.lens],
      ['focal', 'Focal length', info.focal], ['taken', 'Taken', info.date]
    ];
    if (!headline) rows.push(['aperture', 'Aperture', info.aperture], ['shutter', 'Shutter', info.shutter], ['iso', 'ISO', info.iso]);
    rows = rows.filter(function (r) { return r[2]; });

    var back = document.createElement('div');
    back.className = 'flip-back';
    back.innerHTML =
      '<span class="label flip-eyebrow">Behind the shot</span>' +
      (headline ? '<p class="flip-settings">' + [info.aperture, info.shutter, info.iso].filter(Boolean)
        .map(function (v) { return '<span>' + esc(v) + '</span>'; }).join(' · ') + '</p>' : '') +
      '<dl class="flip-list">' + rows.map(function (r) {
        return '<div data-k="' + r[0] + '"><dt class="label">' + r[1] + '</dt><dd>' + esc(r[2]) + '</dd></div>';
      }).join('') + '</dl>' +
      '<span class="label flip-close">Tap to flip back</span>';

    var inner = document.createElement('div');
    inner.className = 'flip-inner';
    inner.appendChild(front);
    inner.appendChild(back);
    el.appendChild(inner);

    el.classList.add('flip');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-pressed', 'false');
    el.setAttribute('aria-label', 'Show camera settings for this photo');

    function toggle() {
      var on = el.classList.toggle('is-flipped');
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    cards.push(back);
    fit(back);
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }

  /* Make the back of the card fit its frame -------------------------------
     Text already scales with the card (CSS container units). If it still
     overflows a small frame, drop the least important lines, step by step:
     fit-1 labels, fit-2 date, fit-3 focal length, fit-4 lens,
     fit-5 camera (settings line only), fit-6 smaller settings line.     */
  var cards = [];
  function fit(back) {
    back.classList.remove('fit-1', 'fit-2', 'fit-3', 'fit-4', 'fit-5', 'fit-6');
    for (var level = 1; level <= 6; level++) {
      if (back.scrollHeight <= back.clientHeight + 1) return;
      back.classList.add('fit-' + level);
    }
  }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { cards.forEach(fit); }, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { cards.forEach(fit); });

  function readExif(el) {
    var img = el.querySelector('img');
    if (!img || !window.exifr) return;
    window.exifr.parse(img.currentSrc || img.src)
      .then(function (x) { var info = fromExif(x); if (info) build(el, info); })
      .catch(function () { /* no camera data — stays a normal photo */ });
  }

  var frames = document.querySelectorAll(TARGETS);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      readExif(e.target);
    });
  }, { rootMargin: '400px 0px' }) : null;

  frames.forEach(function (el) {
    var manual = fromData(el);
    if (manual) { build(el, manual); return; }
    if (io) io.observe(el); else readExif(el);
  });
})();
