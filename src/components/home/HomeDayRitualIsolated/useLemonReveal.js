import { useLayoutEffect } from 'react';
import '../connectedLemon.css';

export default function useLemonReveal(sectionRef, lemonRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const lemon = lemonRef.current;
        const memoryLemon = section.previousElementSibling?.querySelector('.home-scent-memory__lemon');
        const lemons = [lemon, memoryLemon].filter(Boolean);
        // Both halves share the same clock and pivot, including across the seam.
        const delay = `${-(document.timeline.currentTime ?? performance.now())}ms`;
        lemons.forEach((element) => element.style.setProperty('--lemon-sway-delay', delay));
        let frameId = 0;

        const paint = () => {
            frameId = 0;
            const { top } = section.getBoundingClientRect();
            const viewport = window.innerHeight;
            const progress = Math.min(1, Math.max(0, (viewport * .85 - top) / (viewport * .55)));
            lemons.forEach((element) => element.style.setProperty('--lemon-color', progress));
        };
        const schedule = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };
        const observer = new ResizeObserver(schedule);
        observer.observe(section);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        paint();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            lemons.forEach((element) => {
                element.style.removeProperty('--lemon-color');
                element.style.removeProperty('--lemon-sway-delay');
            });
        };
    }, [sectionRef, lemonRef]);
}
