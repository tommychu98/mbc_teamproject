import useStoryInkDrawing from './useStoryInkDrawing';

const focalPoints = [
  [[45, 35], [30, 48], [65, 54], [48, 72]],
  [[50, 78], [45, 55], [56, 30], [28, 42]],
  [[48, 40], [57, 22], [42, 58], [50, 76]],
];
const options = { namespace: 'fragrances-con2', focalPoints };

export default function useCon2InkDrawing(sectionRef) {
  useStoryInkDrawing(sectionRef, options);
}
