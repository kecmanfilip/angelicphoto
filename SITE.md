# angelicphoto.rs — Struktura sajta i pravila

Ovaj fajl opisuje **kompletan sajt** (public repo) — šta postoji, kako je organizovano, koja pravila MORAJU da se poštuju pri svakoj izmeni, i šta radi svaki "aktivni" deo sajta (analitika, tracking, widgeti).

Complement: `CLAUDE.md` u ovom istom folderu pokriva samo tooling (blog/carousel generator) i nije vezan za runtime ponašanje sajta.

---

## 1. Tehnologija i hosting

- **Statički HTML sajt** hostovan na GitHub Pages.
- **Domen:** `angelicphoto.rs` (CNAME fajl).
- **Bez build sistema, bez CMS-a.** Svaka stranica je standalone `.html` fajl.
- **Jezik:** srpski, ekavica, `lang="sr"`.
- **Fontovi:** Playfair Display (serif, naslovi) + Inter (sans, telo). Učitavaju se sa Google Fonts na svakoj stranici.
- **CSS:** jedan fajl — `css/style.css` (BEM nomenklatura: `block__element--modifier`).
- **JS:** jedan fajl za navigaciju i UI — `js/main.js`. Dodatni widgeti su u zasebnim JS fajlovima (npr. `js/whatsapp-widget.js`).

---

## 2. Root stranice (servisne stranice i ostalo)

Svaka je zasebna `.html`, sa identičnom head strukturom (meta, OG, JSON-LD, canonical) prilagođenom toj usluzi.

| Fajl | Svrha |
|---|---|
| `index.html` | Naslovna, LocalBusiness + WebSite + SiteNavigation JSON-LD |
| `o-meni.html` | Bio Anđele |
| `kontakt.html` | Kontakt forma + podaci |
| `cenovnik.html` | Cene svih usluga |
| `blog.html` | Listing blog postova, filteri po kategoriji |
| `privacy-policy.html` | Politika privatnosti |
| `fotografisanje-trudnica.html` | Usluga |
| `fotografisanje-beba.html` | Usluga |
| `porodicno-fotografisanje.html` | Usluga |
| `fotografisanje-vencanja.html` | Usluga |
| `fotografisanje-krstenja.html` | Usluga |
| `fotografisanje-rodjendana.html` | Usluga |
| `biznis-portreti.html` | Usluga |
| `fotografisanje-proizvoda.html` | Usluga |
| `modeling-fotografisanje.html` | Usluga |
| `uskrsnje-fotografisanje.html` | Sezonska landing |

Uz ovo: `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest`, `favicon.ico`, `CNAME`.

---

## 3. Blog

- **Svaki post:** samostalan `.html` fajl u `blog/` folderu.
- **Listing:** `blog.html` — mora se ručno (ili preko generatora) ažurirati pri svakom novom postu. Backup pre promene: `blog.html.bak`.
- **Categorije** (data-attributi na karticama, koristi ih filter u `js/main.js`):
  `trudnice | bebe | porodica | vencanja | krstenja | rodjendani | biznis | proizvodi | modeling | saveti`
- **CSS link u blog postu:** `../css/style.css` (ne `css/style.css`).
- **Slike u blog postu:** `../images/ime.ext`.

### Obavezna struktura blog posta

1. `<html lang="sr" dir="ltr">`
2. Google tag (AW + G IDs, vidi sekciju 6) odmah u `<head>`.
3. `<link rel="canonical" href="https://angelicphoto.rs/blog/<slug>.html">` — mora biti apsolutan URL.
4. Open Graph meta tags: `og:type=article`, `og:image`, `article:published_time`, `article:author`, `article:section`.
5. Twitter Card meta tags.
6. JSON-LD `BlogPosting` sa `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, `publisher`, `articleSection`, `wordCount`, `inLanguage: "sr"`.
7. JSON-LD `FAQPage` (ako post ima FAQ sekciju) — mora da se tačno poklapa sa vidljivim FAQ DOM-om.
8. Isti navigacioni header i footer kao ostatak sajta.
9. Isti WhatsApp widget snippet kao ostatak sajta (vidi sekciju 7).

**Postojeći postovi (referenca za strukturu):**
- `blog/trudnicka-fotografija-idealno-vreme.html`
- `blog/priprema-bebe-za-fotografisanje.html`
- `blog/sta-obuci-za-porodicni-photo-session.html`
- `blog/5-gresaka-linkedin-profil-profesionalna-fotografija.html`
- `blog/uskrsnje-fotografisanje-studio-priroda.html`

---

## 4. Slike (`images/`)

- **Jedan flat folder.** Nema podfoldera. Sve slike direktno u `images/`.
- **Naming konvencija:** kategorija + broj, npr. `trudnica3.JPG`, `beba12.webp`, `porodicno7.webp`, `vencanje10.JPG`. Ovo je temelj za auto-selekciju slika u generatoru.
- **Formati:** preferirano `.webp` za nove slike (manje), `.jpg/.JPG/.png` za starije. Ne menjati ekstenzije postojećih slika bez ažuriranja referenci.
- **Posebne slike (ne mešati sa content slikama):**
  - `logo.jpg` — brand logo, koristi se u JSON-LD.
  - `og-image.jpg` — default Open Graph slika (1200×630).
  - `favicon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — favicon set.
  - `andjela.jpg`, `andjela-profil.jpg`, `enterijer.jpg` — studio/bio slike.
- **Kategorijski prefixi** (za auto-select):
  `trudnica*, beba*, porodicno*, vencanje*, krstenje*, rodjendan*, biznis*, proizvod*, modeling*, uskrs-studio*, uskrs-priroda*`.
- **Putanja iz root stranica:** `images/ime.ext`. **Iz blog stranica:** `../images/ime.ext`.
- **ALT tekstovi:** OBAVEZNI, deskriptivni, na srpskom, uključujući keyword (npr. `alt="Fotografisanje trudnica u studiju u Pančevu"`). Ovo je ključno za SEO + pristupačnost.

---

## 5. SEO / AEO pravila (OBAVEZNA)

Svaka nova ili izmenjena stranica MORA da poštuje:

### Meta
- `<title>`: do 60 karaktera, uključuje primarni keyword + "Angelic Photo".
- `<meta name="description">`: 150–160 karaktera, prirodan jezik, uključuje keyword i poziv na akciju.
- `<meta name="keywords">`: relevantno, ne spam. Obuhvata varijante (Pančevo/Beograd/Novi Sad).
- `<link rel="canonical">`: apsolutan URL, bez trailing slash osim za `/`.
- `<meta name="robots" content="index, follow">` (osim ako je namerno noindex).
- `<meta name="geo.region" content="RS">`, `<meta name="geo.placename" content="Pančevo">` gde je relevantno.

### Open Graph i Twitter
- `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type`, `og:locale="sr_RS"`, `og:site_name="Angelic Photo"`.
- `twitter:card="summary_large_image"` + odgovarajući `twitter:title/description/image`.

### JSON-LD (Schema.org) — AEO
**OBAVEZNO** jer Google, Gemini, ChatGPT search koriste za rich results i odgovore:

- **`index.html`** ima tri JSON-LD bloka: `LocalBusiness` (sa `aggregateRating`, `review[]`, `hasOfferCatalog`, `openingHoursSpecification`, `geo`, `areaServed`), `WebSite` (sa `potentialAction` za search), `ItemList` sa `SiteNavigationElement` za Google Sitelinks.
- **Servisne stranice** treba da imaju `Service` ili `ProfessionalService` schema sa `provider`, `areaServed`, `offers`.
- **Blog postovi** imaju `BlogPosting` + `FAQPage` (kad imaju FAQ).
- **FAQPage schema MORA odgovarati vidljivom HTML sadržaju** — Google kažnjava mismatch (manuelna akcija).

### Sadržaj
- **H1** — samo jedan po stranici, sadrži primarni keyword.
- **H2/H3** — deskriptivni, hijerarhijski tačni.
- **Internal linking** — servisne stranice linkuju ka kontaktu/cenovniku; blog postovi linkuju ka relevantnim uslugama.
- **Sitemap (`sitemap.xml`)** — MORA se ažurirati kad se doda nova stranica ili blog post. `lastmod` ažurirati kad se stranica menja.

### Poznati problemi sa sitemap-om (treba popraviti)
- `uskrsnje-fotografisanje.html` nije u sitemap-u.
- `privacy-policy.html` nije u sitemap-u.
- `blog/5-gresaka-linkedin-profil-profesionalna-fotografija.html` i `blog/uskrsnje-fotografisanje-studio-priroda.html` nisu u sitemap-u.
- Sitemap sadrži blog postove koji **ne postoje** u `blog/` folderu: `5-poza-za-parove.html`, `golden-hour-fotografisanje.html`, `kako-odabrati-fotografa-za-vencanje.html` — to daje 404. Obrisati ih iz sitemap-a ili kreirati stranice.

### `llms.txt`
Postoji na root-u i ciljano je struktuiran za AI pretragu (ChatGPT, Claude, Perplexity). Ažurirati kad se suštinski menja ponuda ili dodaju nove stranice.

---

## 6. Analitika i konverzije

### Google Tag (u `<head>` svake stranice)
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18001917494"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18001917494');   // Google Ads
  gtag('config', 'G-89X8CKWPXZ');     // GA4
</script>
```

- **`AW-18001917494`** — Google Ads property (za tracking konverzija iz reklama).
- **`G-89X8CKWPXZ`** — Google Analytics 4 (ponašanje korisnika).

### Konverzioni event
Primarna konverzija se šalje kada korisnik **započne razgovor** (chat / WhatsApp):
```js
gtag('event', 'conversion', {
  'send_to': 'AW-18001917494/lpjaCJz_9I8cELbs_YdD'
});
```

**Bitno:** `send_to` label `lpjaCJz_9I8cELbs_YdD` je konfigurisan u Google Ads-u da mapira na konverzionu akciju. Ne menjati bez izmene na Google Ads strani.

### Ostali event-i koji bi bili korisni (trenutno nisu implementirani)
- `form_submit` na kontakt formi (`kontakt.html`)
- `phone_click` kada korisnik klikne na `tel:` link
- `email_click` kada korisnik klikne na `mailto:` link

---

## 7. Kontakt widget (WhatsApp)

**Aktivni widget:** WhatsApp floating button (bottom-right) + auto-bubble nudge porukom.

- **Fajl:** `js/whatsapp-widget.js` — self-injektuje HTML i CSS, nema dependencije.
- **Broj:** `+381 66 670 2000` → `https://wa.me/381666702000`.
- **Prefilled poruka:** generička ("Zdravo Anđela! Imam pitanje o fotografisanju.")
- **Bubble tekst:** prikazuje se posle ~4s (jednom po session-u, dismiss se pamti u `sessionStorage`).
- **Conversion tracking:** klik na WhatsApp dugme ili na "Započni razgovor" unutar bubble-a okida isti `gtag('event', 'conversion', …)` kao što je ranije radio Tawk `onChatStarted`.

### Include snippet u svakoj stranici
Neposredno pre `</body>`:
- **Root stranice:** `<script src="js/whatsapp-widget.js" defer></script>`
- **Blog stranice:** `<script src="../js/whatsapp-widget.js" defer></script>`

### Istorija
- Do 2026-04-19 korišćen je Tawk.to widget (`embed.tawk.to/69b06134791b0a1c352a22df/1jji3bkpe`). Zamenjen WhatsApp-om radi prirodnije komunikacije i mobile UX-a.

---

## 8. Navigacija i UI (`js/main.js`)

Pokriva:
- Mobilni hamburger meni + overlay.
- Desktop dropdown (hover sa delay-om) + mobile dropdown (click).
- Scroll efekat na headeru (`.header--scrolled` class posle 50px).
- Smooth scroll za `#anchor` linkove.
- Blog kategorije filter (prepoznaje `.blog-categories__btn[data-category]` i `.blog-card[data-category]`).
- Lightbox galerija (koristi `.gallery-grid__item` / `.gallery-masonry__item`).

Ako se menja DOM struktura navigacije ili blog listinga — proveriti da JS i dalje radi (CSS klase i data atributi moraju da se slože).

---

## 9. Kontakt podaci (jedinstveni izvor istine)

| Podatak | Vrednost |
|---|---|
| Ime | Anđela |
| Telefon | +381 66 670 2000 |
| WhatsApp | https://wa.me/381666702000 |
| Instagram | @angelicphoto.rs |
| Sajt | https://angelicphoto.rs |
| Sedište | Pančevo (studio), dolazi na adresu u Beograd, Novi Sad, cela Srbija |
| Radno vreme | Pon–Pet 09:00–20:00, Sub 10:00–18:00, Ned zatvoreno |

Promena bilo kog ovog podatka znači izmenu:
- `index.html` JSON-LD (`telephone`, `openingHoursSpecification`, `sameAs`).
- Footer i kontakt sekcija na svim stranicama.
- `js/whatsapp-widget.js` (PHONE konstanta).
- `kontakt.html` (kontakt forma i prikazani podaci).

---

## 10. Pravila pri svakoj izmeni

1. **Uredi samo ovaj repo (public).** Private repo se automatski sinhronizuje preko `sync-to-private.sh`.
2. **Ne menjaj Google tag ID-ove** osim ako explicit ne tražim.
3. **Ne menjaj `send_to` conversion label** bez ažuriranja na Google Ads strani.
4. **Svaka nova stranica:** dodaj u `sitemap.xml` i u nav header.
5. **Svaki novi blog post:** dodaj karticu u `blog.html` + url u `sitemap.xml` + (ako je tip content) u `llms.txt`.
6. **Svaka izmena slike:** proveri da li je korišćena u postojećem kodu (`grep` kroz `.html` fajlove).
7. **Svaka promena teksta koji je u JSON-LD-u:** proveri da JSON-LD odgovara vidljivom tekstu (posebno FAQ).
8. **Ne uvodi build step, bundler, framework.** Sajt mora ostati statički HTML za GitHub Pages.
