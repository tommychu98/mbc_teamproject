import { useLayoutEffect, useRef } from 'react';

const clamp = (value) => Math.min(1, Math.max(0, value));
const FLIGHT_DURATION_MS = 850;
const PATH_SAMPLES = 128;
// One cubic Bezier, with opposing control-point offsets forming one S bend.
const curvePoint = (t, distance, rise) => {
    const a = 3 * (1 - t) ** 2 * t;
    const b = 3 * (1 - t) * t ** 2;
    const c = t ** 3;
    return { x: -distance * (0.18 * a + 0.82 * b + c), y: -rise * (0.78 * a + 0.22 * b + c) };
};
const measureCurve = (distance, rise) => {
    const lengths = [0];
    let previous = curvePoint(0, distance, rise);
    for (let index = 1; index <= PATH_SAMPLES; index++) {
        const point = curvePoint(index / PATH_SAMPLES, distance, rise);
        lengths.push(lengths[index - 1] + Math.hypot(point.x - previous.x, point.y - previous.y));
        previous = point;
    }
    return lengths;
};
const pathParameter = (progress, lengths) => {
    // A single gentle acceleration, with nonzero initial momentum. Arc-length
    // mapping prevents the S bend from slowing the leaf down in the middle.
    const momentum = 0.85 * progress + 0.15 * progress * progress;
    const target = momentum * lengths[PATH_SAMPLES];
    let low = 0;
    let high = PATH_SAMPLES;
    while (high - low > 1) {
        const middle = Math.floor((low + high) / 2);
        if (lengths[middle] < target) low = middle;
        else high = middle;
    }
    const fraction = (target - lengths[low]) / (lengths[high] - lengths[low]);
    return (low + fraction) / PATH_SAMPLES;
};
export default function useLeafExit(sectionRef, leafRef, scale) {
    // Preserve the playback clock across scale changes and effect reinitialization.
    const flightRef = useRef({ startedAt: null, anchorProgress: 0, progress: 0, direction: 0, beyondTrigger: false });
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const leaf = leafRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frameId = 0;
        let start = 0;
        let exitDistance = 0;
        let exitRise = 0;
        let pathLengths = null;
        const flightState = flightRef.current;
        const properties = ['--leaf-exit-x', '--leaf-exit-y', '--leaf-exit-rotation', '--leaf-exit-opacity'];

        const paintLeaf = (element, progress) => {
            const parameter = pathParameter(progress, pathLengths);
            const { x, y } = curvePoint(parameter, exitDistance, exitRise);
            const sway = -0.7 * Math.sin(Math.PI * progress) + 0.2 * progress;
            element.style.setProperty(properties[0], `${x}px`);
            element.style.setProperty(properties[1], `${y}px`);
            element.style.setProperty(properties[2], `${sway}deg`);
            element.style.setProperty(properties[3], '1');
            element.style.willChange = progress > 0 && progress < 1 ? 'transform' : '';
        };
        const advanceClock = (now) => {
            const progress = flightState.direction === 0 ? flightState.progress
                : clamp(flightState.anchorProgress + flightState.direction * (now - flightState.startedAt) / FLIGHT_DURATION_MS);
            flightState.progress = progress;
            if ((flightState.direction < 0 && progress === 0) || (flightState.direction > 0 && progress === 1)) {
                flightState.direction = 0;
            }
            return progress;
        };
        const paint = (now) => {
            frameId = 0;
            const progress = advanceClock(now);
            paintLeaf(leaf, progress);
            // The film holds a visual copy of Day. Synchronize only its leaf
            // so the exited leaf cannot reappear during the existing film fade.
            const heldLeaf = section.nextElementSibling?.querySelector('.home-main-film__day-composition .home-day-ritual__foreground-leaf');
            if (heldLeaf) paintLeaf(heldLeaf, progress);
            leaf.dataset.flightProgress = progress.toFixed(6);
            leaf.dataset.flightState = progress === 0 ? 'idle' : progress === 1 ? 'complete'
                : flightState.direction < 0 ? 'returning' : 'flying';
            if (flightState.direction !== 0) frameId = requestAnimationFrame(paint);
        };
        const checkTrigger = () => {
            // Scroll only selects playback direction when the same boundary is
            // crossed. The clock, not scroll distance or velocity, drives motion.
            const beyondTrigger = window.scrollY >= start;
            if (reducedMotion.matches || beyondTrigger === flightState.beyondTrigger) return;
            const now = performance.now();
            flightState.anchorProgress = advanceClock(now);
            flightState.beyondTrigger = beyondTrigger;
            flightState.direction = beyondTrigger ? 1 : -1;
            flightState.startedAt = now;
            if (!frameId) frameId = requestAnimationFrame(paint);
        };
        const measure = () => {
            properties.forEach((property) => leaf.style.removeProperty(property));
            const sectionBounds = section.getBoundingClientRect();
            const leafBounds = leaf.getBoundingClientRect();
            const dayTop = sectionBounds.top + window.scrollY;
            const travel = sectionBounds.height - window.innerHeight;
            start = travel > 0 ? dayTop + travel * 0.28 : dayTop - sectionBounds.height * 0.2;
            // Include the tiny rotation's swept bounds and a 32px screen gap.
            exitDistance = Math.max(0, leafBounds.right - sectionBounds.left) / scale
                + leaf.offsetHeight * Math.sin(2.5 * Math.PI / 180) + 32 / scale;
            exitRise = leaf.offsetHeight * 0.65;
            pathLengths = measureCurve(exitDistance, exitRise);
            cancelAnimationFrame(frameId);
            frameId = 0;
            checkTrigger();
            if (!frameId) paint(performance.now());
        };
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        if (section.parentElement) observer.observe(section.parentElement);
        window.addEventListener('scroll', checkTrigger, { passive: true });
        window.addEventListener('resize', measure);
        reducedMotion.addEventListener('change', measure);
        measure();
        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', checkTrigger);
            window.removeEventListener('resize', measure);
            reducedMotion.removeEventListener('change', measure);
            properties.forEach((property) => leaf.style.removeProperty(property));
            leaf.style.willChange = '';
        };
    }, [sectionRef, leafRef, scale]);
}
