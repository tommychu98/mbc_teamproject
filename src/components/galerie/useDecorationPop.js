import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useDecorationPop(rootRef, selector) {
    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            root.querySelectorAll(selector).forEach((element, index) => {
                // Animate relative to the artwork's existing angle, so the
                // collage returns to its designed pose after unfolding.
                const rotation = Number(gsap.getProperty(element, 'rotation')) || 0;
                gsap.fromTo(element,
                    {
                        y: 32,
                        rotation: rotation + (index % 2 ? 12 : -12),
                        scaleX: 0.86,
                        scaleY: 0.94,
                        opacity: 0,
                        transformOrigin: '50% 80%',
                    },
                    {
                        y: 0,
                        rotation,
                        scaleX: 1,
                        scaleY: 1,
                        opacity: 1,
                        ease: 'back.out(1.15)',
                        scrollTrigger: {
                            // Measure the fixed wrapper, not the animated artwork.
                            trigger: element.parentElement,
                            start: `top ${94 - (index % 3) * 3}%`,
                            end: `top ${42 - (index % 3) * 3}%`,
                            scrub: 0.55,
                            invalidateOnRefresh: true,
                        },
                    },
                );
            });
        }, root);
        return () => media.revert();
    }, [rootRef, selector]);
}
