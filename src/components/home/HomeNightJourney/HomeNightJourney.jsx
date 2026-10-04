import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import columns from '../HomeNightRitual/assets/columns.png';
import foregroundFlowers from '../HomeNightRitual/assets/foreground-flowers.png';
import buttonArrow from '../HomeNightRitual/assets/button-arrow.svg';
import { nightJourneyPanels } from './nightJourneyData';
import useAmbientWind from './useAmbientWind';
import useCon6Wind from './useCon6Wind';
import './HomeNightJourney.css';
import MobileNightWind from './MobileNightWind';
import useHomeMobile from '../useHomeMobile';
import MobileCategoryCarousel from './MobileCategoryCarousel';

const DESIGN_WIDTH = 1920;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smoothstep = (start, end, value) => {
    const t = clamp((value - start) / (end - start), 0, 1);
    return t * t * (3 - 2 * t);
};

function ViewMore({ href }) {
    return (
        <Link className="night-journey__view-more" to={href}>
            <span>View More</span>
            <img src={buttonArrow} alt="" />
        </Link>
    );
}

function Category({ category, mobile = false }) {
    return (
        <div className={mobile ? 'night-journey__category night-journey__category--mobile' : 'night-journey__category'}>
            <img className="night-journey__window" src={category.image} alt={category.alt} />
            <div className="night-journey__category-copy">
                <div className="night-journey__category-heading">
                    <p className="night-journey__category-number">{category.number}</p>
                    <h3 className={category.number === 'CATEGORY 04' ? 'night-journey__category-title night-journey__category-title--nowrap' : 'night-journey__category-title'}>{category.title}</h3>
                </div>
                <p className="night-journey__category-description">{category.description}</p>
                <ViewMore href={category.href} />
            </div>
        </div>
    );
}

function Particle({ particle, panelIndex, index }) {
    const attached = panelIndex === 0 && particle.motionType === 'botanical';
    const artwork = (
        <img
            src={particle.src}
            alt=""
            style={{ width: particle.imageWidth, height: particle.imageHeight, transform: `rotate(${particle.rotation}deg)` }}
            draggable="false"
        />
    );
    return (
        <span
            className="night-journey__particle"
            data-night-particle=""
            data-panel={panelIndex}
            data-particle-index={index}
            data-base-opacity={particle.opacity}
            style={{ left: particle.x, top: particle.y, width: particle.width, height: particle.height, opacity: particle.opacity }}
            aria-hidden="true"
        >
            <span className="night-journey__wind" data-motion-type={particle.motionType} data-attached-wind={attached ? '' : undefined}>
                {attached ? (
                    <span className="night-journey__botanical-response" data-botanical-x={particle.x + particle.width / 2} data-botanical-y={particle.y + particle.height / 2}>
                        {artwork}
                    </span>
                ) : artwork}
            </span>
        </span>
    );
}

export default function HomeNightJourney() {
    const mobile = useHomeMobile();
    const rootRef = useRef(null);
    const trackRef = useRef(null);
    useAmbientWind(rootRef);
    useCon6Wind(rootRef, mobile);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const track = trackRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const desktop = window.matchMedia('(min-width: 768px)');
        const particles = [...root.querySelectorAll('[data-night-particle]')].map((element, index) => ({
            element,
            panel: Number(element.dataset.panel),
            baseOpacity: Number(element.dataset.baseOpacity),
            phase: (index * 2.39996) % (Math.PI * 2),
            depth: [0.55, 1.45, 0.85, 1.2, 0.7][index % 5],
            driftX: 42 + ((index * 37) % 92),
            driftY: -24 + ((index * 19) % 65),
            spin: -36 + ((index * 29) % 86),
            stagger: (((index * 7) % 11) - 5) * 0.025,
        }));
        let frame = 0;

        const render = () => {
            frame = 0;
            if (!desktop.matches) {
                root.style.height = '';
                track.style.transform = '';
                return;
            }

            const width = root.clientWidth;
            const viewportHeight = window.innerHeight;
            const travel = width * (nightJourneyPanels.length - 1);
            // Match the width-based canvas used by the preceding night section.
            // Centering or height-fitting this canvas breaks the split botanical
            // artwork at the section boundary on non-16:9 viewports.
            const scale = width / DESIGN_WIDTH;
            root.style.height = `${viewportHeight + travel}px`;
            root.style.setProperty('--night-journey-scale', scale);

            const top = root.getBoundingClientRect().top;
            const shift = clamp(-top, 0, travel);
            track.style.transform = `translate3d(${-shift}px, 0, 0)`;

            if (reducedMotion.matches) {
                particles.forEach(({ element, baseOpacity }) => {
                    element.style.transform = '';
                    element.style.opacity = baseOpacity;
                });
                return;
            }

            const panelProgress = Math.min(shift, travel) / width;
            const entry = clamp((viewportHeight - top) / viewportHeight, 0, 1);

            particles.forEach(({ element, panel, baseOpacity, phase, depth, driftX, driftY, spin, stagger }) => {
                // Con6 is revealed by normal vertical scroll, then settles at its
                // Figma position exactly when the horizontal camera starts moving.
                const delta = panel === 0 && top > 0
                    ? -0.22 * (1 - entry)
                    : panelProgress - panel;
                const wave = Math.sin(delta * (4.1 + depth) + phase) - Math.sin(phase);
                const bob = Math.cos(delta * (3.4 + depth) + phase) - Math.cos(phase);
                const x = delta * driftX * depth + wave * 13 * depth;
                const y = delta * driftY + bob * 21 * depth;
                const angle = delta * spin + wave * 11;
                const size = 1 + delta * (depth - 1) * 0.09 + bob * 0.025;
                const fadeIn = smoothstep(-0.78 + stagger, -0.18 + stagger, delta);
                const fadeOut = 1 - smoothstep(0.18 + stagger, 0.78 + stagger, delta);

                element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg) scale(${size.toFixed(3)})`;
                element.style.opacity = (baseOpacity * fadeIn * fadeOut).toFixed(3);
            });
        };

        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(render);
        };
        const observer = new ResizeObserver(schedule);
        observer.observe(root);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        desktop.addEventListener('change', schedule);
        reducedMotion.addEventListener('change', schedule);
        render();

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            desktop.removeEventListener('change', schedule);
            reducedMotion.removeEventListener('change', schedule);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    let particleIndex = 0;
    return (
        <section className="night-journey" ref={rootRef} aria-label="Explore Diptyque collections" data-node-id="2863:8194">
            <div className="night-journey__stage">
                <div className="night-journey__track" ref={trackRef}>
                    {nightJourneyPanels.map((panel, panelIndex) => (
                        <div className="night-journey__panel" key={panel.id} data-node-id={panel.id} data-scene={panel.name}>
                            <div className="night-journey__canvas">
                                {panelIndex === 0 && (
                                    <>
                                        <div className="night-journey__columns"><img src={columns} alt="" /></div>
                                        <div className="night-journey__foreground-flowers">
                                            <span className="night-journey__wind night-journey__wind--branch" data-motion-type="branch"><img src={foregroundFlowers} alt="" /></span>
                                        </div>
                                    </>
                                )}
                                {panel.category && <Category category={panel.category} />}
                                {panel.particles.map((item) => <Particle key={particleIndex} particle={item} panelIndex={panelIndex} index={particleIndex++} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="night-journey__mobile">
                {mobile && <MobileNightWind />}
                {mobile && <MobileCategoryCarousel />}
            </div>
        </section>
    );
}
