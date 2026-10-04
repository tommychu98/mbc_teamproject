import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Independent bottle entrance: never targets ingredient or note elements.
export default function useCon9BottleEntrance(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const bottle = scene.querySelector('.fragrances-con9__main-perfume');
      gsap.set(bottle, { y: 120 });
      const entrance = gsap.timeline({ paused: true })
        .to(bottle, { y: 0, duration: 1.7, ease: 'power2.out',
          onComplete: () => gsap.set(bottle, { clearProps: 'transform' }) });
      const trigger = ScrollTrigger.create({
        id: 'fragrances-con9-bottle-materialization',
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
