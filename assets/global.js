/* Jaded Rose theme — global behaviour (vanilla, no dependencies) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = $('#Toast');
    if (!el) return;
    $('#ToastMsg').textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2800);
  }

  /* ---------- announcement rotation ---------- */
  var annSpans = $$('.announce span');
  if (annSpans.length > 1) {
    var annI = 0;
    setInterval(function () {
      annSpans[annI].classList.remove('is-on');
      annI = (annI + 1) % annSpans.length;
      annSpans[annI].classList.add('is-on');
    }, 4200);
  }

  /* ---------- sticky header shadow ---------- */
  var head = $('.site-head');
  if (head) {
    window.addEventListener('scroll', function () {
      head.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  var mobNav = $('#MobNav');
  var scrim = $('#Scrim');
  function closeNav() {
    if (mobNav) mobNav.classList.remove('is-open');
    if (scrim) scrim.classList.remove('is-on');
    document.body.classList.remove('is-locked');
    var b = $('#BurgerBtn');
    if (b) b.setAttribute('aria-expanded', 'false');
  }
  var burger = $('#BurgerBtn');
  if (burger && mobNav) {
    burger.addEventListener('click', function () {
      mobNav.classList.add('is-open');
      if (scrim) scrim.classList.add('is-on');
      document.body.classList.add('is-locked');
      burger.setAttribute('aria-expanded', 'true');
    });
  }
  if (scrim) scrim.addEventListener('click', closeNav);
  var mobClose = $('#MobClose');
  if (mobClose) mobClose.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  $$('.mob-group > button').forEach(function (b) {
    b.addEventListener('click', function () { b.parentElement.classList.toggle('is-open'); });
  });

  /* ---------- cart helpers ---------- */
  function updateBagCount(count) {
    $$('[data-bag-count]').forEach(function (el) {
      el.textContent = count;
      el.setAttribute('data-count', count);
    });
  }

  /* AJAX add-to-cart: any form[data-ajax-cart] posting to /cart/add */
  $$('form[data-ajax-cart]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.setAttribute('aria-disabled', 'true');
      fetch(form.getAttribute('action') + '.js', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) { toast(res.j.description || res.j.message || 'Could not add to bag'); return; }
          return fetch('/cart.js')
            .then(function (r) { return r.json(); })
            .then(function (cart) {
              updateBagCount(cart.item_count);
              toast('Added to bag');
            });
        })
        .catch(function () { form.submit(); })
        .finally(function () { if (btn) btn.removeAttribute('aria-disabled'); });
    });
  });

  /* quantity steppers */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-qty-step]');
    if (!b) return;
    var input = b.parentElement.querySelector('input');
    var v = parseInt(input.value, 10) || 0;
    var min = parseInt(input.min, 10) || 0;
    v += parseInt(b.getAttribute('data-qty-step'), 10);
    if (v < min) v = min;
    input.value = v;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* cart page line updates */
  $$('[data-cart-line-qty]').forEach(function (input) {
    input.addEventListener('change', function () {
      var line = input.getAttribute('data-cart-line-qty');
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: parseInt(line, 10), quantity: parseInt(input.value, 10) })
      })
        .then(function (r) { return r.json(); })
        .then(function () { window.location.reload(); })
        .catch(function () { window.location.reload(); });
    });
  });

  /* ---------- product page: variant picker ---------- */
  $$('[data-product-form]').forEach(function (wrap) {
    var dataEl = $('[data-product-json]', wrap);
    if (!dataEl) return;
    var product = JSON.parse(dataEl.textContent);
    var idInput = $('input[name="id"]', wrap);
    var priceEl = $('[data-price]', wrap);
    var wasEl = $('[data-compare-price]', wrap);
    var btn = $('[data-add-button]', wrap);
    var noteEl = $('[data-availability]', wrap);

    function money(cents) {
      var m = (cents / 100).toFixed(2);
      var fmt = wrap.getAttribute('data-money-format') || '£{{amount}}';
      return fmt.replace(/\{\{\s*amount\s*\}\}/, m);
    }

    function selectedOptions() {
      return $$('[data-option-index]', wrap)
        .sort(function (a, b) { return a.getAttribute('data-option-index') - b.getAttribute('data-option-index'); })
        .map(function (g) {
          var on = $('.is-on', g);
          return on ? on.getAttribute('data-value') : null;
        });
    }

    function findVariant(opts) {
      return product.variants.find(function (v) {
        return v.options.every(function (o, i) { return o === opts[i]; });
      });
    }

    function refresh() {
      var v = findVariant(selectedOptions());
      $$('[data-option-index]', wrap).forEach(function (g) {
        var label = $('[data-selected-value="' + g.getAttribute('data-option-index') + '"]', wrap);
        var on = $('.is-on', g);
        if (label && on) label.textContent = on.getAttribute('data-value');
      });
      if (!v) {
        if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Unavailable'; }
        return;
      }
      if (idInput) idInput.value = v.id;
      if (priceEl) priceEl.textContent = money(v.price);
      if (wasEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          wasEl.textContent = money(v.compare_at_price);
          wasEl.hidden = false;
          priceEl.classList.add('price--sale');
        } else {
          wasEl.hidden = true;
          priceEl.classList.remove('price--sale');
        }
      }
      if (btn) {
        if (v.available) {
          btn.removeAttribute('aria-disabled');
          btn.textContent = btn.getAttribute('data-label-add') || 'Add to bag';
          if (noteEl) noteEl.hidden = true;
        } else {
          btn.setAttribute('aria-disabled', 'true');
          btn.textContent = btn.getAttribute('data-label-soldout') || 'Sold out';
          if (noteEl) noteEl.hidden = false;
        }
      }
      if (window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url.toString());
      }
    }

    wrap.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-value]');
      if (!opt || !wrap.contains(opt)) return;
      var group = opt.closest('[data-option-index]');
      if (!group) return;
      e.preventDefault();
      $$('[data-value]', group).forEach(function (o) {
        o.classList.toggle('is-on', o === opt);
        o.setAttribute('aria-pressed', o === opt ? 'true' : 'false');
      });
      refresh();
    });

    refresh();
  });

  /* ---------- newsletter feedback ---------- */
  var newsOk = $('#NewsOk');
  if (newsOk && window.location.search.indexOf('customer_posted=true') !== -1) {
    newsOk.hidden = false;
  }
})();
