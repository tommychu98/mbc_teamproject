import { useContext } from 'react';
import { BookSequenceContext, bookSceneTrigger } from './BookSequenceContext';
import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useCon10Motion(sceneRef) {
  const sequence = useContext(BookSequenceContext);
  useLayoutEffect(() => {
    if (sequence && !sequence.animation) return undefined;
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
      const landing = Boolean(sequence);
      let depthStarted = false;

      context.add('startDepth', () => {
        if (depthStarted) return;
        depthStarted = true;
        gsap.set([book, iris], { clearProps: 'opacity,transform' });
        // Independent translate leaves the inner book's original matrix/crop intact.
        const depth = gsap.timeline({
          defaults: { duration: 1, ease: 'none' },
          scrollTrigger: {
            id: 'fragrances-con10-depth',
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            ...bookSceneTrigger(sequence, 'left right'),
            scrub: 1.2,
            invalidateOnRefresh: true,
            // Settle the smoothing tween when the section is no longer visible.
            onLeave: (self) => self.getTween()?.progress(1),
            onLeaveBack: (self) => self.getTween()?.progress(1),
          },
        });
        // The desktop book stays on the table after landing; preserve the
        // original vertical/mobile depth motion and the other existing layers.
        if (!landing) depth
          .fromTo(book, { translate: '0px 0px' },
            { translate: () => `0px ${scaled(-10)}px` }, 0)
          .fromTo(iris, { translate: '0px 0px' },
            { translate: () => `0px ${scaled(-15)}px` }, 0);
        depth
          .fromTo(background, { translate: '0px 0px' },
            { translate: () => `0px ${scaled(-3)}px` }, 0);
      });

      // Existing outer layers only: preserve both inner matrices and original assets.
      // Desktop book and iris share the same landing curve, 0.08s apart.
      const entrance = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: context.startDepth,
      })
        .fromTo(book,
          { opacity: landing ? 1 : 0, y: () => scaled(landing ? -48 : 14), scale: landing ? 1 : 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: landing ? 1.5 : 1.2,
            ease: landing ? 'power2.out' : 'power3.out' }, 0)
        .fromTo(iris,
          { opacity: landing ? 1 : 0, y: () => scaled(landing ? -24 : 12), scale: landing ? 1 : 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: landing ? 1.5 : 1,
            ease: landing ? 'power2.out' : 'power3.out' }, landing ? 0.08 : 0.2);
      ScrollTrigger.create({
        id: 'fragrances-con10-entrance',
        trigger: scene,
        start: 'top bottom',
        end: 'bottom top',
        ...(sequence ? {
          start: () => sequence.holdPosition(scene),
          // Fast scroll completes the composition before leaving its HOLD.
          end: () => sequence.holdEndPosition(scene),
        } : {}),
        onEnter: () => entrance.play(),
        onEnterBack: () => entrance.play(),
        onLeave: () => entrance.progress(1),
        onLeaveBack: () => { if (entrance.progress() > 0) entrance.progress(1); },
      });
    });

    // Scoped cleanup also restores full visibility when reduced motion is enabled.
    return () => media.revert();
  }, [sceneRef, sequence]);
}
