/* StatPomoc — skrypty strony statycznej.
   Bez zależności zewnętrznych. Wszystko degraduje się łagodnie bez JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------- Menu mobilne */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------- Cień nagłówka po scrollu */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------- Odsłanianie sekcji */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------- Liczniki (stat) */
  var counters = document.querySelectorAll('[data-count-to]');
  var formatNumber = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    if (reduceMotion) { el.firstChild.textContent = formatNumber(target); return; }
    var duration = 1500;
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.textContent = formatNumber(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ------------------------------------------ Wyszukiwarka w słowniku */
  var search = document.getElementById('glossary-search');
  if (search) {
    var terms = Array.prototype.slice.call(document.querySelectorAll('.term'));
    var counter = document.getElementById('glossary-count');
    var empty = document.getElementById('glossary-empty');

    var normalize = function (s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0142/g, 'l');
    };

    var filter = function () {
      var q = normalize(search.value.trim());
      var visible = 0;
      terms.forEach(function (t) {
        var match = !q || normalize(t.textContent).indexOf(q) !== -1;
        t.hidden = !match;
        if (match) visible++;
      });
      if (counter) {
        counter.textContent = visible === terms.length
          ? terms.length + ' pojęć w słowniku'
          : visible + ' z ' + terms.length + ' pojęć';
      }
      if (empty) empty.hidden = visible !== 0;
    };

    search.addEventListener('input', filter);
    filter();
  }

  /* ------------------------------------------ Formularz kontaktowy (Formspree)
     Wysyłka w tle (fetch) do endpointu Formspree — użytkownik nie opuszcza strony.
     Gdy w kontakt.html nie wklejono jeszcze ID formularza, skrypt wraca do trybu
     „mailto”. Bez JS formularz wysyła się klasycznym POST-em (Formspree pokaże
     wtedy własną stronę z podziękowaniem). */
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-status');
    var submitBtn = form.querySelector('[type="submit"]');
    var MAIL = 'stat.pomoc@gmail.com';
    var configured = form.action.indexOf('WKLEJ-ID-FORMSPREE') === -1;

    var say = function (text, kind) {
      if (!note) return;
      note.hidden = false;
      note.textContent = text;
      note.className = 'form__status' + (kind ? ' form__status--' + kind : '');
    };

    var busy = function (on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.textContent = on ? 'Wysyłanie…' : submitBtn.getAttribute('data-label');
    };

    /* Tryb zapasowy: składa wiadomość i otwiera program pocztowy. */
    var sendViaMailto = function () {
      var get = function (name) {
        var el = form.elements[name];
        return el ? String(el.value).trim() : '';
      };

      var lines = [
        'Imię i nazwisko: ' + get('imie'),
        'E-mail: ' + get('email'),
        'Telefon: ' + (get('telefon') || '—'),
        'Rodzaj wsparcia: ' + get('temat'),
        'Termin: ' + (get('termin') || '—'),
        '',
        'Wiadomość:',
        get('wiadomosc')
      ];

      var subject = 'Zapytanie ze strony statpomoc.org.pl — ' + (get('temat') || 'wycena');
      window.location.href = 'mailto:' + MAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));

      say('Otworzyliśmy Twój program pocztowy z gotową wiadomością. '
        + 'Jeśli się nie otworzył, napisz bezpośrednio na ' + MAIL + '.');
    };

    form.addEventListener('submit', function (e) {
      if (!configured) {
        e.preventDefault();
        if (form.reportValidity()) sendViaMailto();
        return;
      }

      // Bez fetch (bardzo stare przeglądarki) zostawiamy zwykłą wysyłkę POST.
      if (!window.fetch || !window.FormData) return;

      e.preventDefault();
      if (!form.reportValidity()) return;

      busy(true);
      say('Wysyłamy wiadomość…');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          say('Dziękujemy — wiadomość dotarła. Odpowiadamy zwykle tego samego dnia, '
            + 'a wycenę przygotowujemy w 24 godziny.', 'ok');
          return;
        }
        return res.json().then(function (data) {
          var detail = data && data.errors
            ? data.errors.map(function (x) { return x.message; }).join(' ')
            : '';
          throw new Error(detail);
        }, function () { throw new Error(''); });
      }).catch(function (err) {
        say('Nie udało się wysłać wiadomości' + (err.message ? ' (' + err.message + ')' : '')
          + '. Napisz proszę bezpośrednio na ' + MAIL + ' lub zadzwoń: 609 222 466.', 'error');
      }).then(function () {
        busy(false);
      });
    });
  }

  /* ------------------------------------------- Opinie Google (Trustindex)
     Skrypt widgetu wstrzykujemy dopiero wtedy, gdy w HTML wpisano prawdziwe ID —
     dzięki temu niewypełniony placeholder nie generuje zapytania do CDN. */
  var reviews = document.querySelector('[data-trustindex]');
  if (reviews) {
    var widgetId = (reviews.getAttribute('data-trustindex') || '').trim();
    if (widgetId && widgetId.indexOf('WKLEJ-ID') === -1) {
      var ti = document.createElement('script');
      ti.src = 'https://cdn.trustindex.io/loader.js?' + widgetId;
      ti.async = true;
      ti.defer = true;
      reviews.appendChild(ti);
    }
  }

  /* ============================================== ANALITYKA (opcjonalna)
     Statystyki odwiedzin bez plików cookies. Aktywacja polega na wpisaniu
     JEDNEJ wartości poniżej — nie trzeba ruszać plików HTML, bo main.js jest
     wczytywany na każdej podstronie.

     Wybierz JEDNĄ z opcji (obie darmowe, obie bez cookies) i wpisz identyfikator:

     • Cloudflare Web Analytics — najprościej, jeśli domena jest w Cloudflare.
       Panel: dash.cloudflare.com → Analytics → Web Analytics → „Add a site”.
       Skopiuj token z pola data-cf-beacon (32 znaki) i wpisz go w CF_TOKEN.

     • GoatCounter — nie wymaga Cloudflare. Załóż konto na goatcounter.com,
       dostaniesz adres w postaci https://TWOJKOD.goatcounter.com — wpisz sam
       TWOJKOD w GOATCOUNTER_CODE.

     Zostaw obie wartości puste = analityka wyłączona (żaden skrypt się nie ładuje).
     Po włączeniu odkomentuj akapit „Statystyki odwiedzin” w polityce prywatności. */
  var CF_TOKEN = 'd1e3cd07927549c0922c889408098378';  // Cloudflare Web Analytics — statpomoc.org.pl
  var GOATCOUNTER_CODE = '';  // np. 'statpomoc' (GoatCounter) — używane tylko gdy CF_TOKEN puste

  if (CF_TOKEN) {
    var cf = document.createElement('script');
    cf.type = 'module';
    cf.defer = true;
    cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    cf.setAttribute('data-cf-beacon', '{"token": "' + CF_TOKEN + '"}');
    document.head.appendChild(cf);
  } else if (GOATCOUNTER_CODE) {
    var gc = document.createElement('script');
    gc.async = true;
    gc.src = '//gc.zgo.at/count.js';
    gc.setAttribute('data-goatcounter', 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count');
    document.body.appendChild(gc);
  }

  /* ================================= GOOGLE ADS — konwersje + zgoda (RODO)
     Tag Google Ads używa plików cookies reklamowych, dlatego działa w trybie
     Google Consent Mode v2: domyślnie zgoda ODMÓWIONA, cookies dopiero po
     akceptacji w banerze. Konwersję „Kontakt” zgłaszamy przy kliknięciu
     telefonu / WhatsApp / e-maila (przy odmowie Google liczy ją modelowo,
     bez cookies). Konfiguracja: dwie wartości poniżej z panelu Google Ads
     (Cele → Działania powodujące konwersję → „Kontakt”). Puste = wyłączone. */
  var GADS_TAG = 'AW-857727759';
  var GADS_CONTACT = 'AW-857727759/LRXzCNjopt8cEI_G_5gD';
  // Google Analytics 4 — wklej Measurement ID po utworzeniu usługi (np. 'G-XXXXXXXXXX').
  // Puste = GA4 wyłączone. Używa tego samego tagu gtag.js co Google Ads i tej samej zgody.
  var GA4_ID = '';

  if (GADS_TAG) {
    window.dataLayer = window.dataLayer || [];
    var gtag = function () { window.dataLayer.push(arguments); };
    window.gtag = gtag;

    // Consent Mode v2 — domyślnie wszystko odmówione (żadnych cookies)
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });

    var CONSENT_KEY = 'sp-cookie-consent';
    var stored = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) {}

    var grantConsent = function () {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
    };
    if (stored === 'granted') grantConsent();

    // Ładujemy tag Google dopiero po ustawieniu domyślnej zgody
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GADS_TAG;
    document.head.appendChild(ga);
    gtag('js', new Date());
    gtag('config', GADS_TAG);
    if (GA4_ID) gtag('config', GA4_ID);  // GA4 dołącza się do tego samego tagu

    // Zgłoszenie konwersji „Kontakt”: kliknięcie telefon / WhatsApp / e-mail
    if (GADS_CONTACT) {
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (/^tel:|^mailto:|wa\.me\//i.test(href)) {
          gtag('event', 'conversion', { send_to: GADS_CONTACT, value: 1.0, currency: 'PLN' });
        }
      }, true);
    }

    // Baner zgody — pokazujemy tylko, gdy użytkownik jeszcze nie zdecydował
    if (stored !== 'granted' && stored !== 'denied') {
      var banner = document.createElement('div');
      banner.className = 'cookie-consent';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Zgoda na pliki cookies');
      banner.innerHTML =
        '<p class="cookie-consent__text">Używamy plików cookies wyłącznie do pomiaru '
        + 'skuteczności reklam Google. Statystyki odwiedzin (Cloudflare) działają bez cookies. '
        + 'Szczegóły w <a href="polityka-prywatnosci.html">polityce prywatności</a>.</p>'
        + '<div class="cookie-consent__actions">'
        + '<button type="button" class="btn btn--sm" data-consent="granted">Akceptuję</button>'
        + '<button type="button" class="btn btn--sm btn--ghost" data-consent="denied">Odrzucam</button>'
        + '</div>';
      var decide = function (choice) {
        try { localStorage.setItem(CONSENT_KEY, choice); } catch (e) {}
        if (choice === 'granted') grantConsent();
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      };
      banner.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-consent]') : null;
        if (b) decide(b.getAttribute('data-consent'));
      });
      document.body.appendChild(banner);
    }
  }

  /* ------------------------------------------------- Rok w stopce */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
