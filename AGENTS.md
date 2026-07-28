# Agent collaboration guide

This repository is maintained with Claude and Codex. Repository files, commits,
pull requests, and issues are the shared source of truth.

## Before editing

- Check `git status`, the current branch, and recent commits.
- Preserve unrelated user changes.
- Compare product claims and privacy disclosures with the currently released
  Chrome extension.
- Use focused `agent/*` or `claude/*` branches rather than editing `main`.

## Required verification

- Run `npm install` (first time, or after `package.json` changes), then
  `npm run verify` — this builds `site/en/` (`scripts/build-en.mjs`) before
  checking it.
- Check the product and privacy pages, in both Korean and English
  (`/en/`, `/en/privacy/`), at desktop and mobile widths.
- Check keyboard focus, internal links, the mail link, and print layout for the
  privacy policy.
- If you change `site/index.html` or `site/privacy/index.html`'s structure,
  re-check `scripts/build-en.mjs`'s assumptions (asset-path rebasing,
  `.lang-toggle` replacement) still hold — it's a lightweight HTML transform,
  not a templating engine.
- Record any unverified behavior in the PR.

## Content invariants

- Do not claim that Drive, Notion, LLM, accounts, analytics, payment, or cloud
  sync exists before the matching extension version is released.
- Keep `/privacy/` stable because Chrome Web Store will reference it.
- Update the effective date and policy version when data practices change.
- Keep the product page, in-product disclosure, Web Store privacy declarations,
  and actual extension behavior consistent.
- Do not add secrets, OAuth client secrets, customer documents, or identifiable
  source material.
- Original repository content is proprietary; third-party components retain
  their respective licenses.

## Deployment

`main` deploys `site/` through `.github/workflows/deploy-pages.yml`. Do not merge
or enable GitHub Pages until the user approves the reviewed site.
