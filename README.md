# Harper site

Static storefront for the Harper Grok Bot template. No build step. Open the files.

Apple-style product page: near-black canvas, system sans, a pinned scroll film of eight device screens, then a full-bleed promo.

## Open locally

From this folder:

```bash
# Fastest: open the file
open index.html

# Or serve it (relative OG image, video, and fonts resolve cleanly)
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

`styles.css`, `script.js`, `favicon.svg`, `og.png`, and `harper-promo.mp4` are all relative. Inter loads from Google Fonts as a fallback; `-apple-system` / SF Pro / Helvetica Neue take priority.

## Files

| File | Role |
|---|---|
| `index.html` | Single page. Hero, sticky 8-scene stage, watch, how, customize, FAQ, CTA. |
| `styles.css` | Near-black product layout. Sticky film when `html.is-film`. Static stack without JS or with reduced motion. |
| `script.js` | Scroll scrubber, glass header, magnetic CTA, promo autoplay, nav. |
| `harper-promo.mp4` | Cinematic watch section. Recuts can replace this file in place. |
| `favicon.svg` | Mark. |
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
