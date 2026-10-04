import useStoryInkDrawing from './useStoryInkDrawing';

// Doorway and vine; vanilla stem and flower; bowl and book detail.
const options = {
  namespace: 'fragrances-con5',
  mediaQuery: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  focalPoints: [
    [[52, 52], [40, 30], [32, 65], [55, 77]],
    [[55, 70], [50, 49], [42, 35], [65, 48]],
    [[54, 62], [48, 75], [70, 48], [32, 75]],
  ],
};

export default function useCon5InkDrawing(sectionRef) {
  useStoryInkDrawing(sectionRef, options);
}
