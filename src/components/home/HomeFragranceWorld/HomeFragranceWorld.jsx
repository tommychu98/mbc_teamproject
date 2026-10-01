import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import background from './assets/261ea.png';
import orange from './assets/9acfd.png';
import fig from './assets/26c78.png';
import bottle from './assets/61c94.png';
import wood from './assets/6a550.png';
import flowers from './assets/a3b9e.png';
import perfume from './assets/de6e1.png';
import arrow from './assets/eaf6d.svg';
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
// Figma slots and crops, on the original 1920 × 1200 canvas.
const images = [
    { id: '2863:8178', src: orange, x: 329, width: 301, height: 339, start: 0.8, duration: 1.72, damping: 210, drift: 18, turn: 3.4, swell: 0.025, phase: 0.2 },
    { id: '2863:8179', src: fig, x: 1199, width: 341, height: 384, start: 2.65, duration: 1.86, damping: 255, drift: 25, turn: 4.2, swell: 0.032, phase: 1.4 },
    { id: '2863:8180', src: bottle, x: 516, width: 156, height: 259, start: 4.55, duration: 1.7, damping: 190, drift: 13, turn: 2.6, swell: 0.02, phase: 2.3, crop: true },
    { id: '2863:8187', src: wood, x: 320, width: 236, height: 344, start: 8.5, duration: 1.78, damping: 235, drift: 22, turn: 4.6, swell: 0.028, phase: 0.8 },
    { id: '2863:8188', src: flowers, x: 1119, width: 257, height: 380, start: 10.35, duration: 1.9, damping: 275, drift: 27, turn: 3.8, swell: 0.035, phase: 1.9 },
    { id: '2863:8189', src: perfume, x: 1247.04, width: 149.952, height: 253.92, start: 12.28, duration: 1.72, damping: 205, drift: 14, turn: 2.8, swell: 0.022, phase: 2.7 },
];
const clamp = value => Math.max(0, Math.min(1, value));
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
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let progress = null;
        const imageProgress = images.map(() => null);
        let previous = 0;
        const render = now => {
            frame = 0;
            const width = stage.clientWidth;
            const height = stage.clientHeight;
            // Keep the 1920 × 1200 Figma canvas at its authored scale and crop
            // only outside the viewport, instead of shrinking the entire scene.
            const scale = Math.max(width / 1920, height / 1200);
            root.style.setProperty('--world-scale', scale);
            const target = clamp(-root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - height));
            const elapsed = previous ? Math.min(64, now - previous) : 16;
            previous = now;
            if (progress === null) {
                progress = target;
            } else {
                // Keep global lag short on fast wheels while preserving a soft stop.
                const difference = target - progress;
                if (Math.abs(difference) > 0.05) progress = target - Math.sign(difference) * 0.05;
                progress += (target - progress) * (1 - Math.exp(-elapsed / 145));
                if (Math.abs(target - progress) < 0.00005) progress = target;
            }
            const time = progress * 14.8;
            const fade = [1 - smooth((time - 6.5) / 0.6), smooth((time - 7.2) / 0.7)];
            copies.forEach((copy, index) => {
                copy.style.opacity = fade[index];
                copy.style.visibility = fade[index] > 0 ? 'visible' : 'hidden';
                copy.style.filter = reduced.matches ? 'none' : `blur(${(1 - fade[index]) * 5}px)`;
                copy.style.transform = `translateY(${reduced.matches ? 0 : (1 - fade[index]) * (index ? 5 : -5)}px)`;
                copy.setAttribute('aria-hidden', fade[index] < 0.5 ? 'true' : 'false');
            });
            pictures.forEach((picture, index) => {
                const item = images[index];
                const desired = clamp((time - item.start) / item.duration);
                if (imageProgress[index] === null) {
                    imageProgress[index] = desired;
                } else {
                    let difference = desired - imageProgress[index];
                    // Per-image damping gives each asset its own weight. Cap the
                    // lag so fast scrolling and reverse scrolling stay controlled.
                    if (Math.abs(difference) > 0.2) {
                        imageProgress[index] = desired - Math.sign(difference) * 0.2;
                        difference = desired - imageProgress[index];
                    }
                    imageProgress[index] += difference * (1 - Math.exp(-elapsed / item.damping));
                    if (Math.abs(desired - imageProgress[index]) < 0.0005) imageProgress[index] = desired;
                }
                const t = clamp(imageProgress[index]);
                const path = floatCurve(t);
                // Offscreen bounds account for letterboxing at any viewport ratio.
                const top = (1200 - height / scale) / 2;
                const bottom = 1200 - top;
                const y = bottom + 80 - path * (bottom - top + item.height + 160);
                const envelope = Math.sin(t * Math.PI);
                const motionStrength = reduced.matches ? 0.35 : 1;
                const drift = Math.sin(t * Math.PI * 1.65 + item.phase) * item.drift * envelope * motionStrength;
                const rotation = Math.sin(t * Math.PI * 1.2 + item.phase) * item.turn * envelope * motionStrength;
                const imageScale = 1 + Math.sin(t * Math.PI) * item.swell * motionStrength;
                picture.style.visibility = t > 0 && t < 1 ? 'visible' : 'hidden';
                picture.style.transform = `translate3d(${drift}px, ${y}px, 0) rotate(${rotation}deg) scale(${imageScale})`;
            });
            const imagesMoving = imageProgress.some((value, index) => value !== null
                && Math.abs(clamp((time - images[index].start) / images[index].duration) - value) > 0.00005);
            if (Math.abs(target - progress) > 0.00005 || imagesMoving) frame = requestAnimationFrame(render);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
        const observer = new ResizeObserver(schedule);
        [...root.parentElement.children].forEach(child => observer.observe(child));
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        reduced.addEventListener('change', schedule);
        schedule();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            reduced.removeEventListener('change', schedule);
        };
    }, []);

    return (
        <section ref={rootRef} className="fragrance-world" data-node-id="2863:8173" aria-label="Explore the world of fragrance">
            <div className="fragrance-world__stage">
                <div className="fragrance-world__canvas">
                    <img className="fragrance-world__background" src={background} alt="" />
                    {states.map(({ id, label, lines }, index) => (
                        <div className="fragrance-world__copy" key={id} data-node-id={id} data-state={index}>
                            <p className="fragrance-world__label"><span />{label}</p>
                            <div className="fragrance-world__text">{lines.map(line => <p key={line}>{line}</p>)}</div>
                            <Link to="/shop?category=fragrances" className="fragrance-world__link">Explore Scents<img src={arrow} alt="" /></Link>
                        </div>
                    ))}
                    {images.map(item => (
                        <div key={item.id} data-node-id={item.id} className="fragrance-world__picture" style={{ left: item.x, width: item.width, height: item.height }} aria-hidden="true">
                            <div className="fragrance-world__crop"><img className={item.crop ? 'fragrance-world__bottle-crop' : ''} src={item.src} alt="" draggable="false" /></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
