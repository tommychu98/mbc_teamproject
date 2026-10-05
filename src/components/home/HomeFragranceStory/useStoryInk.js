import { useLayoutEffect } from 'react';
import { createDampedValue } from '../../../utils/scrollMotion';

const clamp = (value) => Math.min(1, Math.max(0, value));
const INK_START = 0.2;
const INK_END = 0.95;
const INK_SPREAD = 8;
const SCROLL_RANGE_MULTIPLIER = (2.295 * 0.94 * 1.9) / (INK_END - INK_START);
// Keep the English's existing physical scroll distances, then append the
// Korean story before allowing the CSS sticky stage to release.
const ENGLISH_START_DISTANCE = SCROLL_RANGE_MULTIPLIER * INK_START;
const ENGLISH_END_DISTANCE = SCROLL_RANGE_MULTIPLIER * INK_END;
const BREATHING_DISTANCE = 0.2;
const DESCRIPTION_DISTANCE = 0.65;
const HOLD_DISTANCE = 0.25;
const RELEASE_DISTANCE = 0.1;
const DESCRIPTION_START_DISTANCE = ENGLISH_END_DISTANCE + BREATHING_DISTANCE;
const DESCRIPTION_END_DISTANCE = DESCRIPTION_START_DISTANCE + DESCRIPTION_DISTANCE;
const TOTAL_DISTANCE = DESCRIPTION_END_DISTANCE + HOLD_DISTANCE + RELEASE_DISTANCE;
const DESCRIPTION_END_PROGRESS = DESCRIPTION_END_DISTANCE / TOTAL_DISTANCE;
const smoothstep = (value) => value * value * (3 - 2 * value);

export default function useStoryInk(sectionRef, stageRef, titleRef) {
    // Measure before the first paint so extending the document does not move
    // the following sections after they have already been displayed.
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const title = titleRef.current;
        const characters = title.querySelectorAll('.home-fragrance-story__character');
        const characterCount = characters.length;

        let frameId = 0;
        let renderedProgress = null;
        const motion = createDampedValue({ maxLag: 0.06 });

        const paint = (now) => {
            frameId = 0;
            const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
            const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
            const progress = distance > 0 ? clamp((stickyTop - section.getBoundingClientRect().top) / distance) : 0;
            renderedProgress = motion.update(progress, now, false);
            // Bound forward inertia and taper it to zero at Korean completion.
            // Even a fast wheel gesture finishes both texts before Con3 enters;
            // no timed transition is left running after sticky releases.
            const remainingReveal = clamp((DESCRIPTION_END_PROGRESS - progress) / (DESCRIPTION_DISTANCE / TOTAL_DISTANCE));
            renderedProgress = Math.max(progress - remainingReveal * 0.06,
                Math.min(progress + remainingReveal * 0.06, renderedProgress));
            if (Math.abs(progress - renderedProgress) < 0.00001) renderedProgress = progress;

            const renderedDistance = renderedProgress * TOTAL_DISTANCE;
            const inkProgress = clamp((renderedDistance - ENGLISH_START_DISTANCE) / (ENGLISH_END_DISTANCE - ENGLISH_START_DISTANCE));
            // Port Con4's overlapping character ramps and feather unchanged.
            // Query only the English title; Korean is never a paint target.
            const position = inkProgress * (characterCount - 1 + INK_SPREAD);
            characters.forEach((character, index) => {
                const inkAmount = smoothstep(clamp((position - index) / INK_SPREAD));
                character.style.setProperty('--ink-edge', `${(-45 + inkAmount * 190).toFixed(3)}%`);
            });
            section.dataset.scrollProgress = progress.toFixed(6);
            section.dataset.renderProgress = renderedProgress.toFixed(6);
            section.dataset.descriptionProgress = smoothstep(clamp((renderedDistance - DESCRIPTION_START_DISTANCE) / DESCRIPTION_DISTANCE)).toFixed(6);
            if (renderedProgress !== progress) frameId = requestAnimationFrame(paint);
        };

        const schedulePaint = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };

        const measure = () => {
            const stageHeight = stage.offsetHeight;
            section.style.setProperty('--story-stage-height', `${stageHeight}px`);
            const distance = Math.max(window.innerHeight, stageHeight) * TOTAL_DISTANCE;
            section.style.setProperty('--story-scroll-distance', `${distance}px`);
            schedulePaint();
        };

        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', measure);

        measure();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', measure);

        };
    }, [sectionRef, stageRef, titleRef]);
}
