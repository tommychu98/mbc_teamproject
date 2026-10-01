# Galerie images

- `shared/`: images and icons used by both desktop and mobile layouts.
- `web/`: desktop-only exports, replaced by mobile assets at 767px and below.
- `mobile/`: mobile-only exports, selected with `<picture>` or shown only on mobile.
- `hero-petals/`: the 11 original botanical PNGs from Figma hero node `1916:1604`,
  used on desktop and mobile by `GalerieHeroPetals`. Their initial placement and
  10% opacity follow the design; GSAP animates only their wrapper elements.

Keep original Figma asset files intact. Shared images belong in `shared/` even when their crop or size changes between layouts.
