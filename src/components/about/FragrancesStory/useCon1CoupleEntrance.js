import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animate only the desktop collage wrapper; its CSS slot remains unchanged.
export default function useCon1CoupleEntrance(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const couple = scene.querySelector('.fragrances-con1__couple');
      const artwork = couple?.querySelector('.fragrances-con1__couple-image');
      if (!couple || !artwork) return undefined;

      let phase = 'prepared';
      let wantsPaper = false;
      const preparePaperStart = () => {
        gsap.set(couple, {
          xPercent: -110, x: 0, y: 18, rotation: -1.7, rotationY: -2.2,
          transformPerspective: 1600, transformOrigin: '90% 65%', opacity: 0.96,
        });
        gsap.set(artwork, {
          filter: 'drop-shadow(3px 8px 12px rgba(91, 72, 55, 0.10))',
        });
        phase = 'prepared';
      };

      // A nearly opaque sheet pivots gently around its leading (right) edge.
      // Perspective belongs only to this wrapper and is removed after placement.
      preparePaperStart();
      const entrance = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.set(couple, { clearProps: 'transform,transformOrigin,opacity' });
          gsap.set(artwork, { clearProps: 'filter' });
          phase = 'settled';
        },
      })
        // The edge eases into view before the body follows across the surface.
        .to(couple, {
          xPercent: -88, y: 14, rotation: -1.3, rotationY: -1.6,
          duration: 0.42, ease: 'sine.in',
        })
        .to(couple, {
          xPercent: 0, x: -4, y: -2, rotation: 0.25, rotationY: 0.3, opacity: 1,
          duration: 1.65, ease: 'power2.out',
        })
        // Four final pixels and a small angle release, without a bounce.
        .to(couple, {
          x: 0, y: 0, rotation: 0, rotationY: 0,
          duration: 0.48, ease: 'sine.out',
        })
        .to(artwork, {
          filter: 'drop-shadow(1px 2px 3px rgba(91, 72, 55, 0.05))',
          duration: 1.65, ease: 'sine.inOut',
        }, 0.42)
        .to(artwork, {
          filter: 'drop-shadow(0px 0px 0px rgba(91, 72, 55, 0))',
          duration: 0.48, ease: 'sine.out',
        }, 2.07);

      // Compress entrance to 42.25% of its original time; keep the exit independent.
      entrance.timeScale(1 / 0.4225);

      const exit = gsap.timeline({
        paused: true,
        onComplete: () => {
          preparePaperStart();
          // A quick direction change finishes the exit before reusing entrance.
          if (wantsPaper) playPaperEntrance();
        },
      })
        .to(couple, {
          y: 10, rotation: -0.6, rotationY: -1.2,
          transformPerspective: 1600, transformOrigin: '90% 65%',
          duration: 0.18, ease: 'sine.inOut',
        })
        .to(couple, {
          xPercent: -110, x: 0, y: 18, rotation: -1.7, rotationY: -2.2,
          opacity: 0.96, duration: 0.95, ease: 'power2.inOut',
        })
        .to(artwork, {
          filter: 'drop-shadow(3px 8px 12px rgba(91, 72, 55, 0.10))',
          duration: 0.35, ease: 'sine.inOut',
        }, 0);

      function playPaperEntrance() {
        wantsPaper = true;
        if (phase !== 'prepared') return;
        phase = 'entering';
        entrance.invalidate().restart();
      }

      const playPaperExit = () => {
        wantsPaper = false;
        if (phase === 'prepared' || phase === 'exiting') return;
        entrance.pause();
        phase = 'exiting';
        exit.invalidate().restart();
      };

      const prepareBelowScene = () => {
        wantsPaper = false;
        entrance.pause();
        exit.pause();
        // "bottom top" guarantees the entire Con1 section is offscreen here.
        preparePaperStart();
      };

      const trigger = ScrollTrigger.create({
        id: 'fragrances-con1-couple-entrance',
        trigger: scene,
        // Stable section bounds keep both directions independent of transforms.
        // At the upper boundary the artwork is still visible for its left exit.
        start: 'top top',
        end: 'bottom top',
        onEnter: playPaperEntrance,
        onEnterBack: playPaperEntrance,
        onLeaveBack: playPaperExit,
        onLeave: prepareBelowScene,
      });

      return () => {
        trigger.kill();
        entrance.kill();
        exit.kill();
        // Replay can capture an in-flight start value. Always leave the static
        // layout clean when reduced motion or the mobile breakpoint takes over.
        gsap.set(couple, { clearProps: 'transform,transformOrigin,opacity' });
        gsap.set(artwork, { clearProps: 'filter' });
      };
    });

    return () => media.revert();
  }, [sceneRef]);
}
