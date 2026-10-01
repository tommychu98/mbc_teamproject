import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useCon3Motion(sceneRef) {
  const entrancePlayed = useRef(false);
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia(scene);
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)',
    }, (context) => {
      if (!context.conditions.motion) return;

      const bottle = scene.querySelector('.fragrances-con3__main-perfume');
      const titles = scene.querySelectorAll('.fragrances-con3__note-name-copy');
      const captions = scene.querySelectorAll('.fragrances-con3__note-label');
      const textScale = () => context.conditions.desktop ? Math.min(1, scene.clientWidth / 1920) : 1;
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'fragrances-con3-story',
          trigger: scene,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1.2,
          invalidateOnRefresh: true,
          // Catch up immediately after a fast exit in either direction.
          onLeave: (self) => self.getTween()?.progress(1),
          onLeaveBack: (self) => self.getTween()?.progress(1),
        },
      });

      // A unit-length clock keeps all percentages identical on mobile, whose
      // existing combined artwork must stay still to protect nearby objects.
      timeline.to({}, { duration: 1 }, 0);
      if (context.conditions.desktop) {
        timeline.fromTo(bottle,
          { y: () => Math.min(64, bottle.clientHeight * 0.18), scale: 0.95 },
          { y: 0, scale: 1, duration: 0.8 }, 0);
      }
      timeline.fromTo(titles,
        { y: () => 38 * textScale(), opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.25 }, 0.5);
      // Explicit stagger positions initialize every label immediately without
      // a separate gsap.set that could survive a nested startAt reversion.
      captions.forEach((caption, index) => {
        timeline.fromTo(caption,
          { y: () => 12 * textScale(), opacity: 0 },
          { y: 0, opacity: 1, duration: 0.11, immediateRender: true }, 0.65 + index * 0.12);
      });

      if (context.conditions.desktop && !entrancePlayed.current) {
        const artwork = scene.querySelector('.fragrances-con3__main-perfume-artwork');
        const notes = scene.querySelector('.fragrances-con3__notes');
        // The inner crop gently rises into focus once; the outer bottle keeps
        // scrubbing uninterrupted. Every entrance value settles without overshoot.
        const entrance = gsap.timeline({ paused: true })
          .fromTo(artwork, { y: 50, opacity: 0, scale: 0.94, filter: 'blur(3px)' },
            { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' }, 0)
          // Keep the existing text timeline/timing; only its first exposure waits
          // for the bottle to settle, even if the visitor scrolls quickly past 50%.
          .fromTo(notes, { opacity: 0 },
            { opacity: 1, duration: 0.15, ease: 'none' }, 1.4);

        ScrollTrigger.create({
          id: 'fragrances-con3-bottle-entrance',
          trigger: bottle,
          start: 'top 95%',
          end: 'bottom top',
          once: true,
          onEnter: () => {
            entrancePlayed.current = true;
            entrance.play();
          },
          onLeave: () => {
            entrancePlayed.current = true;
            entrance.progress(1).pause();
          },
          onLeaveBack: () => {
            if (entrancePlayed.current) entrance.progress(1).pause();
          },
        });
      }

      // Earlier responsive sections can change height independently of a window
      // resize. Refresh only this trigger; never change other section timings.
      let refreshFrame = 0;
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => timeline.scrollTrigger.refresh());
      });
      resize.observe(scene);
      for (let sibling = scene.parentElement.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        resize.observe(sibling);
      }
      return () => {
        resize.disconnect();
        cancelAnimationFrame(refreshFrame);
      };
    });

    // Scoped reversion restores original CSS visibility and transforms on
    // reduced-motion changes, breakpoint changes, unmount and StrictMode replay.
    return () => media.revert();
  }, [sceneRef]);
}
