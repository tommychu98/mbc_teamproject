import { useCallback, useLayoutEffect, useRef } from 'react';

const HOLD_VIEWPORTS = 0.65;
const TRANSITION_VIEWPORTS = 0.85;
const FINAL_HOLD_VIEWPORTS = 0.4;
const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

export default function usePerfumeHistoryScroll(sectionRef, stageRef, photoTrackRef, logoTrackRef, slides, setStoryState) {
    const scrollUnitRef = useRef(0);
    const totalDistance = (slides.length - 1) * (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS) + FINAL_HOLD_VIEWPORTS;

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frameId = 0;
        let previousIndex = -1;
        let previousTransition = null;

        const paint = () => {
            frameId = 0;
            const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
            const progress = distance > 0 ? clamp(-section.getBoundingClientRect().top / distance) : 0;
            const position = Math.min(totalDistance, Math.max(0, -section.getBoundingClientRect().top / scrollUnitRef.current));
            const segment = Math.min(slides.length - 1, Math.floor(position / (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS)));
            const localPosition = position - segment * (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS);
            const rawTransition = segment < slides.length - 1 ? clamp((localPosition - HOLD_VIEWPORTS) / TRANSITION_VIEWPORTS) : 0;
            // Document scroll positions round to pixels. Snap only sub-pixel
            // endpoints so a button landing on a hold is never left disabled.
            const epsilon = 1 / (scrollUnitRef.current * TRANSITION_VIEWPORTS);
            const transition = rawTransition < epsilon ? 0 : rawTransition > 1 - epsilon ? 1 : rawTransition;
            const eased = reducedMotion.matches ? Math.round(transition) : smoothstep(transition);
            const next = Math.min(slides.length - 1, segment + 1);
            const interpolate = (property) => {
                const from = parseFloat(slides[segment][property]);
                const to = parseFloat(slides[next][property]);
                return from + (to - from) * eased;
            };

            // Drive the original opposing horizontal tracks directly. There is
            // no wheel interception or trailing CSS transition after release.
            photoTrackRef.current.style.transform = `translate3d(${interpolate('photoShift')}cqw, 0, 0)`;
            logoTrackRef.current.style.transform = `translate3d(${interpolate('logoShift')}cqw, 0, 0)`;
            const activeIndex = segment + (eased >= 0.5 && next !== segment ? 1 : 0);
            const isTransitioning = transition > 0 && transition < 1;
            section.dataset.scrollProgress = progress.toFixed(6);
            section.dataset.slideProgress = (segment + eased).toFixed(6);
            if (activeIndex !== previousIndex || isTransitioning !== previousTransition) {
                previousIndex = activeIndex;
                previousTransition = isTransitioning;
                setStoryState({ activeIndex, isTransitioning });
            }
        };

        const schedulePaint = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };
        const measure = () => {
            const stageHeight = stage.offsetHeight;
            const unit = Math.max(window.innerHeight, stageHeight);
            scrollUnitRef.current = unit;
            section.style.setProperty('--history-stage-height', `${stageHeight}px`);
            section.style.setProperty('--history-scroll-distance', `${unit * totalDistance}px`);
            paint();
        };

        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', measure);
        reducedMotion.addEventListener('change', schedulePaint);
        measure();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', measure);
            reducedMotion.removeEventListener('change', schedulePaint);
        };
    }, [sectionRef, stageRef, photoTrackRef, logoTrackRef, slides, setStoryState, totalDistance]);

    // Buttons follow the same document scroll timeline as wheel, touch and
    // keyboard scrolling, so they cannot desynchronise the story state.
    return useCallback((index) => {
        if (index < 0 || index >= slides.length) return;
        const section = sectionRef.current;
        const start = section.getBoundingClientRect().top + window.scrollY;
        const position = index * (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS);
        window.scrollTo({
            top: start + position * scrollUnitRef.current,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
    }, [sectionRef, slides]);
}
