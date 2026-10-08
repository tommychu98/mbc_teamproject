import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import usePerfumeHistoryScroll from './usePerfumeHistoryScroll';
import photo1 from './assets/3-1.png';
import photo2 from './assets/3-2.png';
import photo3 from './assets/3-3.png';
import mobileLogo1 from './assets/mobile-orpheon-logo.png';
import mobileLogo2 from './assets/mobile-saint-germain-logo.png';
import mobileLogo3 from './assets/mobile-fleur-de-peau-logo.png';
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
const MOBILE_LOGOS = [mobileLogo1, mobileLogo2, mobileLogo3];
export default function HomePerfumeHistory() {
    const [{ activeIndex, isTransitioning }, setStoryState] = useState({ activeIndex: 0, isTransitioning: false });
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const photoTrackRef = useRef(null);
    const logoTrackRef = useRef(null);
    const statusId = useId();
    const innerShadowId = `${statusId}-inner-shadow`;
    const goTo = usePerfumeHistoryScroll(sectionRef, stageRef, photoTrackRef, logoTrackRef, SLIDES, setStoryState);

    const activeSlide = SLIDES[activeIndex];

    const moveFragranceCursor = (event) => {
        if (event.pointerType === 'touch') return;
        const link = event.currentTarget;
        const bounds = link.getBoundingClientRect();
        link.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`);
        link.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`);
        link.dataset.cursorVisible = 'true';
    };

    const hideFragranceCursor = (event) => {
        event.currentTarget.dataset.cursorVisible = 'false';
    };

    return (
        <section
            className="home-perfume-history"
            ref={sectionRef}
            aria-label="Perfume history"
            aria-roledescription="carousel"
            aria-describedby={statusId}
            data-active-index={activeIndex}
            data-scroll-progress="0"
        >
            <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', pointerEvents: 'none' }}>
                <defs>
                    <filter id={innerShadowId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                        <feComponentTransfer in="SourceAlpha" result="inverseAlpha">
                            <feFuncA type="table" tableValues="1 0" />
                        </feComponentTransfer>
                        <feOffset in="inverseAlpha" dx="0" dy="3" result="offsetAlpha" />
                        <feGaussianBlur in="offsetAlpha" stdDeviation="1.5" result="softAlpha" />
                        <feComposite in="softAlpha" in2="SourceAlpha" operator="in" result="innerAlpha" />
                        <feFlood floodColor="#000000" floodOpacity="0.5" result="shadowColor" />
                        <feComposite in="shadowColor" in2="innerAlpha" operator="in" result="innerShadow" />
                        <feMerge>
                            <feMergeNode in="SourceGraphic" />
                            <feMergeNode in="innerShadow" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
            <div className="home-perfume-history__stage" ref={stageRef}>
                <div className="home-perfume-history__canvas">
                    <div className="home-perfume-history__photo">
                        <div className="home-perfume-history__photo-track" ref={photoTrackRef}>
                            {SLIDES.map((slide, index) => (
                                <div
                                    key={slide.name}
                                    className={`home-perfume-history__photo-slide home-perfume-history__photo-slide--${index + 1}`}
                                    style={{ left: slide.photoX }}
                                    aria-hidden={index !== activeIndex}
                                    data-pair={`3-${index + 1}`}
                                >
                                    <img loading="lazy" decoding="async" fetchPriority="low" className="home-perfume-history__photo-image" src={slide.photo} alt="" width="1086" height="1448" draggable="false" />
                                    <h2 className="home-perfume-history__title" style={{ filter: `url(#${innerShadowId})` }}>
                                        {index === 1 ? <><span>34 Boulevard</span><span>Saint-Germain</span></> : slide.name}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="home-perfume-history__autoplay" aria-hidden="true"><span /></div>
                    <div className="home-perfume-history__logo-panel">
                        <p className="home-perfume-history__mobile-count" aria-hidden="true">{activeIndex + 1}/3</p>
                        <div className="home-perfume-history__logo-window">
                            <div className="home-perfume-history__logo-track" ref={logoTrackRef}>
                                {SLIDES.map((slide, index) => (
                                    <div className="home-perfume-history__logo-slide" key={slide.name} style={{ left: slide.logoX }} aria-hidden={index !== activeIndex} data-pair={`3-logo${index + 1}`}>
                                        <picture>
                                            <source media="(max-width: 767px)" srcSet={MOBILE_LOGOS[index]} />
                                            <img loading="lazy" decoding="async" fetchPriority="low" className="home-perfume-history__logo-image" src={slide.logo} alt={`${slide.name} illustration`} width="380" height="510" draggable="false" />
                                        </picture>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="home-perfume-history__mobile-caption">diptyque 34 boulevard saint germain paris</p>

                        <img loading="lazy" decoding="async" fetchPriority="low" className="home-perfume-history__oval-text home-perfume-history__oval-text--top" src={ovalTextTop} alt="" width="445.493" height="283.76" draggable="false" />
                        <img loading="lazy" decoding="async" fetchPriority="low" className="home-perfume-history__oval-text home-perfume-history__oval-text--bottom" src={ovalTextBottom} alt="" width="444.97" height="277.488" draggable="false" />

                        <button className="home-perfume-history__button home-perfume-history__button--prev" type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0 || isTransitioning} aria-label="Previous perfume">Prev</button>
                        <button className="home-perfume-history__button home-perfume-history__button--next" type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === SLIDES.length - 1 || isTransitioning} aria-label="Next perfume">Next</button>
                    </div>

                    <Link
                        className="home-perfume-history__fragrance-link"
                        to="/about/fragrances-story"
                        aria-label="Fragrances Story 보기"
                        onPointerEnter={moveFragranceCursor}
                        onPointerMove={moveFragranceCursor}
                        onPointerLeave={hideFragranceCursor}
                        onPointerCancel={hideFragranceCursor}
                        onBlur={hideFragranceCursor}
                    >
                        <span className="home-perfume-history__fragrance-cursor" aria-hidden="true">
                            <span>EXPLORE</span>
                            <span className="home-perfume-history__fragrance-arrow">↗</span>
                        </span>
                    </Link>

                    <p className="home-perfume-history__status" id={statusId} aria-live="polite" aria-atomic="true">{activeIndex + 1} / {SLIDES.length}: {activeSlide.name}</p>
                </div>
            </div>
        </section>
    );
}
