import { useEffect } from 'react';

// Four visual groups follow the connected branch in the supplied screenshot.
// The large PNG stays intact; the six existing continuation assets form B/C/D.
const groups = [
    { name: 'A', assets: [], shift: 16, lift: 6, bend: 2, angle: 0.75, tilt: 0.10, point: [150, -150] },
    { name: 'B', assets: ['element-56.png', 'element-52.png', 'element-45.png'], shift: 17, lift: 7, bend: -1.5, angle: 0.95, tilt: 0.12, point: [1220, 360], pivot: [1127, 260] },
    { name: 'C', assets: ['element-57.png'], shift: 14, lift: 8, bend: 1.5, angle: 1.1, tilt: 0.14, point: [1510, 620], pivot: [1465, 558] },
    { name: 'D', assets: ['element-28.png', 'element-07.png'], shift: 18, lift: 9, bend: -1, angle: 1.25, tilt: 0.16, point: [1710, 650], pivot: [1601, 649] },
];
const waveDuration = 0.96;

export default function useCon6Wind(rootRef) {
    useEffect(() => {
        const root = rootRef.current;
        const panel = root.querySelector('[data-node-id="2863:8195"]');
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const desktop = matchMedia('(min-width: 768px)');
        const fragments = [...panel.querySelectorAll('.night-journey__botanical-response')];
        const foreground = panel.querySelector('.night-journey__foreground-flowers');
        // These are two clipped views of the SAME PNG at the section boundary.
        // Synchronize the adjoining view from this hook; no neighbouring layout or
        // component code changes, and no independently animated seam can appear.
        const adjoining = root.previousElementSibling?.querySelector('.home-night-ritual__foreground-flowers');
        let distance = 0;
        const objects = groups.map((group, index) => {
            if (index) {
                const previous = groups[index - 1].point;
                // Include the bend through the large PNG's central branch.
                const path = index === 1 ? [previous, [650, 120], group.point] : [previous, group.point];
                for (let i = 1; i < path.length; i++) {
                    distance += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
                }
            }
            const selected = index === 0 ? [foreground, adjoining].filter(Boolean) : fragments.filter(element =>
                group.assets.includes(`${element.querySelector('img').getAttribute('src').split('/').pop().match(/^element-\d+/)?.[0]}.png`));
            const elements = selected.map(element => {
                const original = { transform: element.style.transform, origin: element.style.transformOrigin };
                if (index === 0) element.style.transformOrigin = '50% 50%';
                else {
                    const slot = element.closest('[data-night-particle]');
                    element.style.transformOrigin = `${group.pivot[0] - parseFloat(slot.style.left)}px ${group.pivot[1] - parseFloat(slot.style.top)}px`;
                }
                element.dataset.connectedWindGroup = group.name;
                return { element, original, adjoining: element === adjoining };
            });
            return { ...group, elements, distance, value: 0, velocity: 0, flow: 0 };
        });
        objects.forEach(object => { object.delay = object.distance / distance * waveDuration; });
        let frame = 0;
        let previousTime = null;
        let lastScroll = scrollY;
        const impulse = { forward: 0, reverse: 0 };
        const wind = { forward: 0, reverse: 0 };
        const history = [];
        const enabled = () => desktop.matches && !reduced.matches && !document.hidden;
        const clear = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            previousTime = null;
            impulse.forward = impulse.reverse = wind.forward = wind.reverse = 0;
            history.length = 0;
            objects.forEach(object => {
                object.value = object.velocity = object.flow = 0;
                object.elements.forEach(({ element, original }) => { element.style.transform = original.transform; });
            });
        };
        const render = now => {
            frame = 0;
            if (!enabled()) { clear(); return; }
            const dt = previousTime === null ? 1 / 60 : Math.min((now - previousTime) / 1000, 0.05);
            previousTime = now;
            for (const direction of ['forward', 'reverse']) {
                impulse[direction] *= Math.exp(-dt / 0.8);
                wind[direction] += (impulse[direction] - wind[direction]) * (1 - Math.exp(-dt / 0.28));
            }
            history.push({ time: now, ...wind });
            while (history.length > 2 && history[1].time < now - 1200) history.shift();
            const delayed = (direction, time) => {
                if (time < history[0].time) return 0;
                for (let i = 0; i < history.length - 1; i++) {
                    const a = history[i], b = history[i + 1];
                    if (a.time <= time && b.time >= time) {
                        return a[direction] + (b[direction] - a[direction]) * (time - a.time) / (b.time - a.time);
                    }
                }
                return wind[direction];
            };
            let moving = impulse.forward + impulse.reverse + wind.forward + wind.reverse > 0.001;
            objects.forEach(object => {
                // Separate wave histories reverse the spatial flow without switching a
                // running trajectory's delay or resetting its position/velocity.
                const forward = delayed('forward', now - object.delay * 1000);
                const reverse = delayed('reverse', now - (waveDuration - object.delay) * 1000);
                const target = Math.max(-0.85, Math.min(1, forward - reverse));
                // Exact critically damped response: continuous velocity, no overshoot/bounce.
                const stiffness = 4;
                const displacement = object.value - target;
                const combined = object.velocity + stiffness * displacement;
                const decay = Math.exp(-stiffness * dt);
                object.value = target + (displacement + combined * dt) * decay;
                object.velocity = (object.velocity - stiffness * combined * dt) * decay;
                const value = object.value;
                // A gently lagging vertical component describes a shallow curved
                // drift. It keeps flowing briefly after X eases, rather than retracing
                // a straight line or introducing a periodic sway/rocking cycle.
                object.flow += (value - object.flow) * (1 - Math.exp(-dt / 0.38));
                const x = value * object.shift;
                const y = object.flow * object.lift + object.bend * value * (1 - Math.abs(value));
                const orientation = value * 0.55 + object.flow * 0.45;
                object.elements.forEach(({ element, adjoining: isAdjoining }) => {
                    // The adjoining canvas uses CSS-scaled dimensions, while Con6's
                    // canvas scales 1920px slots. Match their physical displacement.
                    const scale = isAdjoining ? root.clientWidth / 1920 : 1;
                    element.style.transform = `translate3d(${(x * scale).toFixed(4)}px, ${(y * scale).toFixed(4)}px, 0) rotate(${(orientation * object.angle).toFixed(4)}deg) skewX(${(orientation * object.tilt).toFixed(4)}deg)`;
                });
                moving ||= Math.abs(value) + Math.abs(object.velocity) + Math.abs(object.flow) > 0.001;
            });
            if (moving) frame = requestAnimationFrame(render);
            else clear();
        };
        const onScroll = () => {
            const distance = scrollY - lastScroll;
            lastScroll = scrollY;
            const bounds = panel.getBoundingClientRect();
            if (!enabled() || bounds.top >= innerHeight || bounds.bottom <= 0
                || bounds.right < root.clientWidth * 0.15 || bounds.left > innerWidth) return;
            // Give slow input a visible response, while saturating even a very fast wheel.
            const direction = distance < 0 ? 'reverse' : 'forward';
            const opposite = distance < 0 ? 'forward' : 'reverse';
            impulse[direction] = Math.min(distance < 0 ? 0.85 : 1,
                impulse[direction] + Math.tanh(Math.abs(distance) / 45) * 0.72);
            impulse[opposite] *= 0.75;
            if (!frame) frame = requestAnimationFrame(render);
        };
        const onAvailability = () => { lastScroll = scrollY; if (!enabled()) clear(); };
        addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('visibilitychange', onAvailability);
        reduced.addEventListener('change', onAvailability);
        desktop.addEventListener('change', onAvailability);
        return () => {
            removeEventListener('scroll', onScroll);
            document.removeEventListener('visibilitychange', onAvailability);
            reduced.removeEventListener('change', onAvailability);
            desktop.removeEventListener('change', onAvailability);
            clear();
            objects.forEach(object => object.elements.forEach(({ element, original }) => {
                element.style.transformOrigin = original.origin;
                delete element.dataset.connectedWindGroup;
            }));
        };
    }, [rootRef]);
}
