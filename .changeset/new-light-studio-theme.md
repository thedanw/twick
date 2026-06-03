---
'@twick/studio': minor
---

feat(theme): add New Light Studio theme as opt-in CSS override layer

Added `themes/new-light-studio.css` — a non-breaking, standalone CSS
override file that aligns Twick's default purple theme with the New Light
Studio design system (#FF7300 orange accent, Inter Display headings,
sharp 2px corners, solid surfaces, no ALL-CAPS, tactile buttons).

Load after studio.css for immediate effect:
  import '@twick/studio/dist/themes/new-light-studio.css';

Zero merge friction with upstream — no source CSS modified.
