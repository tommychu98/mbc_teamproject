import { useLayoutEffect } from 'react';

const SCROLL_VIEWPORTS = 3.6;
const EXPAND_START = 0.08;
const EXPAND_END = 0.88;
const SCRUB_RESPONSE_MS = 90;
const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);
const ramp = (progress, start, end) => smoothstep(clamp((progress - start) / (end - start)));
const lerp = (from, to, progress) => from + (to - from) * progress;

export default function useFilmTransition(sectionRef, stageRef, frameRef, backdropRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const frame = frameRef.current;
        const backdrop = backdropRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const day = section.previousElementSibling;
        const sourceCanvas = day?.querySelector('.home-day-ritual__canvas');
        // A non-interactive copy retains the exact Day bottom composition in
        // this sticky viewport without changing the original Day component.
        const composition = sourceCanvas?.cloneNode(true);
        const visuals = [];
        if (composition) {
            composition.classList.add('home-main-film__day-composition');
            composition.setAttribute('aria-hidden', 'true');
            composition.inert = true;
            composition.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
            backdrop.append(composition);
            for (const element of composition.children) {
                if (element.matches('img, .home-day-ritual__floral-overlay, .home-day-ritual__left-floral, .home-day-ritual__right-floral, .home-day-ritual__foreground-leaf')) {
                    visuals.push({ element, opacity: Number(getComputedStyle(element).opacity) });
                }
            }
        }
        let frameId = 0;
        let width = 0;
        let height = 0;
        let smallScale = 0.24;
        let gap = 0;
        let start = 0;
        let distance = 0;
        let renderedProgress = null;
        let previousTime = 0;

        const paint = (now) => {
            frameId = 0;
            const progress = distance > 0 ? clamp((window.scrollY - start) / distance) : 0;
            const elapsed = previousTime ? Math.min(64, now - previousTime) : 1000 / 60;
            previousTime = now;
            if (renderedProgress === null || reducedMotion.matches) renderedProgress = progress;
            else renderedProgress += (progress - renderedProgress) * (1 - Math.exp(-elapsed / SCRUB_RESPONSE_MS));
            // Taper the small scrub lag continuously to zero at fullscreen.
            // The hold and normal-flow release always use completed bounds,
            // including when a large wheel gesture crosses the section end.
            const maxLag = 0.02 * clamp((EXPAND_END - progress) / (EXPAND_END - EXPAND_START));
            renderedProgress = Math.min(progress + maxLag, Math.max(progress - maxLag, renderedProgress));
            if (Math.abs(progress - renderedProgress) < 0.00001) renderedProgress = progress;
            const expand = clamp((renderedProgress - EXPAND_START) / (EXPAND_END - EXPAND_START));
            const scale = lerp(smallScale, 1, expand);
            const cornerX = width * (1 - smallScale) - gap;
            const cornerY = height * (1 - smallScale) - gap;
            const x = lerp(cornerX, 0, expand);
            const y = lerp(cornerY, 0, expand);
            const opacity = ramp(renderedProgress, 0.02, EXPAND_START);

            // One uniform scale preserves image proportions. Explicit pixel
            // translation moves the frame's top-left to zero at fullscreen.
            // Fullscreen stays intact through the hold and sticky release;
            // the following Night section enters in normal vertical flow.
            frame.style.transform = reducedMotion.matches ? 'none' : `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) scale(${scale.toFixed(6)})`;
            frame.style.opacity = String(reducedMotion.matches ? 1 : opacity);
            const visible = String(!reducedMotion.matches && opacity > 0.001);
            if (frame.dataset.visible !== visible) frame.dataset.visible = visible;
            // Only artwork fades. Paper background and editorial copy remain
            // unchanged; the growing film naturally covers them at fullscreen.
            for (const { element, opacity: initialOpacity } of visuals) {
                element.style.opacity = String(initialOpacity * (reducedMotion.matches ? 1 : 1 - expand));
            }
            section.dataset.scrollProgress = progress.toFixed(6);
            section.dataset.renderProgress = renderedProgress.toFixed(6);
            if (renderedProgress !== progress) frameId = requestAnimationFrame(paint);
            else previousTime = 0;
        };

        const schedulePaint = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };
        const measure = () => {
            cancelAnimationFrame(frameId);
            width = stage.clientWidth;
            height = stage.clientHeight;
            smallScale = width < 700 ? 0.28 : 0.24;
            gap = Math.max(16, Math.min(40, width * 0.02));
            if (composition) {
                composition.style.setProperty('--home-day-scale', getComputedStyle(day).getPropertyValue('--home-day-scale'));
                composition.style.top = `${-Math.max(0, day.offsetHeight - height)}px`;
            }
            const overlap = reducedMotion.matches ? 0 : Math.min(height, section.previousElementSibling?.offsetHeight || 0);
            section.style.setProperty('--film-overlap', `${overlap}px`);
            section.style.setProperty('--film-stage-height', `${height}px`);
            distance = reducedMotion.matches ? 0 : height * SCROLL_VIEWPORTS;
            section.style.setProperty('--film-scroll-distance', `${distance}px`);
            start = section.getBoundingClientRect().top + window.scrollY;
            renderedProgress = null;
            previousTime = 0;
            paint(performance.now());
        };

        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        if (section.previousElementSibling) observer.observe(section.previousElementSibling);
        // Refresh cached document position if an earlier section changes height.
        if (section.parentElement) observer.observe(section.parentElement);
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', measure);
        reducedMotion.addEventListener('change', measure);
        measure();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            composition?.remove();
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', measure);
            reducedMotion.removeEventListener('change', measure);
        };
    }, [sectionRef, stageRef, frameRef, backdropRef]);
}
