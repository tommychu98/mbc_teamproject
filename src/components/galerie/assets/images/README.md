# Galerie images

- `shared/`: images and icons used by both desktop and mobile layouts.
- `web/`: desktop-only exports, replaced by mobile assets at 767px and below.
- `mobile/`: mobile-only exports, selected with `<picture>` or shown only on mobile.

Keep original Figma asset files intact. Shared images belong in `shared/` even when their crop or size changes between layouts.
