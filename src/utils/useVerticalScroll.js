import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createDampedValue } from './scrollMotion';

// Scenes driven by native scroll/IntersectionObserver rather than ScrollTrigger.
// Keep these native from viewport entry to exit, including their reveal/exit tails.
const NATIVE_SCENES = [
    '[data-native-scroll]', '.home-intro', '.home-mobile-story',
    '.home-fragrance-story', '.home-perfume-history', '.home-scent-memory',
    '.home-day-ritual', '.home-night-ritual', '.night-journey',
    '.scent-sequence', '.fragrance-world',
    '.diptyque-history__opening', '.history-fabric', '.history-fabric-mobile',
    '.history-objects', '.history-collect-mobile', '.history-scent-scroll',
    '.history-scent-mobile', '.ftp-arch-scroll', '.ftp-story-scroll',
    '.ftp-renewal-scroll', '.ftp-mobile-ambition', '.ftp-mobile-renewal',
].join(',');

export default function useVerticalScroll(pathname) {
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        const motion = createDampedValue({ response: 0.1, maxLag: 180, epsilon: 0.5 });
        let ranges = [];
        let dirty = true;
        let frame = 0;
        let target = window.scrollY;
        let lastWritten = target;
        let lastInput = 0;
        let direction = 0;

        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            target = lastWritten = window.scrollY;
            direction = 0;
            motion.update(target, performance.now(), true);
        };
        const invalidate = () => { dirty = true; };
        const measure = () => {
            const scenes = new Set(document.querySelectorAll(NATIVE_SCENES));
            ScrollTrigger.getAll().forEach(trigger => {
                const node = trigger.pin || trigger.trigger;
                if (!(node instanceof Element)) return;
                const section = node.closest('section');
                // Do not turn an outer page wrapper into a page-wide exclusion.
                scenes.add(section && !section.querySelector('section') ? section : node);
            });
            // Exclude video owners and CSS sticky scenes, but not sticky navigation.
            document.querySelectorAll('.app__main video').forEach(video => {
                scenes.add(video.closest('section') || video.parentElement);
            });
            document.querySelectorAll('.app__main [class*="stage"], .app__main [class*="viewport"], .app__main [class*="sticky"]').forEach(node => {
                if (getComputedStyle(node).position === 'sticky') {
                    scenes.add(node.parentElement);
                }
            });
            const y = window.scrollY;
            ranges = [...scenes].flatMap(node => {
                const rect = node.getBoundingClientRect();
                return rect.height > 0 && rect.width > 0
                    ? [[rect.top + y - innerHeight, rect.bottom + y]] : [];
            });
            dirty = false;
        };
        const isSpecial = (from, to) => {
            if (dirty) measure();
            const lo = Math.min(from, to);
            const hi = Math.max(from, to);
            const overlaps = (start, end) => hi >= start - 1 && lo <= end + 1;
            if (ranges.some(([start, end]) => overlaps(start, end))) return true;
            // Read registered ranges without changing triggers, pins or scrub settings.
            return ScrollTrigger.getAll().some(trigger => trigger.enabled
                && overlaps(trigger.start, trigger.end));
        };
        const documentLocked = () => document.hidden
            || [root, body].some(node => {
                const style = getComputedStyle(node);
                return ['hidden', 'clip'].includes(style.overflowY) || style.position === 'fixed';
            });
        const nativeTarget = event => event.composedPath().some(node => {
            if (!(node instanceof Element) || node === body || node === root) return false;
            if (node.matches('[data-native-scroll], input, textarea, select, [contenteditable="true"], [role="dialog"], dialog')) return true;
            const style = getComputedStyle(node);
            return (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1)
                || (/(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1);
        });
        const render = now => {
            frame = 0;
            const actual = window.scrollY;
            // An anchor, scrollbar, focus or another interaction owns any external move.
            if (Math.abs(actual - lastWritten) > 1 || documentLocked() || isSpecial(actual, target)) {
                stop();
                return;
            }
            target = Math.max(0, Math.min(target, root.scrollHeight - innerHeight));
            const next = motion.update(target, now, now - lastInput >= 480);
            window.scrollTo({ top: next, behavior: 'instant' });
            lastWritten = window.scrollY;
            ScrollTrigger.update();
            if (motion.moving) frame = requestAnimationFrame(render);
        };
        const onWheel = event => {
            // Bubble on window: existing section handlers get first refusal.
            if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey
                || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)
                || documentLocked() || nativeTarget(event)) {
                stop();
                return;
            }
            const actual = window.scrollY;
            if (Math.abs(actual - lastWritten) > 1) stop();
            const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
            const nextDirection = Math.sign(delta);
            // Reversals discard the old tail immediately instead of fighting the user.
            const base = !frame || nextDirection !== direction ? actual : target;
            const nextTarget = Math.max(0, Math.min(base + delta, root.scrollHeight - innerHeight));
            if (isSpecial(actual, nextTarget)) {
                stop();
                return;
            }
            event.preventDefault();
            lastInput = performance.now();
            if (!frame || nextDirection !== direction) motion.update(actual, lastInput, true);
            target = nextTarget;
            direction = nextDirection;
            if (!frame) frame = requestAnimationFrame(render);
        };

        const resize = new ResizeObserver(invalidate);
        resize.observe(body);
        const mutations = new MutationObserver(invalidate);
        mutations.observe(document.querySelector('.app__main') || body, { childList: true, subtree: true });
        ScrollTrigger.addEventListener('refresh', invalidate);
        window.addEventListener('resize', invalidate);
        window.addEventListener('load', invalidate, true);
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('pointerdown', stop, true);
        window.addEventListener('touchstart', stop, { passive: true, capture: true });
        window.addEventListener('keydown', stop, true);
        window.addEventListener('blur', stop);
        document.addEventListener('visibilitychange', stop);
        return () => {
            stop();
            resize.disconnect();
            mutations.disconnect();
            ScrollTrigger.removeEventListener('refresh', invalidate);
            window.removeEventListener('resize', invalidate);
            window.removeEventListener('load', invalidate, true);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('pointerdown', stop, true);
            window.removeEventListener('touchstart', stop, true);
            window.removeEventListener('keydown', stop, true);
            window.removeEventListener('blur', stop);
            document.removeEventListener('visibilitychange', stop);
        };
    }, [pathname]);
}
