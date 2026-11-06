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
          '<h3 class="serif">Got it, thank you!</h3>' +
          '<p>Your enquiry is in my inbox. I\'ll be in touch within a day or two.</p>' +
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
