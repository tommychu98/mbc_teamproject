import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const coordinate = number => number.toFixed(2);

function curve(points) {
  return points.slice(1).map((end, index) => {
    const start = points[index];
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 2)];
    const first = start.map((value, axis) => value + (end[axis] - before[axis]) / 6);
    const second = end.map((value, axis) => value - (after[axis] - start[axis]) / 6);
    return `C${[...first, ...second, ...end].map(coordinate).join(' ')}`;
  }).join(' ');
}

function smokePath(time) {
  const left = [];
  const right = [];
  for (let index = 0; index <= 20; index += 1) {
    const height = index / 20;
    // Negative time phase carries each curl upward instead of rocking the
    // entire plume. The second, slower wave keeps the shape from repeating.
    const drift = Math.pow(height, 1.1) * (
      24 * Math.sin(Math.PI * 2 * (1.15 * height - time / 18))
      + 8 * Math.sin(Math.PI * 2 * (0.55 * height - time / 27) + 0.7)
    );
    const width = 1.25 + 7.5 * Math.pow(height, 0.85)
      * (1 + 0.12 * Math.sin(Math.PI * 2 * (height - time / 23)));
    const y = 340 * (1 - height);
    left.push([64 + drift - width, y]);
    right.push([64 + drift + width, y]);
  }
  right.reverse();
  return `M${left[0].map(coordinate).join(' ')} ${curve(left)} L${right[0].map(coordinate).join(' ')} ${curve(right)} Z`;
}

export default function useCon7SmokeMotion(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const plume = scene?.querySelector('.fragrances-con7__smoke-plume');
    if (!plume) return undefined;

    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      let elapsed = 0;
      let previousTime = null;
      let visible = false;
      let running = false;
      const render = () => plume.setAttribute('d', smokePath(elapsed));
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
        if (running) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };

      render();
      scene.dataset.con7Smoke = 'ready';
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      });
      observer.observe(scene);
      document.addEventListener('visibilitychange', updatePlayback);

      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', updatePlayback);
        gsap.ticker.remove(tick);
        delete scene.dataset.con7Smoke;
        plume.removeAttribute('d');
      };
    });

    return () => media.revert();
  }, [sceneRef]);
}
