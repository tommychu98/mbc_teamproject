import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';

export default function useFooterFlowers(rootRef, enabled) {
    useLayoutEffect(() => {
        if (!enabled) return;
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            const flowers = [...root.querySelectorAll('[data-footer-flowers]')];
            const animations = flowers.map((flower, index) => gsap.fromTo(flower,
                { rotation: 0, xPercent: 0, yPercent: 0 },
                {
                    rotation: index === 0 ? 2.4 : -2.1,
                    xPercent: index === 0 ? 0.55 : -0.48,
                    yPercent: -0.7,
                    duration: index === 0 ? 3.5 : 4.2,
                    ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
                },
            ));
            let visible = false;
            const sync = () => animations.forEach((animation) => {
                if (visible && !document.hidden) animation.play();
                else animation.pause();
            });
            const observer = new IntersectionObserver(([entry]) => {
                visible = entry.isIntersecting;
                sync();
            }, { threshold: 0 });
            observer.observe(root);
            document.addEventListener('visibilitychange', sync);
            return () => {
                observer.disconnect();
                document.removeEventListener('visibilitychange', sync);
            };
        }, root);
        return () => media.revert();
    }, [rootRef, enabled]);
}
