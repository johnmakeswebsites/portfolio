(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- sticky header border ---- */
  var head = document.querySelector('.site-head');
  var onScroll = function () {
    head.classList.toggle('stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  var setNav = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    list.classList.toggle('open', open);
  };
  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  list.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  /* ---- scroll reveal ---- */
  var items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el, i) {
      // stagger siblings within a grid so cards cascade in
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  }

  /* ---- work filter ---- */
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('#work-grid .card');
  var empty = document.getElementById('empty');

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;
      Array.prototype.forEach.call(chips, function (c) {
        c.classList.toggle('is-on', c === chip);
      });

      var shown = 0;
      Array.prototype.forEach.call(cards, function (card) {
        var match = filter === 'all' || card.dataset.tags.split(' ').indexOf(filter) > -1;
        card.classList.toggle('hide', !match);
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  /* ---- count-up stats ---- */
  var nums = document.querySelectorAll('.stats dd[data-count]');
  var countUp = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.textContent.replace(/[0-9]/g, '');
    var start = performance.now();
    var step = function (now) {
      var p = Math.min((now - start) / 1100, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduced && 'IntersectionObserver' in window) {
    var numIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        numIo.unobserve(entry.target);
      });
    }, { threshold: 1 });
    Array.prototype.forEach.call(nums, function (n) { numIo.observe(n); });
  }

  /* ---- contact form ---- */
  var form = document.getElementById('contact-form');
  var sent = document.getElementById('sent');
  var errFor = function (name) {
    return form.querySelector('.err[data-for="' + name + '"]');
  };
  var validate = function (field) {
    var value = field.value.trim();
    var msg = '';
    if (!value) {
      msg = 'This one’s required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      msg = 'That email doesn’t look right.';
    }
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    errFor(field.name).textContent = msg;
    return !msg;
  };

  var fields = form.querySelectorAll('input, textarea');
  Array.prototype.forEach.call(fields, function (field) {
    field.addEventListener('blur', function () { validate(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var first = null;
    Array.prototype.forEach.call(fields, function (field) {
      if (!validate(field)) {
        ok = false;
        if (!first) first = field;
      }
    });
    if (!ok) { first.focus(); return; }

    // No backend yet — wire this up to Formspree/Netlify Forms/your own endpoint.
    sent.hidden = false;
    form.reset();
  });
})();
