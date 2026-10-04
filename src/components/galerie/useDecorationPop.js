import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useDecorationPop(rootRef, selector, mobileArrival = false) {
    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add({
            motion: '(prefers-reduced-motion: no-preference)',
            mobile: '(max-width: 767px)',
        }, (context) => {
            if (!context.conditions.motion) return;
            const arrivals = new Map();
            root.querySelectorAll(selector).forEach((element, index) => {
                const scene = element.closest('.galerie-tamdao__scene');
                const unfoldOnArrival = mobileArrival && context.conditions.mobile && scene;
                // Animate relative to the artwork's existing angle, so the
                // collage returns to its designed pose after unfolding.
                const rotation = Number(gsap.getProperty(element, 'rotation')) || 0;
                const animation = gsap.fromTo(element,
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
                        ...(unfoldOnArrival ? { paused: true, duration: 0.9, delay: 0.18 + index * 0.2 } : {}),
                        ease: 'back.out(1.15)',
                        scrollTrigger: unfoldOnArrival ? undefined : {
                            // Measure the fixed wrapper, not the animated artwork.
                            trigger: element.parentElement,
                            start: `top ${94 - (index % 3) * 3}%`,
                            end: `top ${42 - (index % 3) * 3}%`,
                            scrub: 0.55,
                            invalidateOnRefresh: true,
                        },
                    },
                );
                if (unfoldOnArrival) {
                    if (!arrivals.has(scene)) arrivals.set(scene, []);
                    arrivals.get(scene).push(animation);
                }
            });
            if (!arrivals.size) return;

            // Detect arrival in the upper quarter of the viewport. A one-pixel
            // scroll boundary can be missed by smooth scrolling and rounding.
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    arrivals.get(entry.target)?.forEach((animation) => animation.play());
                    observer.unobserve(entry.target);
                });
            }, { rootMargin: `0px 0px -${Math.round(document.documentElement.clientHeight * 0.75)}px 0px`, threshold: 0 });
            arrivals.forEach((_, scene) => observer.observe(scene));
            return () => observer.disconnect();
        }, root);
        return () => media.revert();
    }, [rootRef, selector, mobileArrival]);
}
