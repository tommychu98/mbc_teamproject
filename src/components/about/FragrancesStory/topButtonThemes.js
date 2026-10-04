// Explicit themes for the background under this page's floating control.
// Note scenes have light walls and a separate dark wooden table surface.
export const topButtonThemes = [
  { selector: '.fragrances-story__scene', theme: 'dark' },
  { selector: '.fragrances-con1, .fragrances-con2, .fragrances-con4, .fragrances-con5, .fragrances-con7, .fragrances-con8', theme: 'light' },
  { selector: '.fragrances-con3', theme: 'light', darkSurface: '.fragrances-con3__table' },
  { selector: '.fragrances-con6', theme: 'light', darkSurface: '.fragrances-con6__table' },
  { selector: '.fragrances-con9', theme: 'light', darkSurface: '.fragrances-con9__table' },
  { selector: '.fragrances-con10, .fragrances-con11, .fragrances-con12, .fragrances-con13, .fragrances-footer', theme: 'dark' },
];

// Light handwritten sheet in the stationery asset, excluding the dark bowl,
// photograph and transparent corners. Coordinates are relative to that object,
// so they follow its existing matrix and the horizontal track without scroll px.
export const topButtonPaperSurfaces = [{
  selector: '[class$="__layer--stationery"] > [class$="__object"]',
  polygon: [[.035, .9], [.145, .565], [.57, .675], [.485, .995]],
}];
