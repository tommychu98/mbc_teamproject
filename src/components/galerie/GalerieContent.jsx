import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tamDao from './assets/images/shared/tam-dao.png';
import eauRose from './assets/images/shared/eau-rose.png';
import eauDesSens from './assets/images/shared/eau-des-sens.png';
import philosykos from './assets/images/shared/philosykos.png';
import chapterFourFig from './assets/images/web/chapter-four-fig.png';
import chapterOneForest from './assets/images/shared/chapter-one-forest.png';
import chapterOneMobile from './assets/images/mobile/chapter-one-mobile.png';
import scrollDown from './assets/images/mobile/scroll-down-white.svg';
import topArrow from './assets/images/shared/top-arrow-white.svg';
import GalerieTamDao from './GalerieTamDao';
import GalerieTamDaoLineup from './GalerieTamDaoLineup';
import GalerieEauRose from './GalerieEauRose';
import GalerieEauDesSens from './GalerieEauDesSens';
import GaleriePhilosykos from './GaleriePhilosykos';
import GalerieAnother from './GalerieAnother';
import './GalerieContent.css';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
    { number: 1, title: '비가 그친 숲', image: tamDao, angle: '6.64deg', alt: '비가 그친 뒤의 울창한 숲과 계곡, 탐다오' },
    { number: 2, title: '장미 향이 머무는 정원', image: eauRose, angle: '-6.98deg', alt: '장미가 피어난 정원, 오 로즈' },
    { number: 3, title: '오렌지 향이 번지는 오후', image: eauDesSens, angle: '6.2deg', alt: '오렌지 열매와 꽃이 어우러진 풍경, 오 데 썽' },
    { number: 4, title: '햇살 머금은 무화과 나무', image: philosykos, angle: '-2.31deg', alt: '햇살 아래 무화과 나무와 정원, 필로시코스' },
];

// The supplied example scales to 1.5 at the center and 0.45 at quarter width.
function centerScale(position) {
    const distance = Math.abs(position - 0.5);
    if (distance >= 0.5) return 0;
    if (distance <= 0.25) return gsap.utils.interpolate(1.5, 0.45, distance * 4);
    return gsap.utils.interpolate(0.45, 0, (distance - 0.25) * 4);
}

export default function GalerieContent() {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            const stage = root.querySelector('.galerie-hero__stage');
            const track = root.querySelector('.galerie-hero__track');
            const cards = [...root.querySelectorAll('.galerie-hero__card')];
            const position = { progress: 0 };
            let width;
            let cardOffsets;

            const render = () => {
                const offset = position.progress * cardOffsets.at(-1);
                gsap.set(track, { x: -offset });
                cards.forEach((_, index) => {
                    const scale = centerScale((width / 2 + cardOffsets[index] - offset) / width);
                    cards[index].style.transform = `scale(${scale})`;
                    cards[index].querySelector('img').style.transform = `scale(${Math.max(1, scale * 1.1)})`;
                });
            };
            const measure = () => {
                width = stage.clientWidth;
                cardOffsets = cards.map((card) => card.offsetLeft - cards[0].offsetLeft);
                render();
            };

            measure();
            gsap.to(position, {
                progress: 1,
                ease: 'none',
                onUpdate: render,
                scrollTrigger: {
                    trigger: root,
                    start: 'top top',
                    end: () => `+=${root.offsetHeight - stage.offsetHeight}`,
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onRefresh: measure,
                },
            });
            return () => {
                // matchMedia.revert() already disposes its tweens and ScrollTriggers.
                [track, ...cards, ...root.querySelectorAll('.galerie-hero__image')].forEach((element) => {
                    element.style.removeProperty('transform');
                });
            };
        }, root);
        return () => media.revert();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
    };

    return (
        <main className="galerie-page" aria-labelledby="galerie-title">
            <section className="galerie-hero" ref={rootRef} aria-label="향의 풍경 갤러리">
            <h1 className="galerie-hero__sr-only" id="galerie-title">Galerie Diptyque — 향의 풍경</h1>
            <div className="galerie-hero__stage">
                <div className="galerie-hero__track">
                    {chapters.map((chapter) => (
                        <figure className="galerie-hero__card" key={chapter.number}>
                            <div className="galerie-hero__artwork" style={{ '--galerie-angle': chapter.angle }}>
                                <img className="galerie-hero__image" src={chapter.image} alt={chapter.alt} width="480" height="650" />
                            </div>
                            <figcaption className="galerie-hero__caption">
                                <span className="galerie-hero__chapter">Chapter {chapter.number}</span>
                                <h2 className="galerie-hero__title">{chapter.title}</h2>
                                <p className="galerie-hero__count">{chapter.number}/4</p>
                            </figcaption>
                                <a
                                    className="galerie-hero__chapter-link"
                                    href={`#galerie-chapter-${['one', 'two', 'three', 'four'][chapter.number - 1]}`}
                                    aria-label={`Chapter ${chapter.number} ${chapter.title}으로 이동`}
                                    onClick={(event) => {
                                        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                                        event.preventDefault();
                                        const target = document.querySelector(event.currentTarget.getAttribute('href'));
                                        target?.focus({ preventScroll: true });
                                        target?.scrollIntoView({ behavior: 'instant', block: 'start' });
                                    }}
                                />
                        </figure>
                    ))}
                </div>
                {createPortal(<button className="galerie-hero__top" type="button" onClick={scrollToTop} aria-label="페이지 맨 위로 이동">
                    <img className="galerie-hero__top-arrow" src={topArrow} alt="" />
                    <span>TOP</span>
                </button>, document.body)}
            </div>
            </section>
            <section className="galerie-chapter-intro" id="galerie-chapter-one" tabIndex={-1} aria-labelledby="galerie-chapter-one-title">
                <picture>
                    <source media="(max-width: 767px)" srcSet={chapterOneMobile} />
                    <img className="galerie-chapter-intro__image" src={chapterOneForest} alt="" loading="lazy" />
                </picture>
                <div className="galerie-chapter-intro__text">
                    <p className="galerie-chapter-intro__label">Chapter 1</p>
                    <h2 className="galerie-chapter-intro__title" id="galerie-chapter-one-title">비가 그친 숲</h2>
                </div>
                <button className="galerie-chapter-intro__next" type="button" aria-label="탐다오 소개로 이동"
                    onClick={() => {
                        const target = document.getElementById('galerie-tamdao-content');
                        target?.focus({ preventScroll: true });
                        target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
                    }}>
                    <img src={scrollDown} alt="" />
                </button>
            </section>
            <div className="galerie-tamdao-chapter" id="galerie-tamdao-content" tabIndex={-1}>
                <GalerieTamDao />
                <GalerieTamDaoLineup />
            </div>
            <section className="galerie-chapter-intro" id="galerie-chapter-two" tabIndex={-1} aria-labelledby="galerie-chapter-two-title">
                <img className="galerie-chapter-intro__image" src={eauRose} alt="" loading="lazy" />
                <div className="galerie-chapter-intro__text">
                    <p className="galerie-chapter-intro__label">Chapter 2</p>
                    <h2 className="galerie-chapter-intro__title" id="galerie-chapter-two-title">장미 향이 머무는 정원</h2>
                </div>
            </section>
            <GalerieEauRose />
            <section className="galerie-chapter-intro galerie-chapter-intro--orange" id="galerie-chapter-three" tabIndex={-1} aria-labelledby="galerie-chapter-three-title">
                <img className="galerie-chapter-intro__image" src={eauDesSens} alt="" loading="lazy" />
                <div className="galerie-chapter-intro__text">
                    <p className="galerie-chapter-intro__label">Chapter 3</p>
                    <h2 className="galerie-chapter-intro__title" id="galerie-chapter-three-title">오렌지 향이 번지는 오후</h2>
                </div>
            </section>
            <GalerieEauDesSens />
            <section className="galerie-chapter-intro galerie-chapter-intro--fig" id="galerie-chapter-four" tabIndex={-1} aria-labelledby="galerie-chapter-four-title">
                <img className="galerie-chapter-intro__image" src={chapterFourFig} alt="" loading="lazy" />
                <div className="galerie-chapter-intro__text">
                    <p className="galerie-chapter-intro__label">Chapter 4</p>
                    <h2 className="galerie-chapter-intro__title" id="galerie-chapter-four-title">햇살 머금은 무화과 나무</h2>
                </div>
            </section>
            <GaleriePhilosykos />
            <GalerieAnother />
        </main>
    );
}
