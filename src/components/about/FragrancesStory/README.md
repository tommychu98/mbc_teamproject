# Fragrances Story Hero

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2778-2093
- Reference artboard: 1920 × 1080. `heroLayers.js` preserves back-to-front order, bounding boxes, rotations, reflections and source-image crops.
- `assets/` contains 18 original Figma PNGs. The ink image supplies both ink bottles, giving 19 rendered layers including the background. No temporary Figma URLs are used at runtime.
- Assets are colocated here to honor the requested component-only scope; Vite resolves their production URLs. This is a deliberate exception to the build guide's general `public/images` convention.
- Desktop retains its proportional 1920px artboard. Below 768px, `mobile.css` defines an independent composition from the 430px mobile Figma frames.
- App already renders Navigation. Page-scoped `:has(.fragrances-story)` selectors remove its background and the main top padding only while this page is mounted; mobile menus and desktop dropdowns retain their existing surfaces.
- Existing shared fonts, navigation geometry and footer remain owned by their common components.

## Con1

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2934-9877
- `Con1.jsx` and `Con1.css` append a static 1920 × 2050 composition immediately after Hero. Hero markup, styles and layer data are unchanged.
- `con1-cloud.png`, `con1-pillar.png`, `con1-butterfly.png`, and `con1-couple.png` are Figma exports. Cloud/pillar 10% and butterfly 20% alpha are baked into the files, so CSS must not apply that opacity again.
- All artwork, title lines, chapter, subtitle and body paragraphs have separate `fragrances-con1__*` selectors. DOM order follows Figma's layer order; the couple is clipped to its 918 × 1309 frame, with a 918 × 1551 image inside.
- Typography uses existing design tokens. The installed KoPubWorld Dotum Pro Medium font is bundled as `con1-kopub-dotum-medium.otf` under a Con1-only font family because the shared stylesheet names KoPub without loading it. Other components retain their existing font resolution.
- The desktop composition scales proportionally above the mobile breakpoint. Mobile uses its own Figma coordinates and readable 14px body copy. Overflow is clipped at the section boundary.
- Con1 decorative motion references Figma node `3869:11426`: clouds sway, gently expand and drift over 17–20 seconds; butterflies follow a floating loop and tilt over 10–12 seconds using CSS transforms. Staggered phases and broader movement make the motion visible while keeping it gentle. An IntersectionObserver pauses motion outside the viewport; `prefers-reduced-motion` disables it. The left butterfly's original rotation/reflection stays on its inner image. Mobile uses the same proportional motion on its existing visible artwork.

## Con2

- Source: https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=2778-1770
- `Con2.jsx` / `Con2.css` append the 1920 × 1080 section after Con1. `MythCard.jsx` renders the three entries from `con2Data.js`, using separate crops of the original `con2-card-artwork.png`.
- Original assets: `con2-background.png` (rotated 180 degrees) and `con2-card-artwork.png`. Assets stay in this component directory, following the existing page asset convention. Existing typography tokens and the already bundled KoPub Medium font are reused.
- Heading: (669, 228), 582 × 52. Cards: (230, 325), 340px per card with 220px gaps. All dimensions scale with the same viewport ratio as Con1.
- `.fragrances-con2__content` clips the background and cards. Section-level horizontal clipping prevents sideways overflow.
- The decorative cloth formerly overlapping the end of Con1 has been removed. Con1/Con2 layout, card geometry, and Con2's pin interaction remain unchanged.
- Verified at 1920px: section starts at page y=3130, size 1920 × 1080; original image crops and the seam with Con1 render correctly. Also checked proportional layout at 1440px, 768px and 390px, image loading and browser errors. Build and ESLint pass.


## Mobile sequence (3750:13691)

The supplied node 3750:13866 is Con1. The surrounding frames in the same
Stories_Mobile parent define the complete sequence, confirmed with the user.
Each reference screen is 430 × 935; the footer is approximately 430 × 451.
`mobile.css` owns mobile geometry and typography independently of desktop rules.
Narrow phones retain the vertical reading slots while artwork widths adapt.
Scene selectors use stable class tokens: the visibility modifier added by
IntersectionObserver must never remove mobile dimensions or coordinate variables.

| Scene | Mobile Figma node | Interaction adaptation |
| --- | --- | --- |
| Hero | 3750:13725 | Mobile-visible objects only; smaller entrance/depth displacement |
| Con1 | 3750:13866 | Existing responsive typography and decorative motion |
| Con2 | 3750:13747 | Ink/tone/color reveal; native swipe rail with pagination |
| Con3 | 3750:13947 | Ingredient tap + note depth; separate bottle rises 32px at 430px |
| Con4 | 3750:13843 | Existing responsive typography and decorative motion |
| Con5 | 3750:13773 | Ink/tone/color reveal; native swipe rail with pagination |
| Con6 | 3750:13787 | Ingredient tap + note depth; separate bottle and mobile crop |
| Con7 | 3750:13890 | Existing typography and continuous musicians/chandelier artwork |
| Con8 | 3750:13759 | Ink/tone/color reveal; native swipe rail with pagination |
| Con9 | 3750:13815 | Ingredient tap + note depth; separate bottle and mobile crop |
| Con10 | 3750:13692 | Smaller entrance/depth displacement; original final composition |
| Con11 | 3750:13699 | Existing mobile book and live lettering |
| Con12 | 3750:13710 | Existing mobile hands/book composition |
| Con13 | 3750:13717 | Existing short falling timing, visible 28px mobile fall |
| Footer | 3750:13909 | Existing mobile footer |

Con3/6/9 ingredient and bottle source pixels match the mobile Figma assets
exactly, so the original local assets are reused instead of adding duplicates.
The obsolete mobile composites are no longer selected by these scenes.
Ingredient focus affects botanical pixels only; the bottle is a separate layer.
Mobile compositing uses up to 2× rendered resolution and retains the original alpha.
Tap chooses an ingredient, another tap moves selection, and tapping outside or
leaving the scene restores the original state. Desktop keeps mouse hover.
Con3 mobile note emphasis stays steady; the desktop sweep is not changed.

Hero, bottle entrances, Con10 and Con13 use GSAP matchMedia with the existing
768px breakpoint and reduced-motion condition. Revert removes old transforms
when crossing the breakpoint. Ink canvas preparation ignores outdated async
resize jobs. TOP remains a single fixed control with WH/BK switching based on
its actual overlapping background; mobile geometry follows (369,739), 40 × 43.
The shared navigation is reused with page-scoped mobile styling for the Figma
52px ivory menu bar; other pages and shared navigation files are unchanged.
