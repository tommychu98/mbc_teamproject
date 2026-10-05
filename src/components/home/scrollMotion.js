// Home-local motion helpers keep this folder independently mergeable.
export const MOTION_RESPONSE = Object.freeze({ background: 0.08, scene: 0.1, foreground: 0.12 });
export const MOTION_SCRUB = Object.freeze({ background: 1.2, scene: 1, foreground: 0.8 });
export const easeInOut = value => value < 0.5
    ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

export function createDampedValue({ response = MOTION_RESPONSE.scene, maxLag = 0.08, epsilon = 0.0001 } = {}) {
    let value = null;
    let previousTime = null;
    let previousTarget = null;
    let changedAt = 0;
    let moving = false;
    return {
        update(target, now = performance.now(), immediate = false) {
            if (!Number.isFinite(now)) now = performance.now();
            if (target !== previousTarget) {
                previousTarget = target;
                changedAt = now;
            }
            const elapsed = previousTime === null ? 1000 / 60 : Math.min(64, Math.max(0, now - previousTime));
            previousTime = now;
            if (value === null || immediate) value = target;
            else {
                const delta = target - value;
                if (Math.abs(delta) > maxLag) value = target - Math.sign(delta) * maxLag;
                value += (target - value) * (1 - (1 - response) ** (elapsed / (1000 / 60)));
                if (Math.abs(target - value) <= epsilon || now - changedAt >= 800) value = target;
            }
            moving = value !== target;
            if (!moving) previousTime = null;
            return value;
        },
        get moving() { return moving; },
    };
}
