# StatPomoc — strona statpomoc.org.pl

Statyczna strona **statpomoc.org.pl**: bez WordPressa, bez bazy danych i bez PHP.
Same pliki HTML, CSS, JS i obrazy, hostowane na **GitHub Pages** z repozytorium
`marek559/StatPomoc`. Treści przeniesiono ze starego serwisu WordPress.

> **Uwaga:** ten plik jest publiczny — GitHub Pages udostępnia go pod adresem
> `https://statpomoc.org.pl/README.md`. Nie wpisuj tu niczego, czego nie chcesz
> pokazywać (adresu, haseł, danych klientów).

Stan opisu: 25.09.2026.

---

## 1. Struktura katalogu

```
StatPomoc/
├── index.html                  strona główna
├── o-nas.html                  o firmie, misja, dyscypliny
├── oferta.html                 zakres usług + tabela metod
├── cennik.html                 zasady wyceny, 7 etapów współpracy, FAQ
├── samouczek.html              słownik 42 pojęć + wyszukiwarka
├── kontakt.html                dane kontaktowe, formularz (Formspree)
├── polityka-prywatnosci.html   RODO, cookies i zgoda
├── 404.html                    strona błędu (noindex)
│
├── home/  o-nas/  oferta/  cennik/  samouczek/  kontakt/
├── statystyka-w-praktyce/  statystyka1/
│                               przekierowania starych adresów WordPressa (patrz 2a)
│
├── CNAME                       domena dla GitHub Pages — nie usuwać
├── google8693bf3f5029bb57.html plik weryfikacyjny Google Search Console — nie usuwać
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
└── assets/
    ├── css/style.css           jeden arkusz stylów (system projektowy)
    ├── js/main.js              menu, animacje, liczniki, wyszukiwarka, formularz,
    │                           analityka, zgoda na cookies (Google Ads)
    └── img/                    logo, favicony, figury SVG, obrazek OG, zrzut raportu
```

Cały serwis waży ok. **380 KB**. Nie ma szablonów ani systemu budowania.

## 2. Publikacja (GitHub Pages)

Strona publikuje się sama z gałęzi `main` repozytorium `marek559/StatPomoc`.

1. Zmień pliki w folderze repozytorium.
2. W **GitHub Desktop**: wpisz opis zmian → **Commit to main** → **Push origin**.
3. Po 1–5 minutach zmiany są na stronie (postęp widać na GitHubie w zakładce
   **Actions** → „pages build and deployment”).

Domena i HTTPS:

- Plik `CNAME` zawiera `statpomoc.org.pl` — **nie zmieniaj go i nie usuwaj**,
  bez niego strona przestanie działać pod domeną.
- W repozytorium na GitHubie: **Settings → Pages** — domena `statpomoc.org.pl`
  i zaznaczone **Enforce HTTPS**.
- `http://` i `www.` przenoszą (301) na `https://statpomoc.org.pl/` — robi to GitHub.

GitHub Pages **nie obsługuje `.htaccess` ani PHP**. Przekierowania, nagłówki
i cache ustawia GitHub; stare adresy przekierowujemy folderami (patrz 2a).

### 2a. Przekierowania starych adresów

Stary WordPress miał adresy w stylu `/oferta/`. Każdy z nich ma w repozytorium
folder z plikiem `index.html`, który od razu przenosi na nowy adres
(`<meta http-equiv="refresh" content="0; url=…">` + `canonical`).
Google traktuje takie natychmiastowe przekierowanie jak stałe (301).

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

Nowe przekierowanie: skopiuj dowolny z tych folderów, nadaj mu nazwę starego adresu
i podmień nowy adres w trzech miejscach pliku (`canonical`, `refresh`, link w treści).

Pozostałości WordPressa (`/wp-login.php`, `/wp-admin/`, `/wp-content/…`) zwracają
404 — to normalne, Google z czasem usunie je z indeksu.

## 3. Formularz kontaktowy (Formspree)

Formularz wysyła wiadomość w tle, bez przeładowania strony i bez otwierania
programu pocztowego. Pośredniczy Formspree (plan darmowy: 50 wiadomości miesięcznie).

**Stan: podłączony.** Endpoint `https://formspree.io/f/xdenkdpp` jest wpisany
w `kontakt.html`, wysyłkę (fetch, komunikaty, tryb zapasowy) robi `assets/js/main.js`.

**Jednorazowo:** wyślij z `kontakt.html` wiadomość testową. Formspree przyśle na
`stat.pomoc@gmail.com` link „Confirm email” — kliknij go, inaczej Formspree
wstrzymuje dostarczanie wiadomości.

| Sytuacja | Efekt |
|---|---|
| JS włączony (norma) | wysyłka w tle, zielony komunikat „Dziękujemy — wiadomość dotarła” |
| JS wyłączony | zwykły POST, użytkownik ląduje na stronie z podziękowaniem Formspree |
| Błąd sieci / limit planu | czerwony komunikat z adresem e-mail i numerem telefonu |
| Placeholder zamiast ID | tryb zapasowy `mailto` — otwiera program pocztowy |

Formularz ma ukryte pole `_gotcha` (pułapka na boty) i `_subject` (temat wiadomości).
Gdyby przychodził spam: panel Formspree → `Settings → Spam protection → reCAPTCHA`.
Zmiana formularza: podmień część po `/f/` w atrybucie `action` w `kontakt.html`.

## 3a. Opinie Google (Trustindex)

Sekcja „Opinie” na stronie głównej pokazuje prawdziwe opinie z wizytówki Google
przez widget **Trustindex**. **Stan: podłączony** — tag widgetu jest w `index.html`
(sekcja `#opinie`):

```html
<script defer async src="https://cdn.trustindex.io/loader-cert.js?ID-WIDGETU"></script>
```

Zmiana widgetu: w panelu trustindex.io skopiuj nowy tag i podmień go w tym miejscu.
Po usunięciu tagu sekcja pokazuje tylko tekst i przyciski do Google/Facebooka,
a do Trustindeksu nie leci żadne zapytanie. Widget to skrypt firmy trzeciej —
opisuje go akapit „Widget z opiniami” w `polityka-prywatnosci.html`.

## 3b. Analityka i zgoda na cookies

Wszystko ustawia się w `assets/js/main.js` (sekcje „ANALITYKA” i „GOOGLE ADS”) —
plików HTML nie trzeba ruszać, bo `main.js` jest wczytywany na każdej podstronie.

| Narzędzie | Stan | Cookies |
|---|---|---|
| **Cloudflare Web Analytics** (`CF_TOKEN`) | włączone | nie |
| **Google Ads** — tag i konwersja „Kontakt” (`GADS_TAG`, `GADS_CONTACT`) | włączone | tylko po zgodzie |
| **Google Analytics 4** (`GA4_ID`) | wyłączone (puste) | tylko po zgodzie |
| GoatCounter (`GOATCOUNTER_CODE`) | nieużywane — tylko gdy `CF_TOKEN` jest puste | nie |

- Google Ads działa w trybie **Consent Mode v2**: domyślnie zgoda odmówiona, cookies
  dopiero po kliknięciu „Akceptuję” w banerze. Wybór zapisuje się w przeglądarce
  (`localStorage`, klucz `sp-cookie-consent`).
- Konwersja „Kontakt” jest zgłaszana przy kliknięciu telefonu, WhatsAppa lub e-maila.
- Włączenie GA4: wpisz Measurement ID (`G-…`) w `GA4_ID` — korzysta z tego samego
  tagu i tej samej zgody.
- Każda zmiana dostawcy = aktualizacja `polityka-prywatnosci.html`.

## 4. Wykresy (figury SVG)

Cztery wykresy w `assets/img/fig-*.svg` narysowano od zera — to pliki tekstowe,
a nie zdjęcia.

| Plik | Co przedstawia |
|---|---|
| `fig-rozklad.svg` | histogram z dopasowaną krzywą rozkładu normalnego (ciemne tło) |
| `fig-korelacja.svg` | wykres rozrzutu z prostą regresji i pasem ufności |
| `fig-km.svg` | krzywe przeżycia Kaplana-Meiera dla dwóch grup |
| `fig-box.svg` | wykresy pudełkowe trzech grup |

Kolory serii są rozróżnialne także przy daltonizmie (jasne tło `#5C9A00` + `#2563A8`,
ciemne `#66A80F` + `#4A8AD4`). Przy zmianie kolorów zmień też podpisy i sprawdź kontrast.
Podpisy pod wykresami („Ryc. 1.”, „Ryc. 2.”) są w plikach HTML, nie w SVG.

## 5. SEO

### 5a. Co jest zrobione

- Każda strona ma `lang="pl"`, unikalny `<title>` (ok. 50–60 znaków), unikalny
  `description` (ok. 140–160 znaków), `canonical`, Open Graph i kartę Twittera.
- Obrazek do udostępnień: `assets/img/og-statpomoc.jpg` (1200×630 JPG — Facebook
  i LinkedIn nie wyświetlają SVG).
- `sitemap.xml` — 7 stron publicznych; `robots.txt` — wszystko dozwolone + adres mapy.
- `404.html` ma `noindex` i nie ma go w mapie witryny.
- Dane strukturalne (JSON-LD): `ProfessionalService` na stronie głównej,
  `BreadcrumbList` na podstronach, `FAQPage` w cenniku, `DefinedTermSet` w samouczku,
  `ContactPage` w kontakcie. Wpisane są tylko dane, które widać na stronie
  (telefon, e-mail, NIP, obszar działania).
- Każde pojęcie w samouczku ma własną kotwicę, np. `samouczek.html#odchylenie-standardowe`;
  tabela metod na stronie Oferta linkuje do haseł w samouczku.
- Przekierowania starych adresów (patrz 2a).
- Obrazy mają opisy `alt`; logo w nagłówku ma celowo pusty `alt=""`
  (link ma własny opis i widoczny napis „StatPomoc”).

**Format adresów:** linki, `canonical` i mapa witryny używają `nazwa.html`,
strona główna to `https://statpomoc.org.pl/`. Adres bez `.html` (np. `/oferta`)
też działa na GitHub Pages, ale `canonical` wskazuje wersję z `.html`.

**Adres firmy:** strona celowo nie podaje adresu rejestrowego — tylko obszar
działania („Bydgoszcz i cała Polska”) oraz `areaServed` w danych strukturalnych.

### 5b. Google Search Console

- Usługa typu **domena** `statpomoc.org.pl`, zweryfikowana rekordem DNS (TXT).
- **Indeksowanie → Mapy witryn** — zgłoszona mapa: `https://statpomoc.org.pl/sitemap.xml`.
- Po ważnej zmianie strony: wklej jej adres w górny pasek („Sprawdź dowolny URL”)
  → **Przetestuj opublikowany URL** → **Poproś o zindeksowanie**.
- W raporcie **Indeksowanie → Strony** normalne są: „Strona zawiera przekierowanie”
  (stare adresy z 2a), „Strona alternatywna z prawidłowym tagiem kanonicznym”
  (adresy bez `.html`), „Wykluczono za pomocą tagu noindex” (`404.html`)
  i „Nie znaleziono (404)” (pozostałości WordPressa).

### 5c. Nowa podstrona — lista kroków

1. Skopiuj istniejącą podstronę (nagłówek i stopka są w każdym pliku).
2. W `<head>` ustaw nowe: `<title>`, `description`, `canonical`, `og:title`,
   `og:description`, `og:url` oraz `BreadcrumbList`.
3. Dodaj link w menu w nagłówku **we wszystkich** plikach `.html`.
4. Dopisz adres do `sitemap.xml` (z dzisiejszą datą w `lastmod`).
5. Po publikacji: Search Console → Sprawdzenie adresu URL → Poproś o zindeksowanie.

## 6. Edycja treści

Wszystkie teksty są wprost w plikach `.html` — wystarczy edytor tekstu
(np. Notepad++, VS Code).

- Nagłówek i stopka są powtórzone na każdej stronie. Zmiana numeru telefonu czy
  pozycji w menu wymaga poprawki we **wszystkich** plikach `.html`
  (najszybciej: „Zamień we wszystkich plikach” w edytorze).
- Zmieniasz `<title>` lub `description`? Zmień też `og:title` / `og:description`
  (te same teksty; w `og:title` bez końcówki „| StatPomoc”).
- Po większej zmianie treści podstrony zaktualizuj jej `lastmod` w `sitemap.xml`.
- Kolory i typografia to zmienne CSS na początku `assets/css/style.css`
  (sekcja `:root`) — zmiana jednej wartości przebudowuje wygląd całego serwisu.

## 7. Lista kontrolna

Konfiguracja:

- [x] GitHub Pages, domena `statpomoc.org.pl`, HTTPS; `http://` i `www.` przenoszą na `https://`.
- [x] Formspree podłączony (`xdenkdpp`).
- [x] Trustindex podłączony.
- [x] Cloudflare Web Analytics i Google Ads (z banerem zgody) włączone.
- [x] SEO: tytuły, opisy, `sitemap.xml`, `robots.txt`, przekierowania starych adresów.
- [ ] Formspree: wiadomość testowa i kliknięcie linku potwierdzającego (jeśli jeszcze nie zrobione) → sekcja 3.
- [ ] Search Console: zgłosić `sitemap.xml` i poprosić o zindeksowanie najważniejszych stron → sekcja 5b.
- [ ] (Opcjonalnie) Włączyć GA4 → sekcja 3b.

Weryfikacja na żywo:

- [ ] `https://statpomoc.org.pl/sitemap.xml` i `https://statpomoc.org.pl/robots.txt` otwierają się.
- [ ] `https://statpomoc.org.pl/oferta/` przenosi na `/oferta.html` (i pozostałe z tabeli w 2a).
- [ ] Formularz kontaktowy — wiadomość testowa dociera na skrzynkę.
- [ ] Sekcja „Opinie” na stronie głównej pokazuje opinie z Google.
- [ ] Udostępniony link na Facebooku pokazuje obrazek
      (jeśli nie — <https://developers.facebook.com/tools/debug/>).
- [ ] Test danych strukturalnych: <https://search.google.com/test/rich-results>.

Treść:

- [ ] Aktualne liczby w sekcji „Osiągnięcia”.
- [ ] Zweryfikowana tabela metod na stronie Oferta.
- [ ] „Zrealizowane projekty” — tylko prawdziwe, zanonimizowane realizacje
      (bez nazwisk i nazw uczelni).
- [ ] Polityka prywatności uwzględnia hosting na GitHub Pages (GitHub, Inc.).

## 8. Podgląd lokalny

W folderze repozytorium uruchom:

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000`. Przekierowania z folderów (np. `/oferta/`)
działają też lokalnie; adresy bez `.html` (np. `/oferta`) działają tylko na GitHub Pages.
