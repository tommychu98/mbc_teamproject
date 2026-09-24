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
