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

Flowers sway when the footer enters the viewport. Motion pauses outside the
viewport or in a hidden browser tab. Reduced-motion users receive a still image.
GSAP, observers and listeners are disposed on unmount. Animation targets are
scoped to each footer instance.

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
Galerie CSS must not hide the shared footer or restyle the shared header.

Browser checks at 320, 390, 768 and 1440px found horizontal overflow in the shared
header/footer. Temporarily excluding those elements in the browser removed the
overflow at every tested width; no shared source files were changed. The team lead
should check the width and box-sizing of `.header__inner` and `.footer__inner`.
