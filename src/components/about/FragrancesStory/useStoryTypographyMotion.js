import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useStoryTypographyMotion(sceneRef, section, firstTitle, lastTitle) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia(scene);
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)',
    }, (context) => {
      if (!context.conditions.motion) return;
      const select = (name) => scene.querySelector(`.fragrances-${section}__${name}`);
      const title = context.conditions.desktop
        ? [...new Set([select(firstTitle), select(lastTitle), select('chapter')])]
        : [select('title'), select('chapter')];
      const blocks = [
        {
          name: 'title', targets: title,
          first: select(firstTitle), last: select(lastTitle), lag: 0,
        },
        { name: 'subtitle', targets: select('subtitle'), lag: 1 },
        { name: 'intro', targets: scene.querySelector(`.fragrances-${section}__intro > .fragrances-${section}__text`), lag: 2 },
        { name: 'body1', targets: select('text--body1') || select('text--body'), lag: 2 },
        { name: 'body2', targets: select('text--body2'), lag: 2 },
      ].filter(({ targets }) => targets);

      // Each intact text block uses its existing viewport position. The title's
      // absolutely positioned lines have no parent height on desktop, so measure
      // the first/last line directly, preserving their scene containing block.
      // On mobile the intact inline heading shares the tiny drift. No pin or
      // scene geometry changes; both title lines always animate together.
      const triggers = blocks.map(({ name, targets, first, last, lag }) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `fragrances-${section}-focus-${name}`,
            trigger: first || targets,
            endTrigger: last || targets,
            start: `top ${94 - lag}%`,
            end: 'bottom 6%',
            scrub: 1.6,
            invalidateOnRefresh: true,
            onLeave: (self) => self.getTween()?.progress(1),
            onLeaveBack: (self) => self.getTween()?.progress(1),
          },
        });
        timeline
          .fromTo(targets, { opacity: 0.2, y: 4 },
            { opacity: 1, y: 0, duration: 0.44, ease: 'sine.inOut' }, 0)
          // Hold clear for reading, then disperse softly near the viewport exit.
          .to(targets, { opacity: 0, duration: 0.24, ease: 'sine.inOut' }, 0.76);
        return timeline.scrollTrigger;
      });

      // Mobile reflow and font loading can change these positions without changing
      // the image animations. Refresh only the new typography triggers.
      let refreshFrame = 0;
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => triggers.forEach((trigger) => trigger.refresh()));
      });
      resize.observe(scene);
      blocks.forEach(({ first, last, targets }) => {
        if (first) {
          resize.observe(first);
          resize.observe(last);
        } else resize.observe(targets);
      });
      return () => {
        resize.disconnect();
        cancelAnimationFrame(refreshFrame);
      };
    });

    // Restore readable CSS on reduced motion, unmount and StrictMode replay.
    return () => media.revert();
  }, [sceneRef, section, firstTitle, lastTitle]);
}
