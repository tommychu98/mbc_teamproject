import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import petal38 from './assets/images/hero-petals/element-38.png';
import petal20 from './assets/images/hero-petals/element-20.png';
import petal59 from './assets/images/hero-petals/element-59.png';
import petal47 from './assets/images/hero-petals/element-47.png';
import petal43 from './assets/images/hero-petals/element-43.png';
import petal51 from './assets/images/hero-petals/element-51.png';
import petal46 from './assets/images/hero-petals/element-46.png';
import petal19 from './assets/images/hero-petals/element-19.png';
import petal22 from './assets/images/hero-petals/element-22.png';
import petal50 from './assets/images/hero-petals/element-50.png';
import petal14 from './assets/images/hero-petals/element-14.png';
import './GalerieHeroPetals.css';

// Centers, unrotated sizes and angles from the 1920 x 1200 Figma hero.
const petals = [
    { image: petal38, x: 1636.8985, y: 839.8185, width: 57, height: 54, angle: 109.29 },
    { image: petal20, x: 17, y: 275, width: 84, height: 74, angle: 0 },
    { image: petal59, x: 1003.438, y: 416.3625, width: 84, height: 78, angle: -57.58 },
    { image: petal47, x: 515.788, y: 876.129, width: 68, height: 38, angle: 136.78 },
    { image: petal43, x: 1795.1455, y: 274.8065, width: 41.672, height: 43.905, angle: -159.75 },
    { image: petal51, x: 142, y: 1077, width: 50, height: 38, angle: 0 },
    { image: petal46, x: 1298.939, y: 982.676, width: 36, height: 39, angle: -98.47 },
    { image: petal19, x: 919.054, y: 834.831, width: 64, height: 49, angle: 136.2 },
    { image: petal22, x: 333, y: 473.5, width: 40, height: 45, angle: 0 },
    { image: petal50, x: 1246.5, y: 673, width: 61, height: 60, angle: 0 },
    { image: petal14, x: 1902.5, y: 671, width: 61, height: 56, angle: 0 },
];

export default function GalerieHeroPetals() {
    const layerRef = useRef(null);

    useLayoutEffect(() => {
        const layer = layerRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            let height = layer.clientHeight;
            let visible = false;
            const padding = 120;
            const animations = [];
            const renders = [];

            [...layer.children].forEach((petal, index) => {
                const design = petals[index];
                const sway = petal.firstElementChild;
                const phase = { value: (design.y / 1200 * height + padding) / (height + padding * 2) };
                const setY = gsap.quickSetter(petal, 'y', 'px');
                const render = () => {
                    // Wrap only beyond the clipped edges, without a visible jump.
                    setY((phase.value % 1) * (height + padding * 2) - padding - design.y / 1200 * height);
                };
                renders.push(render);
                render();
                animations.push(
                    gsap.to(phase, {
                        value: phase.value + 1,
                        duration: 28 + (index * 7 % 17),
                        ease: 'none', repeat: -1, paused: true, onUpdate: render,
                    }),
                    gsap.to(sway, {
                        x: (index % 2 ? -1 : 1) * (18 + index % 4 * 9),
                        rotation: (index % 2 ? 1 : -1) * (16 + index % 3 * 11),
                        rotationY: index % 2 ? 38 : -32,
                        duration: 3.6 + index % 5 * 0.7,
                        ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
                    }),
                );
            });

            const sync = () => animations.forEach((animation) => {
                if (visible && !document.hidden) animation.play();
                else animation.pause();
            });
            const observer = new IntersectionObserver(([entry]) => {
                visible = entry.isIntersecting && entry.intersectionRatio > 0;
                sync();
            }, { threshold: [0, 0.01] });
            observer.observe(layer);
            const resizeObserver = new ResizeObserver(() => {
                height = layer.clientHeight;
                renders.forEach((render) => render());
            });
            resizeObserver.observe(layer);
            document.addEventListener('visibilitychange', sync);
            return () => {
                observer.disconnect();
                resizeObserver.disconnect();
                document.removeEventListener('visibilitychange', sync);
                // quickSetter writes are not collected by the GSAP context.
                [...layer.children].forEach((petal) => petal.style.removeProperty('transform'));
            };
        }, layer);
        return () => media.revert();
    }, []);

    return (
        <div className="galerie-hero-petals" ref={layerRef} aria-hidden="true">
            {petals.map((petal) => (
                <span className="galerie-hero-petals__petal" key={petal.image} style={{
                    left: `${petal.x / 1920 * 100}%`,
                    top: `${petal.y / 1200 * 100}%`,
                    '--petal-width': `${petal.width / 1920 * 100}vw`,
                    '--petal-angle': `${petal.angle}deg`,
                    aspectRatio: `${petal.width} / ${petal.height}`,
                }}>
                    <span className="galerie-hero-petals__sway">
                        <img src={petal.image} alt="" width={petal.width} height={petal.height} draggable={false} />
                    </span>
                </span>
            ))}
        </div>
    );
}
