import useStoryInkDrawing from './useStoryInkDrawing';

// Club doorway and cello; juniper stem and foliage; glass and tabletop detail.
const options = {
  namespace: 'fragrances-con8',
  mediaQuery: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  focalPoints: [
    [[48, 45], [66, 58], [37, 72], [43, 24]],
    [[47, 72], [43, 49], [51, 28], [70, 63]],
    [[42, 46], [45, 65], [70, 73], [67, 28]],
  ],
};

export default function useCon8InkDrawing(sectionRef) {
  useStoryInkDrawing(sectionRef, options);
}
