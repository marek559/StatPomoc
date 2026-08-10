# StatPomoc — statyczna wersja serwisu

Kompletna, gotowa do wgrania wersja strony **statpomoc.org.pl** bez WordPressa,
bez bazy danych i bez PHP. Same pliki HTML, CSS, JS i obrazy.

Treści pochodzą z bazy danych starego serwisu (backup UpdraftPlus
`backup_2022-03-24-1938_StatPomoc…-db.gz`), obrazy — z katalogu `wp-content/uploads`.

---

## 1. Struktura katalogu

```
statpomoc-static/
├── index.html                  strona główna
├── o-nas.html                  o firmie, misja, dyscypliny
├── oferta.html                 zakres usług
├── cennik.html                 zasady wyceny + 7 etapów współpracy
├── samouczek.html              słownik 17 pojęć + wyszukiwarka
├── kontakt.html                dane kontaktowe, formularz (Formspree)
├── polityka-prywatnosci.html   RODO / brak cookies
├── 404.html                    strona błędu
├── .htaccess                   301 ze starych adresów, HTTPS, cache, nagłówki
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
└── assets/
    ├── css/style.css           jeden arkusz stylów (system projektowy)
    ├── js/main.js              menu, animacje, liczniki, wyszukiwarka, formularz
    └── img/                    logo, favicony, figury SVG, obrazek OG, zrzut raportu
```

Cały serwis waży ok. **450 KB**. Zdjęcia stockowe ze starej strony nie są używane —
leżą w katalogu `../zdjecia-zapasowe/` (poza katalogiem publikacji), gdyby kiedyś się przydały.

## 2. Wdrożenie na serwer

1. Zrób kopię obecnego katalogu `public_html` (na wszelki wypadek).
2. **Usuń** wszystkie pliki starego WordPressa z katalogu strony
   (`wp-admin/`, `wp-includes/`, `wp-content/`, `wp-*.php`, `xmlrpc.php`,
   `.maintenance`, `.user.ini`, `wordfence-waf.php`) — razem ze starym `.htaccess`.
3. Wgraj **zawartość** katalogu `statpomoc-static/` do katalogu głównego strony
   (tak, aby `index.html` znalazł się bezpośrednio w `public_html`).
4. Sprawdź, czy przesłał się plik `.htaccess` — programy FTP domyślnie ukrywają
   pliki zaczynające się od kropki. Bez niego stare linki z Google zwrócą 404.
5. Wejdź na stronę i sprawdź: menu, telefon, e-mail, wysyłkę formularza
   oraz stare adresy (`statpomoc.org.pl/oferta/` ma przenieść na `/oferta.html`).

Baza danych MySQL nie jest już potrzebna — można ją zachować jako archiwum,
ale strona jej nie używa.

### 2a. Co robi `.htaccess`

Plik zastępuje w całości stary `.htaccess` WordPressa. Zawiera:

| Sekcja | Działanie |
|---|---|
| 1 | jeden kanoniczny adres — wymuszenie `https://` i wersji bez `www` |
| 2 | **przekierowania 301** ze wszystkich starych adresów (lista niżej) |
| 3 | ładne adresy: `/oferta` działa tak samo jak `/oferta.html` |
| 4 | status 410 dla pozostałości WordPressa — szybsze usunięcie z indeksu Google i odcięcie prób logowania na `/wp-login.php` |
| 5 | blokada pobierania plików `.md`, `.sql`, `.gz`, kopii zapasowych |
| 6 | nagłówki bezpieczeństwa (HSTS i CSP zostawione zakomentowane — patrz komentarze w pliku) |
| 7–8 | kompresja + cache: HTML bez cache, CSS/JS/obrazy na rok |
| 9 | typy MIME dla `.svg` i `.webmanifest` |

Lista starych adresów odtworzona z tabeli `wpiq_posts` w kopii bazy
(struktura odnośników `/%postname%/`):

| Stary adres | Nowy |
|---|---|
| `/home/` | `/` |
| `/o-nas/` | `/o-nas.html` |
| `/oferta/` | `/oferta.html` |
| `/cennik/` | `/cennik.html` |
| `/samouczek/` | `/samouczek.html` |
| `/kontakt/` | `/kontakt.html` |
| `/statystyka-w-praktyce/` | `/samouczek.html` (wpis blogowy bez odpowiednika) |
| `/statystyka1/` | `/samouczek.html` (wpis blogowy bez odpowiednika) |

**Jeżeli strona przestanie się otwierać po wgraniu pliku** — najprawdopodobniej
hosting nie ma jeszcze aktywnego certyfikatu SSL. Zakomentuj wtedy pierwszą regułę
w sekcji 1 (dopisz `#` na początku jej trzech linii) i włącz ją ponownie,
gdy certyfikat zacznie działać.

## 3. Formularz kontaktowy (Formspree)

Formularz wysyła wiadomość **naprawdę** — w tle, bez przeładowania strony
i bez otwierania programu pocztowego. Pośredniczy w tym Formspree
(plan darmowy: 50 wiadomości miesięcznie).

**Stan: podłączony.** Endpoint `https://formspree.io/f/xdenkdpp` jest już wpisany
w `kontakt.html`. Obsługę wysyłki (fetch, komunikaty, tryb zapasowy) robi
`assets/js/main.js` — bez żadnej zewnętrznej biblioteki, więc strona pozostaje
w 100% bez skryptów firm trzecich.

**Zostało tylko jedno — potwierdzenie skrzynki (raz):**

1. Wejdź na wdrożoną stronę `kontakt.html` i wyślij jedną wiadomość testową.
2. Formspree przyśle na `stat.pomoc@gmail.com` link „Confirm email”. Kliknij go —
   dopóki tego nie zrobisz, Formspree wstrzymuje dostarczanie wiadomości.

Zmiana skrzynki lub formularza w przyszłości: podmień część po `/f/` w atrybucie
`action` w `kontakt.html` na nowy identyfikator z panelu Formspree.

**Jak to się zachowuje:**

| Sytuacja | Efekt |
|---|---|
| JS włączony (norma) | wysyłka w tle, zielony komunikat „Dziękujemy — wiadomość dotarła” |
| JS wyłączony | zwykły POST, użytkownik ląduje na stronie z podziękowaniem Formspree |
| Błąd sieci / limit planu | czerwony komunikat z adresem e-mail i numerem telefonu |
| Placeholder zamiast ID | tryb zapasowy `mailto` — otwiera program pocztowy (gdyby ktoś kiedyś usunął ID) |

Formularz zawiera ukryte pole `_gotcha` (pułapka na boty) oraz `_subject`
(temat wiadomości). Gdyby zaczął przychodzić spam — w panelu Formspree
włącz `Settings → Spam protection → reCAPTCHA`.

Alternatywy o tym samym interfejsie: FormSubmit, Getform, Web3Forms —
wystarczy podmienić adres w `action`.

## 3a. Opinie Google (Trustindex)

Sekcja „Opinie” na stronie głównej jest przygotowana pod widget **Trustindex**,
który pobiera prawdziwe opinie z wizytówki Google i pokazuje je z nazwiskiem,
awatarem, gwiazdkami i logo Google.

1. Konto na <https://www.trustindex.io/> → połącz wizytówkę Google
   (`https://share.google/Pc4OFo4ldtyr2BmOv`).
2. Wybierz styl widgetu (polecany „Slider” albo „Grid”) i zapisz.
3. Trustindex pokaże snippet `…loader.js?a1b2c3d4e5f6`. Skopiuj **sam ciąg po znaku `?`**.
4. W `index.html` podmień placeholder:

   ```html
   <div class="reviews-embed reveal" data-delay="1" data-trustindex="a1b2c3d4e5f6"></div>
   ```

Skrypt strony doładuje widget sam. Dopóki ID nie jest wpisane, sekcja pokazuje
tylko tekst i przyciski do Google/Facebooka, a **do Trustindeksu nie leci żadne
zapytanie** — placeholder nie generuje ruchu ani błędów w konsoli.

Uwaga RODO: widget to skrypt firmy trzeciej. Odpowiedni akapit jest już
w `polityka-prywatnosci.html` (sekcja „Widget z opiniami”) — jeśli zdecydujesz się
nie uruchamiać Trustindeksu, usuń ten akapit. To samo dotyczy akapitu
o Formspree w sekcji „Dane przesyłane w formularzu kontaktowym”.

## 4. Wykresy (figury SVG)

Cztery wykresy w `assets/img/fig-*.svg` narysowano od zera — to zwykłe pliki tekstowe,
a nie zdjęcia. Otwarte w przeglądarce wyglądają tak samo jak na stronie.

| Plik | Co przedstawia |
|---|---|
| `fig-rozklad.svg` | histogram z dopasowaną krzywą rozkładu normalnego (ciemne tło) |
| `fig-korelacja.svg` | wykres rozrzutu z prostą regresji i pasem ufności |
| `fig-km.svg` | krzywe przeżycia Kaplana-Meiera dla dwóch grup |
| `fig-box.svg` | wykresy pudełkowe trzech grup |

Kolory serii dobrano tak, żeby były rozróżnialne także przy daltonizmie
(zwalidowane: jasne tło `#5C9A00` + `#2563A8`, ciemne `#66A80F` + `#4A8AD4`).
Jeśli zdecydujesz się je zmieniać, zmień też podpisy i sprawdź kontrast.

Podpisy pod wykresami („Ryc. 1.”, „Ryc. 2.”) są w plikach HTML, nie w SVG —
edytuje się je razem z resztą treści.

## 4a. SEO — co jest zrobione i co zostaje do zrobienia ręcznie

**Zrobione w plikach:**

- Kanoniczne adresy, `robots.txt`, `sitemap.xml`, przekierowania 301 (patrz 2a).
- Dane strukturalne: `ProfessionalService` z katalogiem usług i adresem
  (strona główna), `BreadcrumbList` na podstronach, `FAQPage` + widoczna sekcja
  pytań na cenniku, `DefinedTermSet` z odnośnikiem do każdego pojęcia w słowniku,
  `ContactPage` z danymi firmy.
- Obrazek do udostępnień `assets/img/og-statpomoc.jpg` (1200×630 JPG).
  Wcześniej w `og:image` był plik SVG, którego Facebook i LinkedIn **nie renderują** —
  udostępniony link wyświetlał się bez grafiki.
- Karty Twittera (`summary_large_image`).
- Każde pojęcie w samouczku ma własną kotwicę, np.
  `samouczek.html#odchylenie-standardowe` — można linkować bezpośrednio z zewnątrz,
  a Google może pokazać przejścia do sekcji w wynikach.
- Linkowanie wewnętrzne z tabeli metod (Oferta) do haseł w Samouczku.
- Logo zmniejszone z 608×336 (109 KB) do 203×112 (5 KB) — było ponad 20× większe,
  niż potrzeba przy wyświetlaniu 34 px wysokości.

**Wymaga Twojej decyzji lub danych:**

1. **Google Search Console** — dodaj usługę dla `https://statpomoc.org.pl`,
   zgłoś `sitemap.xml`, a po 2–3 dniach sprawdź raport „Strony” pod kątem
   starych adresów. Tam też zobaczysz, czy 301-ki zadziałały.
2. **Wizytówka Google** — upewnij się, że nazwa, telefon i miasto są identyczne
   jak na stronie (to najmocniejszy sygnał lokalnego SEO).
3. **Adres firmy.** Zgodnie z decyzją właściciela strona **nie podaje adresu
   rejestrowego** — pokazuje tylko obszar działania („Bydgoszcz i cała Polska”)
   oraz `areaServed` w schematach. Adres z regulaminu (Maksymilianowo) celowo
   nie jest publikowany. Nic tu nie trzeba zmieniać.
4. **Analityka — wpięta, do włączenia jedną linią.** Loader jest w
   `assets/js/main.js` (sekcja „ANALITYKA”). Żeby uruchomić statystyki:
   - **Cloudflare Web Analytics** (gdy domena jest w Cloudflare): skopiuj token
     z panelu i wpisz go w `CF_TOKEN` w `main.js`, albo
   - **GoatCounter** (bez Cloudflare): załóż konto, wpisz swój kod w
     `GOATCOUNTER_CODE`.
   Obie opcje są **darmowe i bez cookies**. Puste wartości = analityka wyłączona
   (żaden skrypt się nie ładuje). Po włączeniu **odkomentuj** akapit
   „Statystyki odwiedzin” w `polityka-prywatnosci.html`. Uwaga: samego konta
   u dostawcy nie da się założyć z poziomu plików — to jedyny krok po Twojej stronie.
5. **Studia przypadków — do uzupełnienia.** Sekcja „Zrealizowane projekty” na
   stronie głównej zawiera **wpisy robocze** (oznaczone komentarzem w `index.html`).
   Zastąp je prawdziwymi, **zanonimizowanymi** realizacjami — bez nazwisk i nazw
   uczelni. Dopóki tego nie zrobisz, nie publikuj tej sekcji jako faktów.

## 5. Edycja treści

Wszystkie teksty są wprost w plikach `.html` — wystarczy edytor tekstu
(np. Notepad++, VS Code). Nie ma szablonów ani systemu budowania.

Uwaga: nagłówek i stopka są powtórzone na każdej stronie. Zmiana numeru telefonu
czy pozycji w menu wymaga poprawki we **wszystkich** plikach `.html`
(najszybciej: „Zamień we wszystkich plikach” w edytorze).

Kolory i typografia to zmienne CSS na początku `assets/css/style.css`
(sekcja `:root`) — zmiana jednej wartości przebudowuje wygląd całego serwisu.

## 6. Lista kontrolna po wdrożeniu

Konfiguracja:

- [x] Formspree podłączony (`xdenkdpp`). **Zostaje: wysłać wiadomość testową
      i kliknąć link potwierdzający ze skrzynki** → sekcja 3.
- [x] Trustindex podłączony i działa (`b9bc5587820e72761966ffac151`).
- [ ] Zastąpić robocze „Zrealizowane projekty” prawdziwymi, anonimowymi wpisami → sekcja 4a.
- [ ] (Opcjonalnie) Włączyć analitykę: token w `main.js` + odkomentować akapit w polityce → sekcja 4a.

Weryfikacja na żywo:

- [ ] `https://statpomoc.org.pl/oferta/` przenosi na `/oferta.html` (i pozostałe z tabeli w 2a).
- [ ] `http://` i `www.` przenoszą na `https://statpomoc.org.pl`.
- [ ] Formularz kontaktowy — wysłać testową wiadomość i sprawdzić skrzynkę.
- [ ] Sekcja „Opinie” na stronie głównej pokazuje opinie z Google.
- [ ] Udostępnić link na Facebooku i sprawdzić, czy pojawia się obrazek
      (jeśli nie — wyczyścić pamięć podręczną w <https://developers.facebook.com/tools/debug/>).
- [ ] Wynik testu danych strukturalnych: <https://search.google.com/test/rich-results>.

Treść (patrz 4a):

- [ ] Zgłosić `sitemap.xml` w Google Search Console.
- [ ] Zaktualizować liczby w sekcji „Osiągnięcia”.
- [ ] Zweryfikować tabelę metod na stronie Oferta.
- [ ] Zdecydować o pełnym adresie firmy i o analityce.
- [ ] Zweryfikować politykę prywatności pod kątem faktycznego dostawcy hostingu.

## 7. Podgląd lokalny

```bash
python -m http.server 8000 --directory statpomoc-static
```

Następnie otwórz `http://localhost:8000`. Otwarcie plików przez `file://`
też zadziała, ale bez `.htaccess` (czyli bez przekierowań i ładnych adresów).
