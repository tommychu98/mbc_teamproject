import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mirror Con1's paper placement without changing any of its motion code.
export default function useCon4ManEntrance(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const artwork = scene.querySelector('.fragrances-con4__man');
      if (!artwork) return undefined;

      let phase = 'prepared';
      const clearMotion = () => gsap.set(artwork, {
        clearProps: 'transform,transformOrigin,opacity,filter,willChange',
      });
      const preparePaper = () => {
        gsap.set(artwork, {
          xPercent: 110, x: 0, y: 18, rotation: 1.7, rotationY: 2.2,
          transformPerspective: 1600, transformOrigin: '10% 65%', opacity: 0.96,
          filter: 'drop-shadow(-3px 8px 12px rgba(91, 72, 55, 0.10))',
        });
        phase = 'prepared';
      };

      preparePaper();
      const entrance = gsap.timeline({
        paused: true,
        onComplete: () => {
          // Leave precisely the static Figma slot, with no rasterizing transform.
          clearMotion();
          phase = 'settled';
        },
      })
        .to(artwork, {
          xPercent: 88, y: 14, rotation: 1.3, rotationY: 1.6,
          duration: 0.42, ease: 'sine.in',
        })
        .to(artwork, {
          xPercent: 0, x: 4, y: -2, rotation: -0.25, rotationY: -0.3,
          opacity: 1, filter: 'drop-shadow(-1px 2px 3px rgba(91, 72, 55, 0.05))',
          duration: 1.65, ease: 'power2.out',
        })
        .to(artwork, {
          x: 0, y: 0, rotation: 0, rotationY: 0,
          filter: 'drop-shadow(0px 0px 0px rgba(91, 72, 55, 0))',
          duration: 0.48, ease: 'sine.out',
        });

      // Match Con1's entrance timing while preserving this mirrored paper path.
      entrance.timeScale(1 / 0.4225);

      const playPaper = () => {
        if (phase !== 'prepared') return;
        phase = 'entering';
        gsap.set(artwork, { willChange: 'transform,opacity,filter' });
        entrance.invalidate().restart();
      };
      const resetOffscreen = () => {
        entrance.pause();
        gsap.set(artwork, { clearProps: 'willChange' });
        preparePaper();
      };

      // Reset only after the entire scene leaves the viewport, in either
      // direction. Crossing the entrance boundary while visible never jumps.
      const visibility = ScrollTrigger.create({
        id: 'fragrances-con4-man-visibility',
        trigger: scene,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: resetOffscreen,
        onLeaveBack: resetOffscreen,
      });
      const placement = ScrollTrigger.create({
        id: 'fragrances-con4-man-entrance',
        trigger: scene,
        start: 'top top',
        end: 'bottom top',
        onEnter: playPaper,
        onEnterBack: playPaper,
      });
      // Also handle a restored scroll position or a mount already within Con4.
      if (placement.isActive) playPaper();

      return () => {
        placement.kill();
        visibility.kill();
        entrance.kill();
        clearMotion();
      };
    });

    return () => media.revert();
  }, [sceneRef]);
}
