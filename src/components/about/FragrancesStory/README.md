# Fragrances Story Hero

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2778-2093
- Reference artboard: 1920 × 1080. `heroLayers.js` preserves back-to-front order, bounding boxes, rotations, reflections and source-image crops.
- `assets/` contains 18 original Figma PNGs. The ink image supplies both ink bottles, giving 19 rendered layers including the background. No temporary Figma URLs are used at runtime.
- Assets are colocated here to honor the requested component-only scope; Vite resolves their production URLs. This is a deliberate exception to the build guide's general `public/images` convention.
- The scene scales proportionally with viewport width. No separate mobile composition or animation is introduced.
- App already renders Navigation. Page-scoped `:has(.fragrances-story)` selectors remove its background and the main top padding only while this page is mounted; mobile menus and desktop dropdowns retain their existing surfaces.
- Existing shared fonts, navigation geometry and footer remain owned by their common components.
