import { useLayoutEffect } from 'react';
import { createDampedValue, MOTION_RESPONSE } from '../../../utils/scrollMotion';

const clamp = (value) => Math.max(0, Math.min(1, value));
const ease = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export default function useScentLighting(scrollRef, sceneRef) {
  useLayoutEffect(() => {
    const shell = scrollRef.current;
    const scene = sceneRef.current;
    const candle = scene.querySelector('.history-scent__candle-object');
    const transition = shell.closest('.diptyque-history__scent-transition');
    const previousSection = shell.previousElementSibling;
    let frame = 0;
    let geometry;
    const motion = createDampedValue({ response: MOTION_RESPONSE.background, maxLag: 0.05 });
    const typography = createDampedValue({ response: MOTION_RESPONSE.foreground });

    const render = now => {
      frame = 0;
      if (!geometry) return;
      const { height, introLength, pan, flameX, flameY, maxOffset } = geometry;
      const top = shell.getBoundingClientRect().top;
      const target = Math.max(0, -top) / introLength;
      const travel = motion.update(target, now, false) * introLength;
      const progress = clamp(travel / introLength);
      const textProgress = typography.update(clamp(target), now, false);
      const offset = travel <= introLength
        ? pan * ease(0.48, 0.94, progress)
        : pan + travel - introLength;
      const sceneOffset = Math.min(offset, maxOffset);
      scene.style.transform = `translate3d(0, ${-sceneOffset}px, 0)`;
      shell.style.setProperty('--scene-offset', `${sceneOffset}px`);
      // Hold the final Collect/Transform frame while Scent fades over it.
      shell.dataset.entered = top <= 0 ? 'true' : 'false';
      shell.style.setProperty('--entry-opacity', ease(0, 0.13, progress).toFixed(4));
      const titleReveal = ease(0.14, 0.3, textProgress);
      shell.style.setProperty('--title-opacity', titleReveal.toFixed(4));
      shell.style.setProperty('--title-blur', `${((1 - titleReveal) * 2).toFixed(3)}px`);
      // Typography stays optically neutral; candle warmth belongs to the scene only.
      shell.style.setProperty('--title-bloom', '0');
      shell.style.setProperty('--intro-copy-opacity', ease(0.29, 0.44, textProgress).toFixed(4));
      shell.style.setProperty('--story-copy-opacity', ease(0.48, 0.6, textProgress).toFixed(4));

      // The light starts below the frame, then follows the actual candle wick.
      const lightY = Math.min(flameY - offset, height * 1.15);
      const spread = ease(0.15, 0.67, progress);
      // Keep the revealed artwork at its native colour while the warm candle
      // cast drains slowly. The former 0.93–1 window caused a visible colour snap.
      const warmRelease = 1 - ease(0.56, 0.9, progress);
      shell.style.setProperty('--light-x', `${flameX}px`);
      shell.style.setProperty('--light-y', `${lightY}px`);
      shell.style.setProperty('--light-size', `${height * (0.16 + spread * 1.55)}px`);
      shell.style.setProperty('--shade-center', (1 - ease(0.19, 0.66, progress)).toFixed(4));
      shell.style.setProperty('--shade-edge', (1 - ease(0.3, 0.94, progress) * 0.96).toFixed(4));
      shell.style.setProperty('--light-strength', (ease(0.13, 0.4, progress) * 0.32 * warmRelease).toFixed(4));
      shell.style.setProperty('--haze-strength', (ease(0.23, 0.5, progress) * 0.075 * warmRelease).toFixed(4));
      shell.style.setProperty('--vignette-strength', (0.32 * (1 - ease(0.72, 0.98, progress))).toFixed(4));
      shell.style.setProperty('--effect-opacity', '1');
      shell.style.setProperty('--flame-opacity', ease(0.35, 0.58, progress).toFixed(4));
      shell.dataset.lightingActive = top < height && top > -introLength ? 'true' : 'false';
      if (motion.moving || typography.moving) frame = requestAnimationFrame(render);
    };

    const measure = () => {
      shell.classList.add('history-scent-scroll--cinematic');
      const height = window.innerHeight;
      transition?.style.setProperty('--collect-pin-top', `${height - previousSection.offsetHeight}px`);
      // Match the CSS flame base to the wick within the transparent PNG.
      const flame = candle.querySelector('.history-scent__flame');
      const flameY = candle.offsetTop + flame.offsetTop + flame.offsetHeight;
      const flameX = candle.offsetLeft + flame.offsetLeft;
      const pan = Math.max(0, Math.min(flameY - height * 0.68, scene.offsetHeight - height));
      const introLength = height * 3.6;
      geometry = { height, introLength, pan, flameX, flameY, maxOffset: scene.offsetHeight - height };
      shell.style.height = `${scene.offsetHeight + introLength - pan}px`;
      shell.style.marginTop = `${-height}px`;
      schedule();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(scene);
    if (previousSection) resizeObserver.observe(previousSection);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);

      transition?.style.removeProperty('--collect-pin-top');
    };
  }, [scrollRef, sceneRef]);
}
