import { useLayoutEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStoryInkDrawing from './useStoryInkDrawing';

const focalPoints = [
  [[45, 35], [30, 48], [65, 54], [48, 72]],
  [[50, 78], [45, 55], [56, 30], [28, 42]],
  [[48, 40], [57, 22], [42, 58], [50, 76]],
];
const options = { namespace: 'fragrances-con2', focalPoints, desktopPin: true };

export default function useCon2InkDrawing(sectionRef) {
  useStoryInkDrawing(sectionRef, options);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const parent = section.parentElement;
    let spacer;
    let frame;
    const correctSpacer = () => {
      const candidate = section.parentElement;
      if (!candidate.classList.contains('pin-spacer')) return;
      spacer = candidate;
      // The fixed pin has a rounded height too. Measure only its natural height
      // before pinning or after release.
      if (getComputedStyle(section).position === 'fixed') return;
      const reservedHeight = parseFloat(spacer.style.height) - parseFloat(spacer.style.paddingBottom || '0');
      const remainder = reservedHeight - section.getBoundingClientRect().height;
      if (Number.isFinite(remainder) && Math.abs(remainder) < 1) {
        spacer.style.setProperty('--con2-spacer-correction', `${-remainder}px`);
      }
    };
    const scheduleCorrection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(correctSpacer);
    };
    // Keep layout writes out of ResizeObserver delivery and pin refreshes.
    const resize = new ResizeObserver(scheduleCorrection);
    resize.observe(section);
    const insertion = new MutationObserver(scheduleCorrection);
    insertion.observe(parent, { childList: true });
    ScrollTrigger.addEventListener('refresh', scheduleCorrection);
    correctSpacer();
    return () => {
      resize.disconnect();
      insertion.disconnect();
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener('refresh', scheduleCorrection);
      spacer?.style.removeProperty('--con2-spacer-correction');
    };
  }, [sectionRef]);
}
