# Fragrances Story Hero

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2778-2093
- Reference artboard: 1920 × 1080. `heroLayers.js` preserves back-to-front order, bounding boxes, rotations, reflections and source-image crops.
- `assets/` contains 18 original Figma PNGs. The ink image supplies both ink bottles, giving 19 rendered layers including the background. No temporary Figma URLs are used at runtime.
- Assets are colocated here to honor the requested component-only scope; Vite resolves their production URLs. This is a deliberate exception to the build guide's general `public/images` convention.
- The scene scales proportionally with viewport width. No separate mobile composition or animation is introduced.
- App already renders Navigation. Page-scoped `:has(.fragrances-story)` selectors remove its background and the main top padding only while this page is mounted; mobile menus and desktop dropdowns retain their existing surfaces.
- Existing shared fonts, navigation geometry and footer remain owned by their common components.

## Con1

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2934-9877
- `Con1.jsx` and `Con1.css` append a static 1920 × 2050 composition immediately after Hero. Hero markup, styles and layer data are unchanged.
- `con1-cloud.png`, `con1-pillar.png`, `con1-butterfly.png`, and `con1-couple.png` are Figma exports. Cloud/pillar 10% and butterfly 20% alpha are baked into the files, so CSS must not apply that opacity again.
- All artwork, title lines, chapter, subtitle and body paragraphs have separate `fragrances-con1__*` selectors. DOM order follows Figma's layer order; the couple is clipped to its 918 × 1309 frame, with a 918 × 1551 image inside.
- Typography uses existing design tokens. The installed KoPubWorld Dotum Pro Medium font is bundled as `con1-kopub-dotum-medium.otf` under a Con1-only font family because the shared stylesheet names KoPub without loading it. Other components retain their existing font resolution.
- The supplied desktop composition scales proportionally at smaller widths without rearranging objects; this also reduces text size on mobile. A separate readable mobile layout requires a mobile design. Overflow is clipped at the section boundary.
- No GSAP, animation, commit or push is part of this Con1 change.

## Con2

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2778-1770
- `Con2.jsx` / `Con2.css` append the 1920 × 1080 section after Con1. `MythCard.jsx` renders the three entries from `con2Data.js`, using separate crops of the original `con2-card-artwork.png`.
- Original assets: `con2-background.png` (rotated 180 degrees), `con2-card-artwork.png`, and `con2-cloth.png`. Assets stay in this component directory, following the existing page asset convention. Existing typography tokens and the already bundled KoPub Medium font are reused.
- Heading: (669, 228), 582 × 52. Cards: (230, 325), 340px per card with 220px gaps. All dimensions scale with the same viewport ratio as Con1.
- `.fragrances-con2__content` clips the background and cards. The sibling `.fragrances-con2__cloth` keeps vertical overflow visible and starts at (336, -526), with the original inner offset, rotation and reflection. Section-level horizontal clipping prevents sideways overflow without cutting off the overlap with Con1.
- The cloth has its own `clothRef` and separate placement/image classes for future animation. No animation is currently attached. Hero and Con1 code/styles are unchanged; only the Con2 import and render were added to the page.
- Verified at 1920px: section starts at page y=3130, size 1920 × 1080; original image crops and the seam with Con1 render correctly. Also checked proportional layout at 1440px, 768px and 390px, image loading and browser errors. Build and ESLint pass.
