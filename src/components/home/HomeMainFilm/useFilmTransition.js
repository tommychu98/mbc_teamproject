import { useLayoutEffect } from 'react';

// Keep the original artwork scale while shortening the empty connections.
const DESIGN_WIDTH = 1920;
const NIGHT_OVERLAP = 160;

// Reveal the film as it enters the viewport between Day and Night.
export default function useFilmTransition(sectionRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = section.querySelector('.home-main-film__stage');
        const day = section.previousElementSibling;
        let frame = 0;
        const reveal = () => {
            frame = 0;
            const bounds = stage.getBoundingClientRect();
            const viewport = window.innerHeight;
            const fade = (value) => {
                const progress = Math.max(0, Math.min(1, value));
                return progress * progress * (3 - 2 * progress);
            };
            // Begin revealing during entry instead of holding an empty screen.
            // The feathered top edge stays matched to Day until it leaves view.
            const entryProgress = (viewport - bounds.top) / viewport;
            const exitProgress = (viewport - bounds.bottom) / viewport;
            const dayFade = 1 - fade((entryProgress - .12) / .88);
            const nightFade = fade((exitProgress - .12) / .88);
            section.style.setProperty('--film-entry-edge', bounds.top > 0 ? '1' : '0');
            section.style.setProperty('--film-exit-edge', bounds.bottom < viewport ? '1' : '0');
            section.style.setProperty('--film-day-fade', String(dayFade));
            section.style.setProperty('--film-night-fade', String(nightFade));
        };
        const scheduleReveal = () => {
            if (!frame) frame = window.requestAnimationFrame(reveal);
        };
        const measure = () => {
            const designScale = section.clientWidth / DESIGN_WIDTH;
            // A viewport-sized sticky stage gives the film a fully clear hold
            // before the same feathered transition resumes toward Night.
            const stageHeight = window.innerHeight;
            section.style.setProperty('--film-stage-height', `${stageHeight}px`);
            section.style.setProperty('--film-day-lead', `${-100 * designScale}px`);
            section.style.setProperty('--film-night-lead', `${-NIGHT_OVERLAP * designScale}px`);
            scheduleReveal();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        if (day) observer.observe(day);
        measure();
        window.addEventListener('scroll', scheduleReveal, { passive: true });
        window.addEventListener('resize', measure);
        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', scheduleReveal);
            window.removeEventListener('resize', measure);
        };
    }, [sectionRef]);
}
