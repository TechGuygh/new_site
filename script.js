/* Utilities */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Sticky header shadow on scroll */
(function headerElevate() {
  const header = $('[data-elevate]');
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 6);
        ticking = false;
      });
      ticking = true;
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
})();

/* Mobile nav toggle */
(function nav() {
  const btn = $('#navToggle');
  const menu = $('#navMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  // close on link click (mobile)
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* Theme toggle (with localStorage) */
(function theme() {
  const toggle = $('#themeToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* Intersection-based reveal animations */
(function reveal() {
  const items = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

/* Gallery filtering */
(function galleryFilter() {
  const chips = $$('.chip');
  const cards = $$('.project');
  if (!chips.length) return;
  function apply(filter) {
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  }
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      apply(chip.dataset.filter);
    });
  });
})();

/* Contact form validation (client-only demo) */
(function contactForm() {
  const form = $('#contactForm');
  if (!form) return;
  const name = $('#name');
  const email = $('#email');
  const message = $('#message');
  const nameErr = $('#nameErr');
  const emailErr = $('#emailErr');
  const messageErr = $('#messageErr');
  const success = $('#formSuccess');

  function setErr(el, msg) {
    const map = { name: nameErr, email: emailErr, message: messageErr };
    map[el.id].textContent = msg || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;

    if (name.value.trim().length < 2) { setErr(name, 'Please enter your name.'); ok = false; } else setErr(name);
    const em = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setErr(email, 'Enter a valid email.'); ok = false; } else setErr(email);
    if (message.value.trim().length < 10) { setErr(message, 'Tell us a bit more (10+ chars).'); ok = false; } else setErr(message);

    if (ok) {
      success.hidden = false;
      form.reset();
      setTimeout(() => (success.hidden = true), 4000);
    }
  });
})();

/* Newsletter mini-validate */
// (function newsletter() {
//   const f = $('#newsForm');
//   const input = $('#newsEmail');
//   const err = $('#newsErr');
//   const ok = $('#newsOk');
//   if (!f) return;

//   f.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const v = input.value.trim();
//     if (!/^[^\s@]+@[^\s@]+\.
// [^\s@]+$/.test(v)) {
//       err.textContent = 'Enter a valid email.';
//       ok.hidden = true;
//     } else {
//       err.textContent = '';
//       ok.hidden = false;
//       f.reset();
//       setTimeout(() => (ok.hidden = true), 3000);
//     }
//   });
// }

/* Footer year */
$('#year').textContent = new Date().getFullYear();
