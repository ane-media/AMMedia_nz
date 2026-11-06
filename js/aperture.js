/* ==========================================================================
   APERTURE RING
   The f-stop ring down the right edge. It turns as the visitor scrolls:
   top of the page = f/1.4, bottom = f/22. On load it spins in from f/22.

   To change the stops, edit STOPS below.
   ========================================================================== */
(function () {
  var ring = document.querySelector('.aperture');
  if (!ring) return;

  var STOPS   = ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16', '22'];
  var SPACING = 26;    // px between marks (one-third stops) along the ring
  var RADIUS  = 210;   // px — how curved the ring looks
  var EASE    = 0.08;  // 0–1, lower = smoother, heavier ring

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var face    = ring.querySelector('.aperture-face');
  var readout = ring.querySelector('.aperture-value');
  var marks   = [];

  // Build marks: a number on every full stop, two ticks between each
  for (var k = 0; k <= (STOPS.length - 1) * 3; k++) {
    var el = document.createElement('span');
    if (k % 3 === 0) {
      el.className = 'aperture-num';
      el.textContent = STOPS[k / 3];
    } else {
      el.className = 'aperture-tick';
    }
    face.appendChild(el);
    marks.push(el);
  }

  var maxTravel = (marks.length - 1) * SPACING;
  var target  = 0;
  var current = reduced ? 0 : maxTravel;   // start at f/22 and spin in

  function readScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    target = progress * maxTravel;
  }

  function render() {
    current += (target - current) * (reduced ? 1 : EASE);

    for (var i = 0; i < marks.length; i++) {
      var arc   = i * SPACING - current;       // distance along the ring
      var theta = arc / RADIUS;                // angle on the cylinder
      var m = marks[i];
      if (Math.abs(theta) > 1.45) { m.style.opacity = 0; continue; }
      var y = RADIUS * Math.sin(theta);
      var depth = Math.cos(theta);
      m.style.transform = 'translateY(' + y.toFixed(2) + 'px) rotateX(' + (-theta).toFixed(3) + 'rad)';
      m.style.opacity = Math.pow(depth, 2).toFixed(3);
      m.classList.toggle('is-set', Math.abs(arc) < SPACING / 2 && m.className.indexOf('aperture-num') > -1);
    }

    var stopIndex = Math.round(current / (SPACING * 3));
    var value = STOPS[Math.min(Math.max(stopIndex, 0), STOPS.length - 1)];
    if (readout.textContent !== value) readout.textContent = value;

    requestAnimationFrame(render);
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', readScroll);
  readScroll();
  requestAnimationFrame(render);
})();
