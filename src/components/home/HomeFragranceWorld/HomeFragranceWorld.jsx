import { useLayoutEffect, useRef } from 'react';
import { createDampedValue, MOTION_RESPONSE } from '../../../utils/scrollMotion';
import { Link } from 'react-router-dom';
import background from './assets/261ea.png';
import orange from './assets/9acfd.png';
import fig from './assets/26c78.png';
import bottle from './assets/61c94.png';
import wood from './assets/6a550.png';
import flowers from './assets/a3b9e.png';
import perfume from './assets/de6e1.png';
import pomegranate from './assets/pomegranate.png';
import rose from './assets/rose.png';
import arrow from './assets/eaf6d.svg';
import mobileArrow from '../HomeDayRitualIsolated/assets/mobile-button-arrow.svg';
import './HomeFragranceWorld.css';

const states = [
    { id: '2863:8174', label: 'Explore the scent that SUITS YOU', lines: [
        'Every fragrance opens a world.', 'A garden, a journey, a distant memory.',
        'Follow the notes that draw you in —', 'and let the unexpected guide you.',
    ] },
    { id: '2863:8182', label: 'Discover the scent you missed', lines: [
        'Begin with a note that draws you in.', 'A rose, warm wood, or something unknown.',
        'Let one impression lead to the next —', 'until a fragrance feels strangely familiar.',
    ] },
];
// Original crops and timing, with entrances alternating left and right.
const images = [
    { id: '2863:8178', src: orange, x: 329, width: 301, height: 339, start: -0.6, duration: 3.9, damping: 210, drift: 18, turn: 3.4, swell: 0.025, phase: 0.2 },
    { id: '2863:8179', src: fig, x: 1199, width: 341, height: 384, start: 1.2, duration: 4, damping: 255, drift: 25, turn: 4.2, swell: 0.032, phase: 1.4 },
    { id: '2863:8180', src: bottle, x: 516, width: 156, height: 259, start: 3, duration: 3.9, damping: 190, drift: 13, turn: 2.6, swell: 0.02, phase: 2.3, crop: true },
    { id: '4259:21920', src: pomegranate, x: 1199, width: 298, height: 298, start: 4.8, duration: 4.1, damping: 220, drift: 18, turn: 3.2, swell: 0.024, phase: 1.1 },
    { id: '2863:8187', src: wood, x: 320, width: 236, height: 344, start: 6.6, duration: 4.5, damping: 235, drift: 22, turn: 4.6, swell: 0.028, phase: 0.8 },
    { id: '2863:8188', src: flowers, x: 1119, width: 257, height: 380, start: 8.4, duration: 4.1, damping: 275, drift: 27, turn: 3.8, swell: 0.035, phase: 1.9 },
    { id: '2863:8189', src: perfume, x: 516, width: 149.952, height: 253.92, start: 10.2, duration: 4, damping: 205, drift: 14, turn: 2.8, swell: 0.022, phase: 2.7 },
    { id: '4259:21917', src: rose, x: 1199, width: 313, height: 313, start: 12, duration: 4.2, damping: 245, drift: 20, turn: 3.6, swell: 0.028, phase: 2.1 },
];
const clamp = value => Math.max(0, Math.min(1, value));
const mobileLines = [
    ['Every fragrance opens a world.', 'A garden, a journey,', 'a distant memory.', 'Follow the notes that', 'draw you in —', 'and let the unexpected guide you.'],
    ['Begin with a note that draws you in.', 'A rose, warm wood,', 'or something unknown.', 'Let one impression', 'lead to the next —', 'until a fragrance feels strangely familiar.'],
];
const mobileImages = [
    { x: 21, width: 87, height: 98, y: 502 },
    { x: 298, width: 113, height: 127, y: 361 },
    { x: 59, width: 61, height: 102, y: 244 },
    { x: 253, width: 90, height: 90, y: 674 },
    { x: 48, width: 96, height: 140, y: 204 },
    { x: 315, width: 83, height: 123, y: 365 },
    { x: 36.98, width: 59.04, height: 99.95, y: 506 },
    { x: 253, width: 90, height: 90, y: 640 },
];
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
// Accelerate through the edges and ease through the text area in the middle.
const floatCurve = value => {
    const eased = smooth(value);
    return clamp(eased + Math.sin(eased * Math.PI * 2) * 0.085);
};

export default function HomeFragranceWorld() {
    const rootRef = useRef(null);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const stage = root.querySelector('.fragrance-world__stage');
        const copies = [...root.querySelectorAll('.fragrance-world__copy')];
        const pictures = [...root.querySelectorAll('.fragrance-world__picture')];

        const mobile = matchMedia('(max-width: 767px)');
        let frame = 0;
        let progress = null;
        const imageProgress = images.map(() => null);
        const sceneMotion = createDampedValue({ response: MOTION_RESPONSE.background, maxLag: 0.05 });
        const imageMotion = images.map(item => createDampedValue({
            response: MOTION_RESPONSE.foreground - (item.damping - 190) / 3000, maxLag: 0.12,
        }));
        let measured = '';
        const render = now => {
            frame = 0;
            const width = stage.clientWidth;
            const height = stage.clientHeight;
            // Keep the 1920 × 1200 Figma canvas at its authored scale and crop
            // only outside the viewport, instead of shrinking the entire scene.
            const scale = mobile.matches ? width / 430 : Math.max(width / 1920, height / 1200);
            const layoutKey = `${width}:${height}:${mobile.matches}`;
            if (measured !== layoutKey) {
                measured = layoutKey;
                root.style.setProperty('--world-scale', scale);
                root.style.setProperty('--world-background-scale', mobile.matches ? 1 : Math.min(width / 1920, height / 1200) / scale);
                root.style.setProperty('--world-mobile-height', `${height / scale}px`);
                pictures.forEach((picture, index) => {
                    const item = mobile.matches ? { ...images[index], ...mobileImages[index] } : images[index];
                    picture.style.left = `${item.x}px`;
                    picture.style.width = `${item.width}px`;
                    picture.style.height = `${item.height}px`;
                });
            }
            const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
            const target = clamp((stickyTop - root.getBoundingClientRect().top) / Math.max(1, root.offsetHeight - height));
            progress = sceneMotion.update(target, now, false);
            const time = progress * 14.8;
            const fade = [1 - smooth((time - 6.5) / 0.6), smooth((time - 7.2) / 0.7)];
            copies.forEach((copy, index) => {
                copy.style.opacity = fade[index];
                copy.style.visibility = fade[index] > 0 ? 'visible' : 'hidden';
                copy.style.filter = `blur(${(1 - fade[index]) * 5}px)`;
                copy.style.transform = `translateY(${((1 - fade[index]) * (index ? 5 : -5))}px)`;
                copy.setAttribute('aria-hidden', fade[index] < 0.5 ? 'true' : 'false');
            });
            pictures.forEach((picture, index) => {
                const item = mobile.matches ? { ...images[index], ...mobileImages[index] } : images[index];
                // Each layer follows raw progress once, avoiding stacked damping.
                const desired = clamp((target * 14.8 - item.start) / item.duration);
                imageProgress[index] = imageMotion[index].update(desired, now, false);
                const t = clamp(imageProgress[index]);
                const path = floatCurve(t);
                // Offscreen bounds account for letterboxing at any viewport ratio.
                const canvasHeight = mobile.matches ? height / scale : 1200;
                const top = (canvasHeight - height / scale) / 2;
                const bottom = canvasHeight - top;
                const slotOffset = mobile.matches ? item.y - (883 - item.height) / 2 : 0;
                const y = bottom + 80 - path * (bottom - top + item.height + 160) + slotOffset * 4 * path * (1 - path);
                const envelope = Math.sin(t * Math.PI);
                const motionStrength = (1) * (mobile.matches ? .35 : 1);
                const drift = Math.sin(t * Math.PI * 1.65 + item.phase) * item.drift * envelope * motionStrength;
                const rotation = Math.sin(t * Math.PI * 1.2 + item.phase) * item.turn * envelope * motionStrength;
                const imageScale = 1 + Math.sin(t * Math.PI) * item.swell * motionStrength;
                picture.style.visibility = t > 0 && t < 1 ? 'visible' : 'hidden';
                picture.style.transform = `translate3d(${drift}px, ${y}px, 0) rotate(${rotation}deg) scale(${imageScale})`;
            });
            if (sceneMotion.moving || imageMotion.some(motion => motion.moving)) frame = requestAnimationFrame(render);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
        const observer = new ResizeObserver(schedule);
        [...root.parentElement.children].forEach(child => observer.observe(child));
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);

        schedule();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);

        };
    }, []);

    return (
        <section ref={rootRef} className="fragrance-world" data-node-id="2863:8173" aria-label="Explore the world of fragrance">
            <div className="fragrance-world__stage">
                <div className="fragrance-world__canvas">
                    <img loading="lazy" decoding="async" fetchPriority="low" className="fragrance-world__background" src={background} alt="" />
                    {states.map(({ id, label, lines }, index) => (
                        <div className="fragrance-world__copy" key={id} data-node-id={id} data-state={index}>
                            <p className="fragrance-world__label"><span /><span className="fragrance-world__desktop-label">{label}</span><span className="fragrance-world__mobile-label">Explore the scent that SUITS YOU</span></p>
                            <div className="fragrance-world__text"><div className="fragrance-world__desktop-lines">{lines.map(line => <p key={line}>{line}</p>)}</div><div className="fragrance-world__mobile-lines">{mobileLines[index].map(line => <p key={line}>{line}</p>)}</div></div>
                            <Link to="/galerie" className="fragrance-world__link">Explore Scents<picture><source media="(max-width: 767px)" srcSet={mobileArrow} /><img loading="lazy" decoding="async" fetchPriority="low" src={arrow} alt="" /></picture></Link>
                        </div>
                    ))}
                    {images.map(item => (
                        <div key={item.id} data-node-id={item.id} className="fragrance-world__picture" style={{ left: item.x, width: item.width, height: item.height }} aria-hidden="true">
                            <div className="fragrance-world__crop"><img loading="lazy" decoding="async" fetchPriority="low" className={item.crop ? 'fragrance-world__bottle-crop' : ''} src={item.src} alt="" draggable="false" /></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
