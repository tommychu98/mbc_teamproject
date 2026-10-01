import { useCallback, useEffect, useId, useRef, useState } from 'react';
import photo1 from './assets/3-1.png';
import photo2 from './assets/3-2.png';
import photo3 from './assets/3-3.png';
import logo1 from './assets/3-logo1.png';
import logo2 from './assets/3-logo2.png';
import logo3 from './assets/3-logo3.png';
import ovalTextTop from './assets/oval-text-top.svg';
import ovalTextBottom from './assets/oval-text-bottom.svg';
import './HomePerfumeHistory.css';

const SLIDES = [
    { name: 'Orphéon', photo: photo1, logo: logo1, photoX: '0cqw', logoX: '0cqw', photoShift: '0cqw', logoShift: '0cqw' },
    { name: '34 Boulevard Saint-Germain', photo: photo2, logo: logo2, photoX: '-51.5625cqw', logoX: '23.645833cqw', photoShift: '51.5625cqw', logoShift: '-23.645833cqw' },
    { name: 'Fleur de Peau', photo: photo3, logo: logo3, photoX: '-102.864583cqw', logoX: '44.947917cqw', photoShift: '102.864583cqw', logoShift: '-44.947917cqw' },
];
const ANIMATION_MS = 720;
const WHEEL_THRESHOLD = 60;
const WHEEL_IDLE_MS = 180;

export default function HomePerfumeHistory() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const photoRef = useRef(null);
    const logoRef = useRef(null);
    const activeIndexRef = useRef(0);
    const lockedUntilRef = useRef(0);
    const animationTimerRef = useRef(null);
    const wheelRef = useRef({ total: 0, direction: 0, lastAt: -Infinity });
    const statusId = useId();

    const goTo = useCallback((nextIndex) => {
        const now = performance.now();
        if (now < lockedUntilRef.current || nextIndex < 0 || nextIndex >= SLIDES.length || nextIndex === activeIndexRef.current) return;

        activeIndexRef.current = nextIndex;
        lockedUntilRef.current = now + ANIMATION_MS;
        wheelRef.current.total = 0;
        setActiveIndex(nextIndex);
        setIsAnimating(true);
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = setTimeout(() => setIsAnimating(false), ANIMATION_MS);
    }, []);

    useEffect(() => {
        const panels = [photoRef.current, logoRef.current];
        const onWheel = (event) => {
            // Preserve browser zoom and gestures whose dominant axis is horizontal.
            if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

            const now = performance.now();
            const direction = Math.sign(event.deltaY);
            const wheel = wheelRef.current;
            const idle = now - wheel.lastAt;
            wheel.lastAt = now;
            const index = activeIndexRef.current;

            // Do not capture outward scroll at either end, including during animation.
            if ((index === 0 && direction < 0) || (index === SLIDES.length - 1 && direction > 0)) {
                wheel.total = 0;
                wheel.direction = direction;
                return;
            }

            event.preventDefault();
            if (now < lockedUntilRef.current) {
                wheel.total = 0;
                return;
            }
            // A continuing trackpad gesture may change at most one slide.
            if (idle < WHEEL_IDLE_MS && wheel.total === 0 && wheel.direction === direction) return;
            if (idle >= WHEEL_IDLE_MS || wheel.direction !== direction) wheel.total = 0;
            wheel.direction = direction;

            const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? event.currentTarget.clientHeight : 1;
            wheel.total += event.deltaY * unit;
            if (Math.abs(wheel.total) >= WHEEL_THRESHOLD) goTo(index + direction);
        };

        panels.forEach((panel) => panel.addEventListener('wheel', onWheel, { passive: false }));
        return () => {
            panels.forEach((panel) => panel.removeEventListener('wheel', onWheel));
            clearTimeout(animationTimerRef.current);
        };
    }, [goTo]);

    const activeSlide = SLIDES[activeIndex];

    return (
        <section
            className="home-perfume-history"
            aria-label="Perfume history"
            aria-roledescription="carousel"
            aria-describedby={statusId}
            data-active-index={activeIndex}
            style={{ '--history-duration': `${ANIMATION_MS}ms` }}
        >
            <div className="home-perfume-history__photo" ref={photoRef}>
                <div className="home-perfume-history__photo-track" style={{ transform: `translate3d(${activeSlide.photoShift}, 0, 0)` }}>
                    {SLIDES.map((slide, index) => (
                        <div
                            key={slide.name}
                            className={`home-perfume-history__photo-slide home-perfume-history__photo-slide--${index + 1}`}
                            style={{ left: slide.photoX }}
                            aria-hidden={index !== activeIndex}
                            data-pair={`3-${index + 1}`}
                        >
                            <img className="home-perfume-history__photo-image" src={slide.photo} alt="" width="1086" height="1448" draggable="false" />
                            <h2 className="home-perfume-history__title">
                                {index === 1 ? <><span>34 Boulevard</span><span>Saint-Germain</span></> : slide.name}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="home-perfume-history__logo-panel" ref={logoRef}>
                <div className="home-perfume-history__logo-window">
                    <div className="home-perfume-history__logo-track" style={{ transform: `translate3d(${activeSlide.logoShift}, 0, 0)` }}>
                        {SLIDES.map((slide, index) => (
                            <div className="home-perfume-history__logo-slide" key={slide.name} style={{ left: slide.logoX }} aria-hidden={index !== activeIndex} data-pair={`3-logo${index + 1}`}>
                                <img className="home-perfume-history__logo-image" src={slide.logo} alt={`${slide.name} illustration`} width="380" height="510" draggable="false" />
                            </div>
                        ))}
                    </div>
                </div>

                <img className="home-perfume-history__oval-text home-perfume-history__oval-text--top" src={ovalTextTop} alt="" width="445.493" height="283.76" draggable="false" />
                <img className="home-perfume-history__oval-text home-perfume-history__oval-text--bottom" src={ovalTextBottom} alt="" width="444.97" height="277.488" draggable="false" />

                <button className="home-perfume-history__button home-perfume-history__button--prev" type="button" onClick={() => goTo(activeIndexRef.current - 1)} disabled={activeIndex === 0 || isAnimating} aria-label="Previous perfume">Prev</button>
                <button className="home-perfume-history__button home-perfume-history__button--next" type="button" onClick={() => goTo(activeIndexRef.current + 1)} disabled={activeIndex === SLIDES.length - 1 || isAnimating} aria-label="Next perfume">Next</button>
            </div>

            <p className="home-perfume-history__status" id={statusId} aria-live="polite" aria-atomic="true">{activeIndex + 1} / {SLIDES.length}: {activeSlide.name}</p>
        </section>
    );
}
