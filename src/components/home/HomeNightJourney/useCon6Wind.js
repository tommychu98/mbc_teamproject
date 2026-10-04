import { useEffect } from 'react';

// The large PNG stays intact; each of its six continuation pieces follows
// the same travelling wave, with increasing flexibility toward the tips.
const groups = [
    { name: 'A', assets: [], shift: 16, lift: 6, bend: 2, angle: 0.75, tilt: 0.10, point: [150, -150] },
    { name: 'B1', assets: ['element-56.png'], shift: 12, lift: 9, bend: -1, angle: 1.4, tilt: .12, point: [1180, 305], pivot: [1127, 260] },
    { name: 'B2', assets: ['element-52.png'], shift: 13, lift: 11, bend: -1, angle: 1.7, tilt: .14, point: [1260, 385], pivot: [1213, 350] },
    { name: 'B3', assets: ['element-45.png'], shift: 14, lift: 12, bend: 1, angle: 2, tilt: .16, point: [1380, 500], pivot: [1290, 406] },
    { name: 'C', assets: ['element-57.png'], shift: 14, lift: 14, bend: 1, angle: 2.3, tilt: .18, point: [1510, 620], pivot: [1465, 558] },
    { name: 'D1', assets: ['element-28.png'], shift: 15, lift: 15, bend: -1, angle: 2.6, tilt: .2, point: [1660, 690], pivot: [1601, 649] },
    { name: 'D2', assets: ['element-07.png'], shift: 16, lift: 17, bend: -1, angle: 2.9, tilt: .22, point: [1780, 650], pivot: [1733, 589] },
];
const waveDuration = .65;

export default function useCon6Wind(rootRef, mobile = false) {
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
            return { ...group, elements, distance, value: 0, velocity: 0, flow: 0, vertical: 0 };
        });
        objects.forEach(object => { object.delay = object.distance / distance * waveDuration; });
        let frame = 0;
        let previousTime = null;
        let lastScroll = scrollY;
        let elapsed = 0;
        const visibleElements = new Set();
        const impulse = { forward: 0, reverse: 0 };
        const wind = { forward: 0, reverse: 0 };
        const history = [];
        const enabled = () => visibleElements.size > 0 && desktop.matches && !reduced.matches && !document.hidden;
        const clear = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            previousTime = null;
            impulse.forward = impulse.reverse = wind.forward = wind.reverse = 0;
            history.length = 0;
            objects.forEach(object => {
                object.value = object.velocity = object.flow = object.vertical = 0;
                object.elements.forEach(({ element, original }) => { element.style.transform = original.transform; });
            });
        };
        const render = now => {
            frame = 0;
            if (!enabled()) { clear(); return; }
            const dt = previousTime === null ? 1 / 60 : Math.min((now - previousTime) / 1000, 0.05);
            previousTime = now;
            elapsed += dt;
            for (const direction of ['forward', 'reverse']) {
                impulse[direction] *= Math.exp(-dt / 0.8);
                wind[direction] += (impulse[direction] - wind[direction]) * (1 - Math.exp(-dt / 0.28));
            }
            history.push({ time: now, ...wind });
            while (history.length > 2 && history[1].time < now - (waveDuration + .2) * 1000) history.shift();
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
            objects.forEach(object => {
                // Separate wave histories reverse the spatial flow without switching a
                // running trajectory's delay or resetting its position/velocity.
                const forward = delayed('forward', now - object.delay * 1000);
                const reverse = delayed('reverse', now - (waveDuration - object.delay) * 1000);
                const time = elapsed - object.delay;
                const arrival = Math.min(1, elapsed / 2);
                const envelope = arrival * arrival * (3 - 2 * arrival);
                // Slow overlapping currents avoid a mechanical repeating rock.
                // The same current reaches connected tips slightly later.
                const breeze = (.28 * Math.sin(time * .55)
                    + .075 * Math.sin(time * .83 + .7)) * envelope;
                const target = Math.max(-.5, Math.min(.5, breeze + (forward - reverse) * .2));
                // Exact critically damped response: continuous velocity, no overshoot/bounce.
                const stiffness = 2.2;
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
                // A softly lagging upward/downward wave gives each continuation
                // an elliptical sway rather than a rigid sideways translation.
                const verticalTarget = object.name === 'A' ? 0
                    : .12 * Math.sin(time * .55 + .6) * envelope;
                object.vertical += (verticalTarget - object.vertical) * (1 - Math.exp(-dt / .9));
                // Keep most movement shared so neighbouring pieces remain
                // visually connected. Only the tips have a small extra bend.
                const x = value * (16 + (object.shift - 16) * .25);
                const y = object.flow * 6 + object.vertical * object.lift * .4
                    + object.bend * value * (1 - Math.abs(value)) * .3;
                const orientation = value * .55 + object.flow * .45 + object.vertical * .35;
                object.elements.forEach(({ element, adjoining: isAdjoining }) => {
                    // The adjoining canvas uses CSS-scaled dimensions, while Con6's
                    // canvas scales 1920px slots. Match their physical displacement.
                    const scale = isAdjoining ? root.clientWidth / 1920 : 1;
                    const angle = orientation * (object.name === 'A' ? object.angle : .75 + (object.angle - .75) * .3);
                    element.style.transform = `translate3d(${(x * scale).toFixed(4)}px, ${(y * scale).toFixed(4)}px, 0) rotate(${angle.toFixed(4)}deg)`;
                });
            });
            frame = requestAnimationFrame(render);
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
            // A wheel gesture adds a soft gust rather than stacking a shove
            // on every event (which differs between mouse and trackpad).
            impulse[direction] = Math.max(impulse[direction], Math.tanh(Math.abs(distance) / 80) * .6);
            impulse[opposite] *= .9;
            if (!frame) frame = requestAnimationFrame(render);
        };
        const onAvailability = () => {
            lastScroll = scrollY;
            if (!enabled()) clear();
            else if (!frame) frame = requestAnimationFrame(render);
        };
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) visibleElements.add(entry.target);
                else visibleElements.delete(entry.target);
            });
            onAvailability();
        });
        observer.observe(panel);
        if (adjoining) observer.observe(adjoining);
        addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('visibilitychange', onAvailability);
        reduced.addEventListener('change', onAvailability);
        desktop.addEventListener('change', onAvailability);
        return () => {
            observer.disconnect();
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
    // The neighbouring Night DOM is replaced at the mobile breakpoint.
    // Rebind its continuation instead of retaining the removed desktop element.
    }, [rootRef, mobile]);
}
