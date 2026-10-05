import { useLayoutEffect, useRef } from 'react';
import createDraperyMesh from './createDraperyMesh';

const DURATION = 1100;
const clamp = value => Math.max(0, Math.min(1, value));
// One continuous easing with zero endpoint velocity and acceleration.
const ease = value => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };

export default function useDraperyPull(sectionRef, draperyRef) {
    const motionRef = useRef({ progress: 0, velocity: 0, target: 0 });
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const fabric = draperyRef.current;
        let mesh = null;

        const motion = motionRef.current;
        let frame = 0;
        let previous = 0;
        let threshold = 0;
        let distance = 0;

        const draw = () => {
            const p = motion.progress;
            // Preserve the drape and move continuously; only the attachment
            // gathers slightly, with a small delayed response in the hem.
            const pull = ease(p);
            // Preserve the illustration's folds: a shallow lift leads the pull,
            // while tiny gathering develops later and releases on unfolding.
            // The single smooth path has no holds or separate easing segments.
            const lift = 16 * p * p * (1 - p) * (1 - p);
            const tension = Math.sin(Math.PI * pull);
            const scale = section.clientWidth / 1920;
            mesh?.draw(p);
            fabric.style.transform = `translate3d(${distance * pull}px, ${-18 * lift * scale}px, 0) rotate(${0.15 * tension}deg)`;
            fabric.style.willChange = p > 0 && p < 1 ? 'transform' : '';
            fabric.dataset.draperyProgress = p.toFixed(6);
            fabric.dataset.draperyState = p === 0 ? 'original' : p === 1 ? 'gathered'
                : motion.target ? 'gathering' : 'unfolding';
        };
        const paint = now => {
            frame = 0;
            const elapsed = previous ? Math.min(48, now - previous) : 16;
            previous = now;
            // Smooth velocity through reversals: never restart or reset the
            // pose. Scroll chooses the destination; this clock drives playback.
            const direction = motion.target ? 1 : -1;
            motion.velocity += (direction / DURATION - motion.velocity) * (1 - Math.exp(-elapsed / 75));
            motion.progress = clamp(motion.progress + motion.velocity * elapsed);
            draw();
            if (motion.progress !== motion.target) frame = requestAnimationFrame(paint);
            else { motion.velocity = 0; previous = 0; }
        };
        const check = () => {
            const target = window.scrollY >= threshold ? 1 : 0;

            if (target === motion.target) return;
            motion.target = target;
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const measure = () => {
            const top = section.getBoundingClientRect().top + window.scrollY;
            // Trigger after the hanging composition enters the viewport;
            // do not add a sticky hold or any extra document scroll distance.
            threshold = top + fabric.offsetTop + fabric.offsetHeight * 0.42 - window.innerHeight * 0.65;
            distance = section.clientWidth - fabric.offsetLeft + 80 * section.clientWidth / 1920;
            fabric.dataset.draperyTrigger = threshold.toFixed(2);
            check();
            draw();
            if ((motion.progress !== motion.target) && !frame) {
                previous = 0;
                frame = requestAnimationFrame(paint);
            }
        };
        // Defer the WebGL context and texture upload until this lower section
        // approaches the viewport; its static artwork keeps the same layout.
        const warmup = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            mesh = createDraperyMesh(fabric.querySelector('canvas'), fabric.querySelector('img'));
            draw();
            warmup.disconnect();
        }, { rootMargin: '900px' });
        warmup.observe(section);
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        if (section.parentElement) observer.observe(section.parentElement);
        window.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', measure);

        measure();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            warmup.disconnect();
            window.removeEventListener('scroll', check);
            window.removeEventListener('resize', measure);

            mesh?.dispose();
            fabric.style.removeProperty('transform');
            fabric.style.removeProperty('will-change');
        };
    }, [sectionRef, draperyRef]);
}
