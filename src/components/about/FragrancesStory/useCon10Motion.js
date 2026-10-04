import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useCon10Motion(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia(scene);
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)',
      mobile: '(width < 768px)',
    }, (context) => {
      if (!context.conditions.motion) return;
      const book = scene.querySelector('.fragrances-con10__layer--main-book');
      const iris = scene.querySelector('.fragrances-con10__layer--iris');
      const background = scene.querySelector('.fragrances-con10__layer--background');
      const scaled = (pixels) => pixels * scene.clientWidth / (context.conditions.mobile ? 860 : 1920);
      let depthStarted = false;

      context.add('startDepth', () => {
        if (depthStarted) return;
        depthStarted = true;
        gsap.set([book, iris], { clearProps: 'opacity,transform' });
        // Independent translate leaves the inner book's original matrix/crop intact.
        gsap.timeline({
          defaults: { duration: 1, ease: 'none' },
          scrollTrigger: {
            id: 'fragrances-con10-depth',
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
            // Settle the smoothing tween when the section is no longer visible.
            onLeave: (self) => self.getTween()?.progress(1),
            onLeaveBack: (self) => self.getTween()?.progress(1),
          },
        })
          .fromTo(book, { translate: '0px 0px' },
            { translate: () => `0px ${scaled(-10)}px` }, 0)
          .fromTo(iris, { translate: '0px 0px' },
            { translate: () => `0px ${scaled(-15)}px` }, 0)
          .fromTo(background, { translate: '0px 0px' },
            { translate: () => `0px ${scaled(-3)}px` }, 0);
      });

      // Existing outer layers only: preserve both inner matrices and original assets.
      // Iris follows the complete book by 0.2s; both settle at their CSS positions.
      const entrance = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: context.startDepth,
      })
        .fromTo(book,
          { opacity: 0, y: () => scaled(14), scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 }, 0)
        .fromTo(iris,
          { opacity: 0, y: () => scaled(12), scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.2);
      ScrollTrigger.create({
        id: 'fragrances-con10-entrance',
        trigger: scene,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => entrance.play(),
        onEnterBack: () => entrance.play(),
        onLeave: () => entrance.progress(1),
        onLeaveBack: () => { if (entrance.progress() > 0) entrance.progress(1); },
      });
    });

    // Scoped cleanup also restores full visibility when reduced motion is enabled.
    return () => media.revert();
  }, [sceneRef]);
}
