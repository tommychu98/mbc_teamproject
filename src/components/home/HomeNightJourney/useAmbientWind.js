import { useEffect } from 'react';

// Deterministic, smoothly joined air currents, with no repeating sine cycle.
const random = (seed) => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return (value - Math.floor(value)) * 2 - 1;
};
const current = (time, seed) => {
    const step = Math.floor(time);
    const fraction = time - step;
    const blend = fraction ** 3 * (fraction * (fraction * 6 - 15) + 10);
    const start = random(step + seed);
    return start + (random(step + seed + 1) - start) * blend;
};

export default function useAmbientWind(rootRef, mobile = false) {
    useEffect(() => {
        const root = rootRef.current;
        const sharedMobileScene = mobile ? root.closest('.night-journey__mobile') : null;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const desktop = window.matchMedia(mobile ? '(max-width: 767px)' : '(min-width: 768px)');
        // Connected branches share one wind field in useCon6Wind, including
        // the adjoining Night artwork. Do not add an independent second sway.
        const petals = [...root.querySelectorAll('.night-journey__wind:not([data-motion-type="branch"]):not([data-attached-wind])')].map((element, index) => {
            const image = element.querySelector('img');
            // Use the original asset slot to distinguish distant and foreground petals.
            const imageStyle = getComputedStyle(image);
            const size = Math.sqrt(parseFloat(imageStyle.width) * parseFloat(imageStyle.height));
            const depth = Math.min(1, Math.max(0, (size - 35) / 85));
            return {
                element,
                type: element.dataset.motionType,
                seed: 17 + index * 13,
                phase: index * 0.618033,
                period: (9.8 - depth * 2.5 + (index * 7 % 5) * 0.38)
                    * (element.dataset.motionType === 'petal' ? 1.08 : element.dataset.motionType === 'flower' ? 0.96 : 1),
                drift: (35 + depth * 55) * (0.9 + (index * 11 % 7) * 0.035),
                depth,
                image,
                radius: Math.hypot(parseFloat(imageStyle.width), parseFloat(imageStyle.height)) / 2,
                angle: 0,
                flight: null,
                waitUntil: (index * 0.618033 % 1) * 1.4,
                hasExited: false,
                turn: 3.5 + depth * 3 + (index * 3 % 7) * 0.3,
            };
        });
        let visible = false;
        let frame = 0;
        let previousTime = null;
        let elapsed = 0;

        const enabled = () => visible && !document.hidden && desktop.matches && !reducedMotion.matches;
        const reset = () => {
            petals.forEach((particle) => {
                particle.element.style.transform = '';
                particle.element.style.opacity = '';
                particle.angle = 0;
                particle.flight = null;
                particle.hasExited = false;
                particle.waitUntil = elapsed;
            });
        };
        const render = (now) => {
            frame = 0;
            if (!enabled()) {
                previousTime = null;
                if (reducedMotion.matches || !desktop.matches) reset();
                return;
            }
            const delta = previousTime === null ? 0 : Math.min((now - previousTime) / 1000, 0.1);
            elapsed += delta;
            previousTime = now;
            // Enter softly from the original composition, once per mount.
            const arrival = Math.min(elapsed / 0.8, 1);
            const envelope = arrival * arrival * (3 - 2 * arrival);
            petals.forEach((particle) => {
                const { element, image, type, seed, phase, period, drift, turn, radius, depth } = particle;
                const time = elapsed / period + phase;
                // Ease into each turn without hitting a fixed angular speed,
                // which made drifting leaves look stiff at direction changes.
                const limitTurn = (target) => {
                    particle.angle += (target - particle.angle) * (1 - Math.exp(-delta / .85));
                    return particle.angle;
                };
                if (type === 'botanical' || type === 'branch') {
                    const angle = limitTurn((current(time, seed) + current(time * 1.73, seed + 101) * 0.35)
                        * (type === 'branch' ? 0.55 : turn * 1.2) * envelope);
                    const tilt = current(time * 1.21, seed + 211) * (type === 'branch' ? 0.3 : 1.2) * envelope;
                    element.style.transform = `rotate(${angle.toFixed(3)}deg) skewX(${tilt.toFixed(3)}deg)`;
                    return;
                }
                if (elapsed < particle.waitUntil) return;
                const parent = element.parentElement;
                const canvas = element.closest('.night-journey__canvas');
                const scale = new DOMMatrixReadOnly(getComputedStyle(canvas).transform).a;
                const parentMatrix = new DOMMatrixReadOnly(getComputedStyle(parent).transform);
                const verticalScale = scale * parentMatrix.d;
                // Hidden outgoing panels may be turned over by the existing scroll interaction.
                // Keep their clock alive, and measure the flight when their geometry is upright.
                if (verticalScale <= 0.15) return;
                const bounds = parent.getBoundingClientRect();
                const centerY = bounds.top + bounds.height / 2;
                // A circle encloses the image at every rotation; include lateral drift under
                // the parent's rotation so neither entry nor exit can clip a visible corner.
                const lateral = drift * (type === 'flower' ? 2.05 : type === 'leaf' ? 3.0 : 4.2 + (1 - depth) * 0.8);
                const clearance = (radius + (lateral + drift * .75) * Math.abs(parentMatrix.b)) * scale + 32;
                const above = (-clearance - centerY) / verticalScale;
                // Mobile petals cross the wind/category seam before recycling.
                const exitBottom = sharedMobileScene
                    ? sharedMobileScene.getBoundingClientRect().bottom
                    : window.innerHeight;
                const below = (exitBottom + clearance - centerY) / verticalScale;
                const suspension = type === 'petal' ? 0.72 : type === 'leaf' ? 0.54 : 0.36;
                if (!particle.flight) {
                    const startY = particle.hasExited ? above : 0;
                    // Lower starting slots leave sooner, rather than rushing all objects equally.
                    const distanceRatio = Math.min(1, Math.max(0.3, (below - startY) * verticalScale / window.innerHeight));
                    const distance = Math.abs((below - startY) * verticalScale);
                    // Small petals linger longest; larger leaves keep a little more weight.
                    const pace = (type === 'petal' ? 0.50 : type === 'leaf' ? 0.56 : 0.60)
                        + depth * 0.04;
                    const oldSpeed = type === 'petal' ? 170 : 180;
                    const oldAcceleration = type === 'flower' ? 40 : 35;
                    const maxSpeed = oldSpeed * pace;
                    const maxAcceleration = oldAcceleration * pace * pace;
                    const curve = 0.6 + (random(seed + 71 + Math.floor(elapsed)) + 1) * 0.35;
                    // Also budget the sideways curve projected onto screen Y by the
                    // existing outer rotation, which previously produced speed outliers.
                    const projectedDrift = (lateral + drift * .75) * scale * Math.abs(parentMatrix.b);
                    const sidewaysVelocity = projectedDrift * 3 * Math.max(1, curve + 0.15);
                    const sidewaysAcceleration = projectedDrift * 6 * (2 + 3 * curve);
                    const originalDuration = Math.max(
                        period * distanceRatio,
                        distance * (1 + suspension) / oldSpeed,
                        Math.sqrt(distance * suspension * Math.PI * 2 / oldAcceleration),
                    );
                    // Slow each flight according to its material and depth, then additionally
                    // constrain projected velocity and acceleration for rotated outliers.
                    const duration = Math.max(
                        originalDuration / pace,
                        (distance * (1 + suspension) + sidewaysVelocity) / maxSpeed,
                        Math.sqrt((distance * suspension * Math.PI * 2 + sidewaysAcceleration) / maxAcceleration),
                    );
                    particle.flight = {
                        start: elapsed,
                        startY,
                        endY: below,
                        duration,
                        direction: random(seed + Math.floor(elapsed)) < 0 ? -1 : 1,
                        curve,
                    };
                }
                const flight = particle.flight;
                // Follow viewport changes without restarting time or altering category geometry.
                flight.endY = below;
                const progress = Math.min(1, (elapsed - flight.start) / flight.duration);
                const inverse = 1 - progress;
                // Cubic control points describe one long S/C curve without short zigzags.
                const sideways = 3 * inverse * inverse * progress
                    - 3 * inverse * progress * progress * flight.curve
                    + progress ** 3 * 0.15;
                const air = current(time * 0.27, seed + 307);
                const opening = Math.min(1, progress / .12);
                const release = opening * opening * (3 - 2 * opening);
                // A shared breeze carries the whole scene, while each light
                // fragment flutters at its own pace along the broad flight path.
                const breeze = Math.sin(elapsed * .78) * .3 + Math.sin(elapsed * 1.14 + .7) * .14;
                const flutterPhase = elapsed * (type === 'leaf' ? 1.12 : .88) + phase * Math.PI * 2;
                const flutter = Math.sin(flutterPhase) * (type === 'flower' ? .13 : .24);
                const x = flight.direction * lateral * sideways
                    + (air * .18 + breeze * .45 + flutter) * drift * release;
                // Integrate one broad air-resistance pulse. Velocity remains positive
                // (minimum 28% for petals), with no stops or segment boundaries.
                const breath = (phase % 1 - 0.5) * 0.8;
                const descent = progress - suspension / (Math.PI * 2)
                    * (Math.sin(progress * Math.PI * 2 + breath) - Math.sin(breath));
                const y = flight.startY + (flight.endY - flight.startY) * descent
                    + Math.sin(flutterPhase + .7) * drift * .055 * release;
                const orientation = type === 'flower' ? 0.45 : type === 'leaf' ? 0.8 : 0.6;
                const angle = limitTurn(((air * 1.6 + current(time * 0.38, seed + 419) * .65) * turn * orientation
                    + Math.cos(flutterPhase) * (type === 'leaf' ? 12 : type === 'petal' ? 8 : 4)) * release);
                const flutterScale = 1 - Math.sin(flutterPhase) ** 2 * (type === 'leaf' ? .075 : .035) * release;
                element.style.transform = `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotate(${angle.toFixed(3)}deg) scaleX(${flutterScale.toFixed(4)})`;
                // Do not fade or reset until the entire rendered image is below the viewport.
                if (progress === 1 && image.getBoundingClientRect().top > exitBottom) {
                    particle.hasExited = true;
                    particle.flight = null;
                    particle.waitUntil = elapsed + 1.1 + (phase % 1) * 2.8;
                }
            });
            frame = window.requestAnimationFrame(render);
        };
        const sync = () => {
            if (frame) window.cancelAnimationFrame(frame);
            frame = 0;
            previousTime = null;
            if (reducedMotion.matches || !desktop.matches) {
                reset();
            }
            // Preserve the shared clock through category changes and visibility pauses.
            if (enabled()) frame = window.requestAnimationFrame(render);
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
        });
        observer.observe(sharedMobileScene || root.querySelector('.night-journey__stage') || root);
        document.addEventListener('visibilitychange', sync);
        reducedMotion.addEventListener('change', sync);
        desktop.addEventListener('change', sync);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
            reducedMotion.removeEventListener('change', sync);
            desktop.removeEventListener('change', sync);
            if (frame) window.cancelAnimationFrame(frame);
            reset();
        };
    }, [rootRef, mobile]);
}
