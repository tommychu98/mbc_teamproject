# Reusing the footer

```jsx
import GalerieFooter from './components/galerie/GalerieFooter';

<GalerieFooter />
// Optional: disable ambient motion
<GalerieFooter animateFlowers={false} className="my-footer" id="footer" />
```

Render once, preferably after the page's `main`, inside the existing React Router.
The component imports its CSS, local images and animation hook. It uses global
typography tokens and existing customer-service routes. Replace the existing
layout footer at the callsite when using it on other pages. The component itself
does not hide or modify another page's footer.

Desktop flowers sway when the footer enters the viewport. Motion pauses outside the
viewport or in a hidden browser tab. Reduced-motion users receive a still image.
GSAP, observers and listeners are disposed on unmount. Animation targets are
scoped to each footer instance.

At 767px and below, the same component shows the compact mobile layout and the
original static D/Q images. Hidden desktop flower layers do not animate on mobile.
The mobile inquiry link uses the existing protected `/inquiries` route; signing
in is handled by the application's existing route guard.

## Generated layers

Original letter-d.png and letter-q.png are retained. The built-in image tool
generated these layers; fine details can differ from the flattened originals:

- assets/footer/letter-d-layers.png: two square cells (letter, flowers).
- assets/footer/letter-q-base.png: reconstructed Q without flowers.
- assets/footer/letter-q-flowers.png: transparent botanical layer.

Final prompt specifications:

- D: Separate the reference into two equal square cells on a transparent 2:1
  sprite sheet: clean ivory letter with hidden strokes restored, then original
  flowers/leaves/stems/berries alone. Preserve coordinates, scale, framing,
  ivory coloring and fine black engraved outlines; no labels or background.
- Q flowers: Remove only Q, retain all botanical decorations at original
  coordinates and scale, square transparent PNG, no checkerboard or lettering.
- Q base: Remove all botanicals, reconstruct hidden ivory Q strokes, preserve
  original letter shape, coordinates, framing and square dimensions; genuine
  transparent alpha background, no flowers or checkerboard.

Policy/store/chat labels without implemented destinations remain plain text.

## Team integration follow-up

`GalerieContent` currently renders this footer, while `App.jsx` also renders the
shared layout footer on `/galerie`. Both are visible. The team lead should decide
which footer the route uses and update the layout integration outside this folder.
Galerie CSS does not hide the shared footer. The requested hero navigation theme
is in `GalerieNavigation.css`, gated by `.app:has(.galerie-page)` and hero visibility;
it reuses the shared header's existing interactions without modifying its source.

The latest Edge checks at 320, 430, 768 and 1440px confirmed horizontal overflow
from the shared footer. Temporarily hiding only `.app > .footer` in the browser
removed the overflow at every tested width; no shared source files were changed.
The team lead should review `.footer__inner` width/padding/box-sizing and decide
which footer is rendered on `/galerie`. Mobile viewport widths were inflated by
32px while the shared footer remained visible, affecting the hero/menu alignment.

## Submission checks

- Existing `/galerie` route and exports/props are retained; no route wiring changed.
- `node node_modules/eslint/bin/eslint.js src/components/galerie`: passed.
- `npm run build`: passed, with the whole-app JavaScript chunk-size warning.
- `npm run dev -- --host 127.0.0.1 --port 5173`: `/galerie` available.
- Edge: desktop hero scroll, all four favorite toggles, mobile menu opening,
  chapter navigation/focus, TOP, and cancellation of navigation after a simulated
  mobile card drag passed. All 87 Galerie DOM images decoded successfully.
- Source assets: 69 PNG files decoded and 24 SVG files parsed successfully.
- Native phone touch gestures, iOS/Safari, authenticated inquiry submission, and
  the visual quality of WebGL paper curl were not verified in this audit.
- Footer policy/store labels remain text because no matching route exists.
