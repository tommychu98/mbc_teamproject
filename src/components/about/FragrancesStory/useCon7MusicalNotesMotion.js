import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';

// Distances are relative to the 1920px composition, not the viewport height.
const notePaths = [
  { name: 'first', period: 26, phase: 0.4, curve: -0.7, x: 62, y: 30, offsetX: 0, rotation: 1.4 },
  { name: 'second', period: 31, phase: 2.3, curve: 0.4, x: 38, y: 58, offsetX: 0, rotation: 1.8 },
  { name: 'third', period: 38, phase: 4.8, curve: 1, x: 60, y: 40, offsetX: -35, rotation: 1.2 },
];

export default function useCon7MusicalNotesMotion(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const notes = notePaths.map(path => {
        const element = scene.querySelector(`.fragrances-con7__musical-note--${path.name}`);
        return {
          ...path,
          element,
          setX: gsap.quickSetter(element, 'x', 'px'),
          setY: gsap.quickSetter(element, 'y', 'px'),
          setRotation: gsap.quickSetter(element, 'rotation', 'deg'),
        };
      });
      let scale = scene.clientWidth / 1920;
      let elapsed = 0;
      let previousTime = null;
      let visible = false;
      let running = false;

      const render = () => {
        notes.forEach(note => {
          const angle = elapsed / note.period * Math.PI * 2 + note.phase;
          // One closed, flowing S-curve: no short tweens, corner stops or resets.
          note.setX((note.offsetX + note.x * Math.sin(angle)) * scale);
          note.setY(note.y * Math.sin(angle * 2 + note.curve) * scale);
          note.setRotation(note.rotation * Math.sin(angle + 0.3));
        });
      };
      const tick = time => {
        if (previousTime !== null) elapsed += Math.min(time - previousTime, 0.1);
        previousTime = time;
        render();
      };
      const updatePlayback = () => {
        const shouldRun = visible && !document.hidden;
        if (shouldRun === running) return;
        running = shouldRun;
        previousTime = null;
        notes.forEach(({ element }) => {
          if (running) element.style.willChange = 'transform';
          else element.style.removeProperty('will-change');
        });
        if (running) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };

      render();
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      });
      observer.observe(scene);
      const resizeObserver = new ResizeObserver(() => {
        scale = scene.clientWidth / 1920;
        render();
      });
      resizeObserver.observe(scene);
      document.addEventListener('visibilitychange', updatePlayback);

      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener('visibilitychange', updatePlayback);
        gsap.ticker.remove(tick);
        gsap.set(notes.map(({ element }) => element), { clearProps: 'transform,willChange' });
      };
    });

    return () => media.revert();
  }, [sceneRef]);
}
