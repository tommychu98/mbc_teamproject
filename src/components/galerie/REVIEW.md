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
