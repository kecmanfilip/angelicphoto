# Angelic Photo: Blog & Instagram Carousel Automation

## Project Overview

Build a CLI tool that automates two things for angelicphoto.rs:
1. Generates SEO-optimized blog posts as standalone .html files
2. Generates Instagram carousel images (PNG, 1080x1350px) from the same content

The site is static HTML hosted on GitHub Pages. No CMS. Every blog post is a standalone .html file in the `blog/` folder.

---

## Repository Structure

```
angelicphoto.rs/
├── index.html
├── blog.html                    # Blog listing page (must be updated per new post)
├── blog/
│   ├── trudnicka-fotografija-idealno-vreme.html
│   ├── priprema-bebe-za-fotografisanje.html
│   └── sta-obuci-za-porodicni-photo-session.html
├── images/                      # ALL images in one flat folder
│   ├── trudnica3.JPG
│   ├── trudnica4.JPG
│   ├── trudnica10.png
│   ├── beba.png
│   ├── beba2.png
│   ├── beba4.jpg
│   ├── porodicno3.png
│   ├── logo.jpg
│   └── ...
├── css/
├── js/
└── tools/                       # NEW: automation tooling lives here
    ├── generate.py              # Main CLI entry point
    ├── blog_generator.py        # Blog post generation logic
    ├── carousel_generator.py    # Instagram carousel generation logic
    ├── image_selector.py        # Auto image selection from images/ folder
    ├── config.yaml              # Configuration
    ├── templates/
    │   ├── blog_post.html       # Jinja2 template for blog posts
    │   ├── blog_card.html       # Jinja2 template for blog listing card
    │   └── carousel/
    │       ├── slide_cover.html     # Carousel slide 1: hook/cover
    │       ├── slide_text.html      # Carousel text-only slide
    │       ├── slide_photo.html     # Carousel photo+text slide
    │       └── slide_cta.html       # Carousel final CTA slide
    └── output/                  # Generated carousel PNGs go here
```

---

## Part 1: Blog Post Generator

### CLI Interface

```bash
# Generate blog post + carousel
python tools/generate.py --topic "kako odabrati lokaciju za porodično fotografisanje"

# Blog only
python tools/generate.py --topic "priprema za venčanje fotografisanje" --blog-only

# Carousel only (from existing post)
python tools/generate.py --carousel-only --post blog/existing-post.html

# Override auto-detected category
python tools/generate.py --topic "newborn fotografisanje" --category "bebe"

# Override hero image (instead of auto-select)
python tools/generate.py --topic "..." --hero-image "images/trudnica5.jpg"
```

### Blog Generation Flow

1. User provides topic string via CLI
2. Script calls Claude API to generate structured blog content (JSON)
3. Script auto-selects hero image and inline images from `images/` folder based on detected category
4. Script renders content into the Jinja2 blog post template
5. Script saves .html file to `blog/` folder
6. Script updates `blog.html` listing page (inserts new card, rotates featured post if needed)
7. Script prints summary: file path, title, URL slug, word count

### Claude API Call for Blog Content

Model: `claude-sonnet-4-20250514`

System prompt:

```
Ti si Anđela, profesionalni fotograf iz Pančeva. Pišeš blog post za svoj sajt angelicphoto.rs.

PRAVILA PISANJA:
- Piši u prvom licu, toplo i pristupačno, ali profesionalno
- Koristi "vi" formu kada se obraćaš čitaocima
- Piši prirodnim srpskim jezikom (ekavica), ne prevedenim sa engleskog
- Tehničke fotografske termine piši na srpskom gde je moguće, ali "photo session", "golden hour", "newborn", "look" i slične ustaljene termine ostavi na engleskom
- Svaki post mora imati praktičnu vrednost za čitaoca (saveti, koraci, informacije)
- Uključi lično iskustvo i anegdote gde je prirodno
- Svaki post mora imati poziv na akciju na kraju (zakazivanje termina)
- Post treba da bude 800 do 1500 reči
- Kreiraj 4 do 6 FAQ pitanja sa odgovorima relevantnim za temu
- Predloži jedan blockquote citat u prvom licu koji deluje kao lični savet

LOKACIJA I KONTEKST:
- Anđela dolazi na adresu klijenata (Pančevo, Beograd, Novi Sad, cela Srbija)
- Nudi: fotografisanje trudnica, beba, porodica, venčanja, krštenja, rođendana, biznis portrete, proizvode, modeling
- Sajt: angelicphoto.rs
- Instagram: @angelicphoto.rs
- Kontakt: +381 66 670 2000

SEO ZAHTEVI:
- Prirodno uključi ciljani keyword 3 do 5 puta u tekstu
- H2 naslovi treba da budu deskriptivni i da sadrže relevantne pojmove
- Meta description: 150 do 160 karaktera, uključi keyword i poziv na akciju
- Predloži slug za URL (latinica, bez dijakritika, sa crticama)

FORMAT ODGOVORA:
Vrati ISKLJUČIVO validan JSON objekat (bez markdown formatiranja, bez ```json blokova) sa sledećim poljima:
{
  "slug": "url-slug-bez-dijakritika",
  "title": "Naslov blog posta (H1)",
  "meta_title": "SEO Title do 60 karaktera",
  "meta_description": "Meta opis 150-160 karaktera sa keyword-om i pozivom na akciju",
  "category": "Jedna od: Trudnice | Fotografisanje beba | Porodično fotografisanje | Venčanja | Krštenja | Rođendani | Biznis portreti | Proizvodi | Modeling | Saveti",
  "category_slug": "trudnice|bebe|porodica|vencanja|krstenja|rodjendani|biznis|proizvodi|modeling|saveti",
  "reading_time": 3,
  "body_html": "<p>Kompletan HTML sadržaj članka...</p><h2>...</h2><p>...</p>",
  "blockquote": "Lični citat Anđele",
  "faq": [
    {"question": "Pitanje?", "answer": "Odgovor."},
    {"question": "Pitanje?", "answer": "Odgovor."}
  ],
  "instagram_caption": "Caption za Instagram sa hashtagovima, do 2200 karaktera",
  "carousel_slides": [
    {"type": "cover", "headline": "Hook naslov za prvu sliku", "subtitle": "Kratak podnaslov"},
    {"type": "text", "headline": "Naslov slajda", "body": "2-3 rečenice saveta", "tip_number": 1},
    {"type": "photo", "headline": "Naslov preko slike", "body": "Kratka rečenica"},
    {"type": "text", "headline": "Naslov slajda", "body": "2-3 rečenice saveta", "tip_number": 2},
    {"type": "photo", "headline": "Naslov preko slike", "body": "Kratka rečenica"},
    {"type": "text", "headline": "Naslov slajda", "body": "2-3 rečenice saveta", "tip_number": 3},
    {"type": "cta", "headline": "Zakažite termin", "body": "Poziv na akciju"}
  ]
}
```

User prompt: `Napiši blog post na temu: "{topic}"`

### Blog Post HTML Template

Extract the EXACT HTML structure from existing posts. Key elements:

```html
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ meta_title }} | Angelic Photo</title>
    <meta name="description" content="{{ meta_description }}">
    <link rel="canonical" href="https://angelicphoto.rs/blog/{{ slug }}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ meta_title }}">
    <meta property="og:description" content="{{ meta_description }}">
    <meta property="og:image" content="https://angelicphoto.rs/{{ hero_image }}">
    <meta property="og:url" content="https://angelicphoto.rs/blog/{{ slug }}.html">
    <meta property="og:type" content="article">

    <!-- Schema.org Article -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{{ title }}",
        "image": "https://angelicphoto.rs/{{ hero_image }}",
        "author": {
            "@type": "Person",
            "name": "Anđela"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Angelic Photo",
            "logo": {
                "@type": "ImageObject",
                "url": "https://angelicphoto.rs/images/logo.jpg"
            }
        },
        "datePublished": "{{ date_iso }}",
        "dateModified": "{{ date_iso }}",
        "description": "{{ meta_description }}"
    }
    </script>

    <!-- FAQ Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {% for item in faq %}
            {
                "@type": "Question",
                "name": "{{ item.question }}",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "{{ item.answer }}"
                }
            }{% if not loop.last %},{% endif %}
            {% endfor %}
        ]
    }
    </script>

    <!-- CSS: Copy exact same CSS links from existing posts -->
</head>
```

IMPORTANT: Copy the EXACT navigation, header, footer, and CSS/JS references from the existing blog posts. Do not modify or simplify them. The generated post must be structurally identical.

### Image Auto-Selection Logic (`image_selector.py`)

All images are in a flat `images/` folder. File names contain category keywords.

Category to filename keyword mapping:

```python
CATEGORY_IMAGE_MAP = {
    "trudnice": ["trudnica", "trudnic"],
    "bebe": ["beba", "bebe", "newborn", "novorodjen"],
    "porodica": ["porodic", "porodica", "family"],
    "vencanja": ["vencanj", "wedding", "svadba", "mladenci"],
    "krstenja": ["krsten", "krstenje"],
    "rodjendani": ["rodjendan", "birthday", "slavlje"],
    "biznis": ["biznis", "business", "portret", "korporativ"],
    "proizvodi": ["proizvod", "product"],
    "modeling": ["model", "fashion"],
    "saveti": []  # Falls back to any available image
}
```

Selection logic:
1. Scan `images/` folder for all image files (.jpg, .jpeg, .png, .webp)
2. Match filenames against category keywords (case insensitive)
3. Select hero image: random choice from matched images
4. Select 2 to 3 additional images for inline use and carousel
5. If fewer than 2 matches found, fall back to a broader search or use category adjacent images
6. Never select `logo.jpg` as a content image
7. Track which images were already used in existing blog posts (parse existing .html files) and prefer unused ones

### blog.html Update Logic

When inserting a new post:

1. Parse `blog.html` with BeautifulSoup
2. Find the "Svi blog postovi" grid section
3. Insert the new post card as the FIRST child in the grid
4. If the new post's date is more recent than the current featured (hero) post:
   - Move the current featured post into the grid as a regular card
   - Replace the featured section with the new post
5. Ensure the category filter data attributes are correct on the new card
6. Save with UTF-8 encoding, preserving existing formatting

---

## Part 2: Instagram Carousel Generator

### What it produces

A set of 6 to 8 PNG images at 1080x1350px (Instagram portrait 4:5) saved to `tools/output/[slug]/`:

```
tools/output/kako-odabrati-lokaciju/
├── 01_cover.png
├── 02_tip1.png
├── 03_photo.png
├── 04_tip2.png
├── 05_photo.png
├── 06_tip3.png
├── 07_cta.png
└── caption.txt        # Instagram caption with hashtags
```

### Carousel Branding

```yaml
brand:
  primary_color: "#2c2c2c"        # Dark charcoal for text
  accent_color: "#c4a882"         # Warm gold/beige accent
  background_light: "#faf8f5"     # Warm off-white
  background_dark: "#1a1a1a"      # Near black for contrast slides
  text_light: "#ffffff"
  text_dark: "#2c2c2c"
  font_heading: "'Playfair Display', serif"    # Elegant serif for headlines
  font_body: "'Lato', sans-serif"              # Clean sans for body text
  logo_path: "images/logo.jpg"
  instagram_handle: "@angelicphoto.rs"
  website: "angelicphoto.rs"
  phone: "+381 66 670 2000"
```

IMPORTANT: These brand colors and fonts are starting suggestions. Examine the actual angelicphoto.rs website CSS to extract the real brand colors, fonts, and visual style, then update these values to match. The carousel must feel like a natural extension of the website's visual identity.

### Carousel Slide Templates (HTML/CSS)

Each slide is an HTML file rendered to PNG via Playwright (headless Chromium). All slides are 1080x1350px.

#### Slide Type: Cover (slide_cover.html)

Full bleed photo background with dark gradient overlay. Bold headline at bottom left in white serif font. Subtitle below in lighter weight. Logo in bottom left corner, "Prevuci →" indicator in bottom right. This is the hook slide; the headline must grab attention immediately.

#### Slide Type: Text Only (slide_text.html)

Light warm background (#faf8f5). Circular accent-colored badge with tip number in top left area. Large serif headline. Body text in sans-serif below. Logo and site URL anchored at bottom. Clean, airy, with generous whitespace.

#### Slide Type: Photo + Text (slide_photo.html)

Split layout: photo takes top 60%, text panel takes bottom 40% on light background. Headline in serif, body in sans-serif. Small logo in bottom right corner. The photo should bleed to edges with no padding.

#### Slide Type: CTA (slide_cta.html)

Dark background (#1a1a1a). Centered layout. Logo at top, large serif headline ("Zakažite termin" or similar), accent-colored subtitle/body text, then contact details (phone, website, Instagram handle) stacked below. This is the final slide; it must clearly communicate how to book.

### HTML to PNG Rendering

Use Playwright (Python) for rendering:

```python
from playwright.async_api import async_playwright

async def render_slide_to_png(html_content: str, output_path: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1350})
        await page.set_content(html_content)
        # Wait for fonts to load
        await page.wait_for_timeout(1000)
        await page.screenshot(path=output_path, type="png")
        await browser.close()
```

Load Google Fonts (Playfair Display, Lato) via `<link>` tag in each slide HTML, or embed them as base64 in the template for offline reliability. Offline embedding is preferred for consistent results.

### Image Selection for Carousel

Reuse the same `image_selector.py` from the blog generator. For a carousel:
- Cover slide gets one dedicated image (can be the same as blog hero or different)
- Photo slides get separate images from the same category
- Total: 3 images needed per carousel (1 cover + 2 photo slides)
- Never reuse the same image within one carousel

---

## Part 3: Configuration

### config.yaml

```yaml
# Anthropic API
api:
  model: "claude-sonnet-4-20250514"
  max_tokens: 4096

# Site
site:
  url: "https://angelicphoto.rs"
  blog_url: "https://angelicphoto.rs/blog"
  images_dir: "images"
  blog_dir: "blog"
  blog_listing: "blog.html"

# Brand
brand:
  author: "Anđela"
  phone: "+381 66 670 2000"
  instagram: "@angelicphoto.rs"
  logo: "images/logo.jpg"

# Carousel
carousel:
  width: 1080
  height: 1350
  output_dir: "tools/output"
  font_heading: "Playfair Display"
  font_body: "Lato"

# Image category mapping (filename keywords)
image_categories:
  trudnice: ["trudnica", "trudnic", "maternity"]
  bebe: ["beba", "bebe", "newborn", "novorodjen"]
  porodica: ["porodic", "family"]
  vencanja: ["vencanj", "wedding", "svadba", "mladenci"]
  krstenja: ["krsten", "krstenje"]
  rodjendani: ["rodjendan", "birthday"]
  biznis: ["biznis", "business", "portret"]
  proizvodi: ["proizvod", "product"]
  modeling: ["model", "fashion"]
```

---

## Dependencies

```
anthropic>=0.40.0
jinja2>=3.1
beautifulsoup4>=4.12
playwright>=1.40
pyyaml>=6.0
Pillow>=10.0
```

After install: `playwright install chromium`

---

## Error Handling & Validation

1. Validate Claude API response is valid JSON before proceeding
2. Validate all required fields exist in the response
3. Validate generated HTML has correct structure (BeautifulSoup parse check)
4. Create backup of blog.html before modification: `blog.html.bak`
5. Validate image files exist before referencing them
6. If image auto-selection finds 0 matches, print warning and ask for manual --hero-image flag
7. All file operations should be atomic where possible (write to temp file, then rename)

---

## Example Full Run

```bash
$ python tools/generate.py --topic "5 grešaka koje roditelji prave pri fotografisanju dece"

[1/5] Calling Claude API for content generation...
      Model: claude-sonnet-4-20250514
      Topic: 5 grešaka koje roditelji prave pri fotografisanju dece

[2/5] Content generated successfully
      Title: 5 grešaka koje roditelji prave pri fotografisanju dece
      Slug: 5-gresaka-roditelji-fotografisanje-dece
      Category: Porodično fotografisanje
      Word count: 1,247
      Reading time: 5 min

[3/5] Auto-selecting images...
      Category match: porodica
      Hero image: images/porodicno3.png
      Inline images: images/porodicno2.jpg, images/porodicno5.jpg
      Carousel images: images/porodicno3.png, images/porodicno7.jpg, images/porodicno1.jpg

[4/5] Generating blog post...
      Saved: blog/5-gresaka-roditelji-fotografisanje-dece.html
      Updated: blog.html (new card added, featured post rotated)

[5/5] Generating Instagram carousel...
      Rendering 7 slides at 1080x1350px...
      Saved: tools/output/5-gresaka-roditelji-fotografisanje-dece/
        01_cover.png
        02_tip1.png
        03_photo.png
        04_tip2.png
        05_photo.png
        06_tip3.png
        07_cta.png
        caption.txt

Done! Review files and commit to deploy.
```

---

## CRITICAL INSTRUCTIONS FOR IMPLEMENTATION

1. Before building ANYTHING, first `cat` at least 2 existing blog post .html files to extract the EXACT HTML structure, CSS classes, navigation, footer, and all meta tags. The generated posts must be structurally identical to existing ones.

2. Extract brand colors and fonts from the site's actual CSS files, not from the suggestions in this document. The carousel branding must match the website.

3. The Jinja2 blog template should be extracted FROM existing posts, not built from scratch. Parse an existing post, identify the static parts (nav, footer, CSS links, JS), and create a template with variables for the dynamic content only.

4. Test the carousel PNG generation early. Make sure Playwright renders fonts correctly. If Google Fonts don't load reliably, download the font files and embed them locally.

5. The `blog.html` update is the most fragile part. Parse it carefully with BeautifulSoup, test with the existing 3 posts, and make sure the category filter system still works after insertion.

6. All text content must be in Serbian (ekavica). The Claude API prompt handles this, but verify the output.

7. Image paths in blog posts are relative (e.g., `../images/trudnica3.JPG` from the blog/ folder, or `images/trudnica3.JPG` from root). Check existing posts for the exact path format used and replicate it.

8. The carousel_slides field in the Claude API response drives the carousel generation. Each slide object maps directly to a template. The generator should iterate through the slides array and render each one with the appropriate template.

9. For the Instagram caption in caption.txt, also include the blog post URL for the "link in bio" reference.

10. Git workflow: after generation, print a summary of all files created/modified so the user can review before committing.
