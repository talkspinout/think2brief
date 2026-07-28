# Think2Brief

Official product and privacy site for **Think2Brief — Marketing**.

- Product: <https://talkspinout.github.io/think2brief/> · English: <https://talkspinout.github.io/think2brief/en/>
- Privacy policy: <https://talkspinout.github.io/think2brief/privacy/> · English: <https://talkspinout.github.io/think2brief/en/privacy/>
- Contact: <think2brief@gmail.com>

## Structure

- `site/`: files deployed to GitHub Pages
- `site/privacy/`: stable Chrome Web Store privacy-policy URL
- `site/en/`: **generated, not committed** (see `.gitignore`) — a real English
  snapshot of the two pages above, built by `scripts/build-en.mjs`. Run
  `npm run build:en` before previewing locally.
- `site/updates/`: update notes — structure only for now (`noindex`, not
  linked from navigation or `sitemap.xml`); wire it up once there's real
  content to publish
- `site/assets/i18n.js`: shared KO/EN language-toggle engine for the live
  pages. Korean is the language actually rendered in `site/index.html` and
  `site/privacy/index.html` (for search engines, no-JS visitors, and as the
  single hand-authored source of truth); the toggle swaps in English
  client-side and remembers the choice in `localStorage`. Each page loads its
  own dictionary (`i18n-home.js`, `i18n-privacy.js`, `i18n-updates.js`,
  each an ES module exporting `en`) — keep `data-i18n` / `data-i18n-attr-*`
  keys and dictionary keys in 1:1 sync; `npm run verify` checks this
  automatically. `<title>` and the description/OG meta tags are toggle-aware
  too (`data-i18n-attr-content`).
- `scripts/build-en.mjs`: generates `site/en/` from the same Korean HTML +
  the same `en` dictionaries the browser toggle uses — the crawlable
  counterpart to the client-side toggle, since crawlers and social unfurlers
  never execute its JS. Reciprocal `hreflang` links between the Korean pages
  and `site/en/` are hand-authored on the Korean side and carried through
  unchanged by the generator.
- `site/assets/product/*-en.png`: English counterparts of the inline product
  screenshots, swapped in by the toggle (and baked into `site/en/`) via
  `data-i18n-en-src` on each `<img>`.
- `site/assets/store/`: English Chrome Web Store listing screenshots (not
  linked from the site; for the store listing only). See its `README.md`.
- `scripts/verify-site.mjs`: content and deployment regression checks
- `.github/workflows/deploy-pages.yml`: deployment from `main` (installs
  dependencies, builds `site/en/`, verifies, then uploads `site/`)

## Verification

```bash
npm install   # first time, or after package.json changes
npm run verify   # builds site/en/, then runs the regression checks
```

The extension is live on the Chrome Web Store; the hero and final CTAs link
directly to the listing. Product copy must not describe integrations, accounts,
analytics, or paid features that are not present in the released extension.

## License

The repository's original code, design, copy, and product content are
proprietary. Viewing the public repository does not grant permission to use,
copy, modify, redistribute, or create derivative works. See [LICENSE](./LICENSE).
