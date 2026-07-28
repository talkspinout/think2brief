# Think2Brief

Official product and privacy site for **Think2Brief — Marketing**.

- Product: <https://talkspinout.github.io/think2brief/>
- Privacy policy: <https://talkspinout.github.io/think2brief/privacy/>
- Contact: <think2brief@gmail.com>

## Structure

- `site/`: files deployed to GitHub Pages
- `site/privacy/`: stable Chrome Web Store privacy-policy URL
- `site/updates/`: update notes — structure only for now (`noindex`, not
  linked from navigation or `sitemap.xml`); wire it up once there's real
  content to publish
- `site/assets/i18n.js`: shared KO/EN language-toggle engine (no build step).
  Korean is the language actually rendered in the HTML, for search engines and
  no-JS visitors; the toggle swaps in English client-side and remembers the
  choice in `localStorage`. Each page loads its own dictionary
  (`i18n-home.js`, `i18n-privacy.js`, `i18n-updates.js`) — keep `data-i18n` /
  `data-i18n-attr-*` keys and dictionary keys in 1:1 sync; `npm run verify`
  checks this automatically.
- `scripts/verify-site.mjs`: content and deployment regression checks
- `.github/workflows/deploy-pages.yml`: deployment from `main`

## Verification

```bash
npm run verify
```

The extension is live on the Chrome Web Store; the hero and final CTAs link
directly to the listing. Product copy must not describe integrations, accounts,
analytics, or paid features that are not present in the released extension.

## License

The repository's original code, design, copy, and product content are
proprietary. Viewing the public repository does not grant permission to use,
copy, modify, redistribute, or create derivative works. See [LICENSE](./LICENSE).
