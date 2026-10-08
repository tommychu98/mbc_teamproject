import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Con4's right-hand paper placement, with Con1's exit/re-entry lifecycle.
export default function useCon7DancersEntrance(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const artwork = scene.querySelector('.fragrances-con7__dancers');
      if (!artwork) return undefined;

      let phase = 'prepared';
      let wantsPaper = false;
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
        id: 'fragrances-con7-dancers-placement',
        paused: true,
        onComplete: () => {
          // Restore the exact static Figma slot and full-resolution rendering.
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

      // Match Con4's entrance timing without changing the separate exit timeline.
      entrance.timeScale(1 / 0.4225);

      const exit = gsap.timeline({
        id: 'fragrances-con7-dancers-withdrawal',
        paused: true,
        onComplete: () => {
          preparePaper();
          // Finish exiting before a queued entrance; never teleport in view.
          if (wantsPaper) playPaperEntrance();
        },
      })
        .to(artwork, {
          y: 10, rotation: 0.6, rotationY: 1.2,
          duration: 0.18, ease: 'sine.inOut',
        })
        .to(artwork, {
          xPercent: 110, x: 0, y: 18, rotation: 1.7, rotationY: 2.2,
          opacity: 0.96, duration: 0.95, ease: 'power2.inOut',
        })
        .to(artwork, {
          filter: 'drop-shadow(-3px 8px 12px rgba(91, 72, 55, 0.10))',
          duration: 0.35, ease: 'sine.inOut',
        }, 0);

      function playPaperEntrance() {
        wantsPaper = true;
        if (phase !== 'prepared') return;
        phase = 'entering';
        gsap.set(artwork, { willChange: 'transform,opacity,filter' });
        entrance.invalidate().restart();
      }

      const playPaperExit = () => {
        wantsPaper = false;
        if (phase === 'prepared' || phase === 'exiting') return;
        entrance.pause();
        phase = 'exiting';
        gsap.set(artwork, {
          transformPerspective: 1600, transformOrigin: '10% 65%',
          willChange: 'transform,opacity,filter',
        });
        exit.invalidate().restart();
      };

      const resetOffscreen = () => {
        wantsPaper = false;
        entrance.pause();
        exit.pause();
        gsap.set(artwork, { clearProps: 'willChange' });
        preparePaper();
      };

      // These bounds reset only when the entire scene is outside the viewport.
      const visibility = ScrollTrigger.create({
        id: 'fragrances-con7-dancers-visibility',
        trigger: scene,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: resetOffscreen,
        onLeaveBack: resetOffscreen,
      });
      const placement = ScrollTrigger.create({
        id: 'fragrances-con7-dancers-entrance',
        trigger: scene,
        start: 'top top',
        end: 'bottom top',
        onEnter: playPaperEntrance,
        onEnterBack: playPaperEntrance,
        onLeaveBack: playPaperExit,
        // Also cover a fast skip across the whole section in one scroll update.
        onLeave: resetOffscreen,
      });
      if (placement.isActive) playPaperEntrance();

      return () => {
        placement.kill();
        visibility.kill();
        entrance.kill();
        exit.kill();
        clearMotion();
      };
    });

    return () => media.revert();
  }, [sceneRef]);
}
