/* ==========================================================================
   ENQUIRY FORM — sends through Formspree without leaving the page
   Form: index.html → #enquiry · Inbox setting: formspree.io dashboard
   If JavaScript is off, the form still posts to Formspree the normal way.
   ========================================================================== */
(function () {
  var form = document.getElementById('enquiry');
  if (!form || !window.fetch) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.innerHTML =
          '<div class="form-thanks">' +
          '<span class="label muted">Message received</span>' +
          '<h3 class="serif">Got it. <em>Sharp and in focus.</em></h3>' +
          '<p>Thanks for reaching out! Your enquiry has landed safely in my inbox. ' +
          'I\'ll get back to you within 48 hours. Unless I\'m lying on a court floor ' +
          'chasing the perfect angle. Then maybe 49.</p>' +
          '<p class="small">Can\'t wait? Have a scroll of my latest work on ' +
          '<a href="https://instagram.com/ammedia_nz">@ammedia_nz</a>.</p>' +
          '</div>';
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        var note = form.querySelector('.form-error');
        if (!note) {
          note = document.createElement('p');
          note.className = 'form-error';
          note.setAttribute('role', 'alert');
          form.querySelector('.form-submit').appendChild(note);
        }
        note.textContent = 'Hmm, that didn\'t send. Try again, or email ane@ammedianz.com directly.';
      });
  });
})();
