# Think2Brief

Official product and privacy site for **Think2Brief — Marketing**.

- Product: <https://talkspinout.github.io/think2brief/>
- Privacy policy: <https://talkspinout.github.io/think2brief/privacy/>
- Contact: <think2brief@gmail.com>

## Structure

- `site/`: files deployed to GitHub Pages
- `site/privacy/`: stable Chrome Web Store privacy-policy URL
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
