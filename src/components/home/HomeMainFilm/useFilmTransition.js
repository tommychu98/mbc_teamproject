import { useLayoutEffect } from 'react';

// Static connection geometry from Figma 4259:21915 (1920px design width).
const DESIGN_WIDTH = 1920;
const FILM_TOP = 3030;
const FILM_HEIGHT = 1080;
const NIGHT_TOP = 3709;
const NIGHT_INTRO_TOP = 1461;
const EXISTING_NIGHT_INTRO_TOP = 342;

// Retains the approved Day/Video/Night spacing; no scroll animation.
export default function useFilmTransition(sectionRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const day = section.previousElementSibling;
        const measure = () => {
            const designScale = section.clientWidth / DESIGN_WIDTH;
            const dayLead = Math.max(0, FILM_TOP * designScale - (day?.offsetHeight || 0));
            const nightLead = (NIGHT_TOP + NIGHT_INTRO_TOP - FILM_TOP - FILM_HEIGHT - EXISTING_NIGHT_INTRO_TOP) * designScale;
            section.style.setProperty('--film-day-lead', `${dayLead}px`);
            section.style.setProperty('--film-night-lead', `${nightLead}px`);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        if (day) observer.observe(day);
        measure();
        return () => observer.disconnect();
    }, [sectionRef]);
}
