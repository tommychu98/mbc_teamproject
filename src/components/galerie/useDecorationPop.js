import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useDecorationPop(rootRef, selector, sequentialArrival = false) {
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
                // Responsive artwork hidden by CSS must not delay visible pieces.
                // matchMedia rebuilds the sequence when the breakpoint changes.
                if (!element.getClientRects().length) return;
                const scene = element.closest('.galerie-tamdao__scene');
                const unfoldOnArrival = sequentialArrival && context.conditions.mobile && scene;
                const desktopSequence = sequentialArrival && !context.conditions.mobile && scene;
                const paperUnfold = sequentialArrival && scene;
                // Animate relative to the artwork's existing angle, so the
                // collage returns to its designed pose after unfolding.
                const rotation = Number(gsap.getProperty(element, 'rotation')) || 0;
                const animation = gsap.fromTo(element,
                    {
                        y: paperUnfold ? 24 : 32,
                        rotation: rotation + (index % 2 ? 1 : -1) * (paperUnfold ? 8 : 12),
                        scaleX: paperUnfold ? 0.88 : 0.86,
                        scaleY: paperUnfold ? 0.82 : 0.94,
                        ...(paperUnfold ? {
                            transformPerspective: 900,
                            rotationX: -55,
                            rotationY: index % 2 ? 18 : -18,
                            skewY: index % 2 ? 4 : -4,
                        } : {}),
                        opacity: 0,
                        transformOrigin: paperUnfold ? '50% 100%' : '50% 80%',
                    },
                    {
                        y: 0,
                        rotation,
                        scaleX: 1,
                        scaleY: 1,
                        ...(paperUnfold ? { rotationX: 0, rotationY: 0, skewY: 0 } : {}),
                        opacity: 1,
                        ...(unfoldOnArrival ? { paused: true, duration: 0.55 } : {}),
                        ease: paperUnfold ? 'power2.out' : 'back.out(1.15)',
                        scrollTrigger: unfoldOnArrival ? undefined : {
                            // Measure the fixed wrapper, not the animated artwork.
                            trigger: element.parentElement,
                            start: desktopSequence ? 'top 92%' : `top ${94 - (index % 3) * 3}%`,
                            end: desktopSequence ? 'top 52%' : `top ${42 - (index % 3) * 3}%`,
                            scrub: desktopSequence ? 0.45 : 0.55,
                            invalidateOnRefresh: true,
                        },
                    },
                );
                if (unfoldOnArrival) {
                    if (!arrivals.has(scene)) {
                        arrivals.set(scene, { timeline: gsap.timeline({ paused: true }), count: 0 });
                    }
                    const arrival = arrivals.get(scene);
                    arrival.timeline.add(animation, 0.08 + arrival.count * 0.35);
                    animation.paused(false);
                    arrival.count += 1;
                }
            });
            if (!arrivals.size) return;

            // Mobile keeps timed unfolding, replayed when the user returns.
            // Measure the scene so the ingredients' transforms cannot move
            // the scroll boundaries while they unfold or fold back.
            arrivals.forEach(({ timeline }, scene) => {
                ScrollTrigger.create({
                    trigger: scene,
                    start: 'top 45%',
                    end: 'bottom top',
                    onEnter: () => timeline.play(),
                    onLeave: () => timeline.reverse(),
                    onEnterBack: () => timeline.play(),
                    onLeaveBack: () => timeline.reverse(),
                });
            });
        }, root);
        return () => media.revert();
    }, [rootRef, selector, sequentialArrival]);
}
