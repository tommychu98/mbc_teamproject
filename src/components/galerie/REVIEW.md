# Galerie review — 2026-10-04

## Repository and scope

- Origin: https://github.com/tommychu98/mbc_teamproject.git
- Branch: feature/galerie, created from the existing fix-main checkout with all
  tracked and untracked changes preserved. No pull was performed on the dirty tree.
- Only src/components/galerie source and documentation were changed.
- Existing route: /galerie. Exports, props, target IDs and event behavior retained.
- No git add, commit or push was performed.

## Review and fixes

All 142 existing files were read, including code, styles, documentation, SVGs,
PNGs, fonts and the font license. This report is the only additional review file.
Local imports and asset URLs resolve. All 84 PNGs decompress and 25 SVGs parse.
The five font files have valid container signatures. Installed direct dependency
versions match package-lock.json; npm ci was unnecessary.

The existing mobile work is preserved: hero flowers, local fonts, four short
subhero holds, arrow feedback/navigation, four ingredient arrival sequences,
favorites and Another card navigation. Cursor trail experiments remain removed.

Additional review fixes:

- Stop importing GalerieNavigation.css so Galerie does not override shared
  header/layout styles. Keep the optional stylesheet for team-lead integration.
- Give Another click feedback its own animation guard; CSS press transitions
  must not suppress navigation. Cancel feedback on unmount.
- Cancel subhero button feedback on unmount and release completed animation refs.
- Apply the local sans font on .galerie-page rather than inheriting the shared
  body's already-resolved font family.
- Correct outdated current footer/header integration notes in FOOTER.md.

## Validation

- npm run build: passed. Existing whole-app chunk size warning remains.
- ESLint for src/components/galerie: passed.
- Final tracked diff whitespace check: passed; LF/CRLF notices are Git conversion
  notices rather than whitespace failures. New text files were checked separately.
- Headless Chrome at 320, 390, 430, 768 and 1440 CSS pixels:
  - Twelve favorites select and clear at every width.
  - Four mobile arrows move/focus the correct content at viewport top.
  - Another moves to its chapter; CDP touch input also confirms tap navigation.
  - All four mobile ingredient groups become visible after arrival.
  - TOP returns scrollY to zero.
  - All 92 images inside Galerie load successfully.
  - No document horizontal overflow or browser JavaScript exceptions observed.
  - Reduced motion removes sticky holds and leaves ingredients visible.
- A 430px/3x-density Rose content screenshot was visually inspected.

## Run and remaining limitations

Development server: http://127.0.0.1:5173/galerie

Restart with npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort on
PowerShell (npm.ps1 is restricted by the local execution policy).
Check flowers, four arrows and holds, arrival timing, favorites, horizontal
product/card scrolling, chapter navigation and TOP. Galerie has no filter UI.

Real phones, iOS/Safari, Firefox, production network/performance and exact Figma
matching were not verified. Rose's source remains 575x766; direct PNG rendering
does not create additional source detail. No absolute sharpness guarantee is made.
Footer store/policy/chat labels without routes retain their existing text behavior.
Route and shared header/footer integration remain the team lead's responsibility.

Unrelated pre-existing changes remain in Navigation.css, Navigation.jsx,
Navigation/assets/mobile-logo.png, mobile-menu.svg, mobile-search.svg and
public/models/orpheon-custom.glb. They must be reviewed/staged separately by
their owner; they were not changed during this review.

## Submission review — 2026-10-05

This section records the current review; the sections above describe earlier work.

- Project root: mbc_teamproject_1. Origin matches the requested team repository.
  Current branch remains feature/galerie. The tree was dirty, so no checkout,
  pull, reset, add, commit or push was performed.
- Read all 143 files under Galerie, including all nested assets and documentation.
  Inspected the sole initial Galerie diff, useDecorationPop.js; no Galerie
  additions, deletions, renames or staged changes were present.
- All 84 PNGs decompress, all 25 SVGs parse as XML, and all five font files have
  valid container signatures. All 166 local import/asset references resolve.
  Installed direct dependency versions match package-lock.json; npm ci is unnecessary.
- Ingredient motion now unfolds like paper on desktop and mobile. Desktop uses
  each ingredient's fixed wrapper as the scroll trigger. Mobile unfolds visible
  ingredients at 0.35-second intervals with an earlier scene arrival, and reverses
  on departure. Hidden responsive ingredients no longer consume sequence slots.
  No upward fly-away exit remains. CSS, assets, exports, props and event names
  were preserved; reduced motion leaves the original artwork visible.
- Changes in this review are limited to useDecorationPop.js and this report.
  Existing changes outside Galerie are preserved: HomeIntro.css, HomeIntro.jsx,
  createFrameSequence.js, createVideoScrubber.js, Navigation.css, Navigation.jsx,
  Navigation/assets/mobile-logo.png, mobile-menu.svg, mobile-search.svg, and
  public/models/orpheon-custom.glb.
- Galerie ESLint and npm run build pass. The existing whole-app JavaScript chunk
  size warning remains; package configuration and shared code were not modified.
- Headless Chrome at 320, 390, 430, 768 and 1440 CSS pixels: all 12 favorites
  select/clear; four mobile introduction arrows focus and scroll to the correct
  content; Another navigates to its chapter; TOP returns to zero; ingredient
  groups unfold and reverse; all 102 Galerie page/footer images decode; no
  document horizontal overflow or browser JavaScript exceptions were observed.
  Reduced-motion artwork remains visible. A 430px Rose screenshot was inspected.
- After the hidden-ingredient fix, targeted checks at 390px confirm sequential
  mobile entry, complete reverse and replay, unchanged wrapper positions/sizes,
  CDP touch selection of a favorite, and scrolling all five horizontal regions.
  At 1440px all four Rose ingredients independently reach closed, intermediate,
  open and closed states as their wrappers cross the scroll range. Reduced motion
  removes ingredient transforms. Final 390px/1440px screenshots were inspected.
  Final diff and whitespace checks pass. Hash comparison confirms all ten
  pre-existing files outside Galerie remain unchanged by this review.
- Development server: http://127.0.0.1:5173/galerie. Restart with
  `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort` in PowerShell.
  Check paper unfolding and reverse scrolling, mobile arrival timing, four
  introduction arrows, favorite buttons, horizontal product/card scrolling,
  chapter navigation and TOP. There is no Galerie filter UI.
- Real phones, iOS/Safari, Firefox, authenticated inquiry submission and exact
  design-reference matching remain unverified. Footer policy/store/chat labels
  retain their existing text behavior. Its displayed ISMS validity ends on
  2026-09-15; replacement certification/company content needs team confirmation.
  GalerieNavigation.css remains an unimported optional shared-header theme;
  future header/footer or route integration belongs to the team lead.
