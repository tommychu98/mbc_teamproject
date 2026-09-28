import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Visual groups, independent of the back-to-front rendering order in heroLayers.
const middleObjects = [
  'flower-at-corner', 'hidden-books', 'scale', 'stationery',
  'books-piled-up', 'letter', 'book-and-perfume', 'pile-of-papers', 'perfume-still',
];
const decorativeObjects = [
  'candle', 'bowl', 'lighter-ink', 'ink', 'small-flower', 'smaller-pen', 'flower-iris',
];

export default function useHeroMotion(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const media = gsap.matchMedia(scene);
    media.add('(prefers-reduced-motion: no-preference)', (context) => {
      let disposed = false;
      const layer = (name) => scene.querySelector(`.fragrances-story__layer--${name}`);
      const layers = [...scene.querySelectorAll('.fragrances-story__layer')];
      const select = (names) => names.map(layer);
      const scaled = (pixels) => pixels * scene.clientWidth / 1920;

      // Entrance owns transform; scroll owns the independent CSS translate property.
      // The inner object's existing rotation, reflection and image crop stay untouched.
      context.add('startParallax', () => {
        gsap.set(layers, { clearProps: 'opacity,transform' });
        const parallax = gsap.timeline({
          defaults: { duration: 1, ease: 'none' },
          scrollTrigger: {
            id: 'fragrances-story-hero',
            trigger: scene,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
        const depth = (targets, pixels) => parallax.fromTo(targets,
          { translate: '0px 0px' },
          { translate: () => `0px ${scaled(pixels)}px` }, 0);
        depth(layer('background'), -5);
        depth(select(middleObjects), -18);
        depth(select(decorativeObjects), -34);
        // Identical displacement keeps the hand anchored visually to the book.
        depth(select(['main-book', 'hand']), -10);
      });

      const entrance = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: context.startParallax,
      });
      entrance.fromTo(layer('background'),
        { opacity: 0, scale: 1.018 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0);
      entrance.fromTo(select(['flower-at-corner', 'hidden-books', 'scale']),
        { opacity: 0 }, { opacity: 1, duration: 1.05, ease: 'power2.out' }, 0.25);
      entrance.fromTo(select(['stationery', 'books-piled-up', 'perfume-still']),
        { opacity: 0, y: () => scaled(10) },
        { opacity: 1, y: 0, duration: 1 }, 0.35);
      entrance.fromTo(select(['letter', 'book-and-perfume', 'pile-of-papers']),
        { opacity: 0, y: () => scaled(12) },
        { opacity: 1, y: 0, duration: 0.95 }, 0.45);
      entrance.fromTo(select(decorativeObjects),
        { opacity: 0, y: () => scaled(18) },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.7);
      entrance.fromTo(layer('main-book'),
        { opacity: 0, scale: 0.97, y: () => scaled(15) },
        { opacity: 1, scale: 1, y: 0, duration: 1.15 }, 1.8);
      entrance.fromTo(layer('hand'),
        { opacity: 0, y: () => scaled(12) },
        { opacity: 1, y: 0, duration: 0.85 }, 2.05);

      // Reveal decoded images, including on a cold visit; never restart after unmount.
      Promise.allSettled([...scene.querySelectorAll('img')].map((image) => image.decode()))
        .then(() => { if (!disposed) entrance.play(); });

      return () => { disposed = true; };
    });

    // Reverts styles, timelines and this Hero's trigger, including StrictMode remounts.
    return () => media.revert();
  }, [sceneRef]);
}
