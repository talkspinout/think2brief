# Chrome Web Store screenshots (English)

`screenshot-1-start-en.png` … `screenshot-4-finish-en.png` (1280×800) are the
English Chrome Web Store listing screenshots, matching the existing Korean
listing images 1:1 in structure (dark card, `STEP N` label, headline, three
checkmarks, footer tagline, and a real product screenshot on the right).

These are not decorative mockups: the screenshot inside each card is the
actual built extension (`campaign-strategy-os-extension`, `npm run build`,
language switched to English), not hand-edited text. Steps 2–4 all use the
built-in "F&B Brand Social Channel Refresh" example
(`contentPlan` template) so the story stays consistent panel to panel.

## Regenerating

1. Build the extension in `campaign-strategy-os-extension` (`npm run build`)
   so `dist/index.html` exists.
2. Load it in a headless browser, switch the language toggle to English,
   and capture:
   - Step 1: default library screen (Strategic Brief selected)
   - Step 2: the F&B example's work board
   - Step 3: the F&B example's logic review
   - Step 4: the F&B example's final brief
3. Composite each capture into the dark STEP-card layout (see the git
   history of this folder for the template/script used — it wasn't
   committed here to avoid bundling a duplicate copy of the Pretendard font
   and a cross-repo build dependency into this repository).

**Gotcha 1**: size the browser-mockup frame to the screenshot's own scaled
height (`width: 100%; height: auto` on the image, frame sized by content) —
don't force a fixed frame height. Each step's source screenshot has a
different aspect ratio, so a fixed height either crops the image or leaves
dead white space below it depending on the step.

**Gotcha 2**: capture *enough* content, not just whatever the first
convenient crop point is. The frame is 760px wide inside the 1280×800 card,
so the tallest a screenshot can be before the frame overflows the canvas is
about 720px — meaning capture the app at roughly 1280×1200 (not, say,
1280×650) so the scaled-down frame actually fills most of the card instead
of floating small and empty in the middle. Pick the clip height by looking
at the full page first and cutting at a clean section/card boundary near
that ~1200px mark, not an arbitrary round number.

Update these whenever the extension's English copy or the example content
changes enough that the screenshots would look stale next to the real
product.
