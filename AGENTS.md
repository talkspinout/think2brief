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

- Run `npm run verify`.
- Check the product and privacy pages at desktop and mobile widths.
- Check keyboard focus, internal links, the mail link, and print layout for the
  privacy policy.
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
