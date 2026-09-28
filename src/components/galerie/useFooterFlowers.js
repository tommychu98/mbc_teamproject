import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';

export default function useFooterFlowers(rootRef, enabled) {
    useLayoutEffect(() => {
        if (!enabled) return;
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const flowers = [...root.querySelectorAll('[data-footer-flowers]')];
            const animations = flowers.map((flower, index) => gsap.fromTo(flower,
                { rotation: 0, xPercent: 0, yPercent: 0 },
                {
                    rotation: index === 0 ? 1.8 : -1.5,
                    xPercent: index === 0 ? 0.35 : -0.3,
                    yPercent: -0.35,
                    duration: index === 0 ? 3.8 : 4.6,
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
