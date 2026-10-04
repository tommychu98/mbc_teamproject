import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Independent bottle entrance: never targets ingredient or note elements.
export default function useCon3BottleEntrance(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const media = gsap.matchMedia();
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)',
      mobile: '(width < 768px)',
    }, ({ conditions }) => {
      if (!conditions.motion) return;
      const bottle = scene.querySelector('.fragrances-con3__main-perfume');
      // The mobile bottle uses its own Figma slot; preserve the desktop 120px rise.
      gsap.set(bottle, { y: conditions.desktop ? 120 : 32 * scene.clientWidth / 430 });
      const entrance = gsap.timeline({ paused: true })
        .to(bottle, { y: 0, duration: 1.7, ease: 'power2.out',
          onComplete: () => gsap.set(bottle, { clearProps: 'transform' }) });
      const trigger = ScrollTrigger.create({
        id: 'fragrances-con3-bottle-materialization',
        trigger: bottle,
        start: 'top 85%',
        once: true,
        onEnter: () => entrance.play(),
      });
      return () => { trigger.kill(); entrance.kill(); };
    });
    return () => media.revert();
  }, [sceneRef]);
}
