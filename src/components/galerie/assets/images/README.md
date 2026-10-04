# Galerie images

- `shared/`: images and icons used by both desktop and mobile layouts.
- `web/`: desktop-only exports, replaced by mobile assets at 767px and below.
- `mobile/`: mobile-only exports, selected with `<picture>` or shown only on mobile.
- `hero-petals/`: the 11 original botanical PNGs from Figma hero node `1916:1604`,
  used on desktop and mobile by `GalerieHeroPetals`. Their initial placement and
  10% opacity follow the design; GSAP animates only their wrapper elements.

Keep original Figma asset files intact. Shared images belong in `shared/` even when their crop or size changes between layouts.

The four `mobile/*-bottle.png` files are lossless extractions of the photos
embedded in the original mobile bottle SVGs. `GalerieBottle` displays these
photos directly, preserving the SVG crop in CSS so mobile browsers
do not rasterize a filtered SVG pattern at its export dimensions. Rose's source
is 575 × 766; the other three sources are 963 × 1284. These are original source
pixels, not upscaled replacements.

Mobile bottle photos have no compositing filter on their parent. Chapter 1
limits its bottle frame to 284 CSS pixels so the enlarged crop fits within the
963px source at device pixel ratio 3; enlarging this frame needs a better source.
