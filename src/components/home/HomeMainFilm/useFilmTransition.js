import { useLayoutEffect } from 'react';

// Static connection geometry from Figma 4259:21915 (1920px design width).
const DESIGN_WIDTH = 1920;
const FILM_TOP = 3030;
const FILM_HEIGHT = 1080;
const NIGHT_TOP = 3709;
const NIGHT_INTRO_TOP = 1461;
const EXISTING_NIGHT_INTRO_TOP = 342;
const NIGHT_GAP_REDUCTION = 180;

// Reveal the film as it enters the viewport between Day and Night.
export default function useFilmTransition(sectionRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = section.querySelector('.home-main-film__stage');
        const day = section.previousElementSibling;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        const reveal = () => {
            frame = 0;
            const bounds = stage.getBoundingClientRect();
            const viewport = window.innerHeight;
            const centerOffset = bounds.top + bounds.height / 2 - viewport / 2;
            // Keep a small clear interval around the center, then ease into each gradient.
            const fade = (distance) => {
                const progress = Math.max(0, Math.min(1, (distance - viewport * .08) / (viewport * .55)));
                return progress * progress * (3 - 2 * progress);
            };
            // Keep the Day gradient while its illustration is still above the film.
            // Only clear it as the film approaches the viewport center.
            const dayProgress = Math.max(0, Math.min(1, centerOffset / (viewport * .35)));
            const dayFade = reducedMotion.matches ? 0 : dayProgress * dayProgress * (3 - 2 * dayProgress);
            const nightFade = reducedMotion.matches ? 0 : fade(-centerOffset);
            section.style.setProperty('--film-day-fade', String(dayFade));
            section.style.setProperty('--film-night-fade', String(nightFade));
        };
        const scheduleReveal = () => {
            if (!frame) frame = window.requestAnimationFrame(reveal);
        };
        const measure = () => {
            const designScale = section.clientWidth / DESIGN_WIDTH;
            const stageHeight = Math.max(FILM_HEIGHT * designScale, window.innerHeight);
            section.style.setProperty('--film-stage-height', `${stageHeight}px`);
            const nightLead = Math.max(0, NIGHT_TOP + NIGHT_INTRO_TOP - FILM_TOP - FILM_HEIGHT - EXISTING_NIGHT_INTRO_TOP - NIGHT_GAP_REDUCTION) * designScale;
            section.style.setProperty('--film-day-lead', '0px');
            section.style.setProperty('--film-night-lead', `${nightLead}px`);
            scheduleReveal();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        if (day) observer.observe(day);
        measure();
        window.addEventListener('scroll', scheduleReveal, { passive: true });
        window.addEventListener('resize', measure);
        reducedMotion.addEventListener('change', scheduleReveal);
        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', scheduleReveal);
            window.removeEventListener('resize', measure);
            reducedMotion.removeEventListener('change', scheduleReveal);
        };
    }, [sectionRef]);
}
