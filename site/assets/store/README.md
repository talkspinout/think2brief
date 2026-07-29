# Chrome Web Store screenshots

The Korean files (`*-ko.png`) and English files (`*-en.png`) are the
Chrome Web Store listing screenshots for v1.2.2. All eight files are
1280×800 and match 1:1 in structure: dark card, `STEP N` label, headline,
three checkmarks, footer tagline, and a real product screenshot on the right.

These are not decorative mockups: the screenshot inside each card is the
actual built v1.2.2 extension, not hand-edited UI text. Steps 2–4 use the
built-in F&B brand social-channel example in each language so the story
stays consistent panel to panel. The captures include the optional Google
Drive controls added in this release.

## Regenerating

1. Build the extension in `campaign-strategy-os-extension` (`npm run build`)
   so `dist/index.html` exists.
2. Load it in a browser, capture the same four states in Korean and English:
   - Step 1: default library screen (Strategic Brief selected)
   - Step 2: the F&B example's work board
   - Step 3: the F&B example's logic review
   - Step 4: the F&B example's final brief
3. Composite each capture into the dark STEP-card layout (see the git
   history of this folder for the template/script used — it wasn't
   committed here to avoid bundling a duplicate copy of the Pretendard font
   and a cross-repo build dependency into this repository).

The browser frame uses a top-aligned cover crop so the Store card is filled
without stretching the application UI. Keep the right-side Drive status and
action visible in the start and board images.

Update both language sets whenever the extension copy, navigation, storage
controls, or example content changes enough that the images would look stale.
