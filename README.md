# Harper site

Static storefront for the Harper Grok Bot template. No build step. Open the files.

## Open locally

From this folder:

```bash
# Fastest: open the file
open index.html

# Or serve it (relative OG image and fonts resolve cleanly)
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

`styles.css`, `script.js`, `favicon.svg`, and `og.png` are all relative. The page is readable if webfonts fail; system Palatino / Georgia / Segoe UI take over.

## Files

| File | Role |
|---|---|
| `index.html` | Single page. Semantic sections, Open Graph, skip link. |
| `styles.css` | Editorial layout. Dark warm paper, ink, copper. Mobile-first. |
| `script.js` | Optional. Closes the mobile nav after a tap, and on Escape. |
| `favicon.svg` | Wordmark mark. |
| `og.png` | 1200×630 share image. |

## Before you publish

1. Set a real canonical URL in `index.html` (`<link rel="canonical">` and `og:url`).
2. Point every **Add Harper** button from `#get-harper` to the live Grok Bot template URL.
3. Host `og.png` on the same origin as the page so crawlers can fetch it.
4. Do not add prices, testimonials, logos, or metrics. Copy lives in `../landing-copy.md`.

## Copy rules

- Headline stays: “Harper is your assistant. Not a stand-in for you.”
- No em dashes in public copy.
- No owner PII: no real emails, phones, family names, or companies.
- Harper is a third-party template, not an xAI product. Mail is not copied to the publisher.
