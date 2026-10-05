import { useLayoutEffect } from 'react';
import { createDampedValue, MOTION_RESPONSE } from '../../../utils/scrollMotion';
import '../connectedLemon.css';

export default function useLemonReveal(sectionRef, lemonRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const lemon = lemonRef.current;
        const memoryLemon = section.previousElementSibling?.querySelector('.home-scent-memory__lemon');
        const mobileLemon = section.querySelector('.home-mobile-day__lemon');
        const lemons = [lemon, memoryLemon, mobileLemon].filter(Boolean);
        // Both halves share the same clock and pivot, including across the seam.
        const delay = `${-(document.timeline.currentTime ?? performance.now())}ms`;
        lemons.forEach((element) => element.style.setProperty('--lemon-sway-delay', delay));
        let frameId = 0;
        let needsMeasure = true;
        const motion = createDampedValue({ response: MOTION_RESPONSE.foreground });

        const paint = now => {
            frameId = 0;
            if (needsMeasure && mobileLemon && memoryLemon && window.matchMedia('(max-width: 767px)').matches) {
                const memoryStage = memoryLemon.parentElement;
                const canvas = mobileLemon.parentElement;
                const scale = section.clientWidth / canvas.offsetWidth;
                // Continue the same full image at the previous stage's cut line.
                // Use layout coordinates so sway cannot affect this measurement.
                const memoryTop = parseFloat(getComputedStyle(memoryLemon).top);
                const stageHeight = parseFloat(getComputedStyle(memoryStage).height);
                if (scale > 0) mobileLemon.style.setProperty('--mobile-lemon-top', `${(memoryTop - stageHeight) / scale}px`);
            }
            needsMeasure = false;
            const { top } = section.getBoundingClientRect();
            const viewport = window.innerHeight;
            const target = Math.min(1, Math.max(0, (viewport * .85 - top) / (viewport * .55)));
            const progress = motion.update(target, now, false);
            lemons.forEach((element) => element.style.setProperty('--lemon-color', progress));
            if (motion.moving) frameId = requestAnimationFrame(paint);
        };
        const schedule = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };
        const measure = () => { needsMeasure = true; schedule(); };
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        if (memoryLemon) observer.observe(memoryLemon.parentElement);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', measure);

        schedule();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', measure);

            lemons.forEach((element) => {
                element.style.removeProperty('--mobile-lemon-top');
                element.style.removeProperty('--lemon-color');
                element.style.removeProperty('--lemon-sway-delay');
            });
        };
    }, [sectionRef, lemonRef]);
}
