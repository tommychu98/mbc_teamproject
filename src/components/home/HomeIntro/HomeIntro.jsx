import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import logo from './assets/diptyque-sketch-logo-transparent.png';
import storyObject from './assets/story-object.webp';
import storyLeafDrawing from './assets/story-leaf-drawing.webp';
import storyFoundersPhoto from './assets/story-founders-card.png';
import storyButtonLine from './assets/story-button-line.svg';
import mobileTopIcon from './assets/mobile-top-bk.svg';
import mobileScrollDown from './assets/mobile-scroll-down.svg';
import setupMobileIntro from './setupMobileIntro';
import setupDesktopVideo from './setupDesktopVideo';
import setupScrollPlaybackRate from './setupScrollPlaybackRate';
import MobileIntroStory from './MobileIntroStory';
import desktopPoster from './assets/hero-desktop-poster.webp';
import desktopMp4 from './assets/hero-desktop.mp4';
import desktopWebm from './assets/hero-desktop.webm';
import mobilePoster from './assets/hero-mobile-poster.webp';
import mobileMp4 from './assets/hero-mobile.mp4';
import mobileWebm from './assets/hero-mobile.webm';
import './HomeIntro.css';

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;
const HERO_PLAYBACK_RATE = 1.2;

export default function HomeIntro() {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
    const [storyMediaReady, setStoryMediaReady] = useState(false);
    const maskId = `home-intro-mask-${useId().replace(/:/g, '')}`;
    const mistFilterId = `${maskId}-mist`;
    const rootRef = useRef(null);
    const mistRef = useRef(null);
    const revealOverlayRef = useRef(null);
    const videoRef = useRef(null);
    const logoRef = useRef(null);
    const topButtonRef = useRef(null);
    const downButtonRef = useRef(null);
    const storyRef = useRef(null);
    const storyTimelineRef = useRef(null);

    useEffect(() => {
        const viewport = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(viewport.matches);
        viewport.addEventListener('change', update);
        update();
        return () => viewport.removeEventListener('change', update);
    }, []);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const video = videoRef.current;
        video.defaultPlaybackRate = HERO_PLAYBACK_RATE;
        video.playbackRate = HERO_PLAYBACK_RATE;
        const context = gsap.context(() => {
            gsap.set(storyRef.current, { autoAlpha: 0 });
            gsap.set('[data-story-plant]', { autoAlpha: 0, y: 42, rotate: -2.8 });
            gsap.set('[data-story-paper]', { autoAlpha: 0, x: -34, y: 34, rotate: -7.5 });
            gsap.set('[data-story-copy]', { autoAlpha: 0, y: 16 });
            gsap.set('[data-story-title-line]', {
                autoAlpha: 1,
                clipPath: 'inset(0 100% 0 0)',
                y: 10,
            });
            gsap.set('[data-story-button]', { autoAlpha: 0, y: 8 });

            storyTimelineRef.current = gsap
                .timeline({
                    paused: true,
                    defaults: { ease: 'power2.out' },
                })
                .to(storyRef.current, { autoAlpha: 1, duration: 0.01 }, 0)
                .to(
                    '[data-story-plant]',
                    {
                        autoAlpha: 1,
                        opacity: (index) => (index === 0 ? 0.7 : 1),
                        y: 0,
                        rotate: (index) => (index === 0 ? 0 : -176.95),
                        duration: 1.15,
                        stagger: 0.16,
                    },
                    0
                )
                .to(
                    '[data-story-paper]',
                    {
                        autoAlpha: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        duration: 0.95,
                    },
                    0
                )
                .to('[data-story-copy]', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.14 }, 0)
                .to(
                    '[data-story-title-line]',
                    {
                        clipPath: 'inset(0 0% 0 0)',
                        y: 0,
                        duration: 1.05,
                        stagger: 0.2,
                        ease: 'power1.inOut',
                    },
                    0
                )
                .to('[data-story-button]', { autoAlpha: 1, y: 0, duration: 0.55 }, 0.7);

        }, rootRef);
        const cleanupPlayback = isMobile
            ? setupMobileIntro({
                root, video: videoRef.current, logo: logoRef.current,
                mist: mistRef.current, overlay: revealOverlayRef.current,
                topButton: topButtonRef.current, downButton: downButtonRef.current,
            })
            : setupDesktopVideo({
                root, video: videoRef.current, logo: logoRef.current,
                mist: mistRef.current, overlay: revealOverlayRef.current,
                topButton: topButtonRef.current,
                onStoryStart: () => {
                    const timeline = storyTimelineRef.current;
                    if (!timeline || timeline.isActive() || timeline.progress() === 1) return;
                    timeline.eventCallback('onComplete', () => {
                        root.dispatchEvent(new Event('home-intro-story-complete'));
                    });
                    timeline.play();
                },
            });
        const cleanupPlaybackRate = setupScrollPlaybackRate({ root, video });
        return () => {
            cleanupPlaybackRate();
            cleanupPlayback();
            context.revert();
        };
    }, [isMobile]);

    return (
        <><section ref={rootRef} className="home-intro" data-node-id="1991:658">
            <video key={isMobile ? 'mobile' : 'desktop'} ref={videoRef}
                className={isMobile ? 'home-intro__mobile-film' : 'home-intro__video'}
                poster={isMobile ? mobilePoster : desktopPoster}
                autoPlay preload="auto" muted playsInline loop={false}
                aria-label="Diptyque hero film"
                onCanPlayThrough={() => setStoryMediaReady(true)}
                onEnded={() => {
                    if (!isMobile) return;
                    const root = rootRef.current;
                    const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height ?? 52;
                    if (!root || root.getBoundingClientRect().bottom <= headerHeight) return;
                    downButtonRef.current?.click();
                }}>
                <source src={isMobile ? mobileMp4 : desktopMp4} type="video/mp4" />
                <source src={isMobile ? mobileWebm : desktopWebm} type="video/webm" />
            </video>
            {isMobile && <button
                ref={downButtonRef}
                className="home-intro__mobile-down"
                type="button"
                aria-label="다음 콘텐츠로 이동"
                onClick={() => {
                    const next = rootRef.current?.nextElementSibling;
                    const target = next?.matches('section') ? next : next?.querySelector('section');
                    if (!target) return;
                    const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height ?? 52;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - headerHeight,
                        behavior: 'smooth',
                    });
                }}
            ><img src={mobileScrollDown} alt="" aria-hidden="true" /></button>}
            <svg
                ref={revealOverlayRef}
                className="home-intro__reveal-overlay"
                viewBox={`0 0 ${HERO_WIDTH} ${HERO_HEIGHT}`}
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <filter id={mistFilterId} filterUnits="userSpaceOnUse"
                        x="-480" y="-270" width="2880" height="1620" colorInterpolationFilters="sRGB">
                        <feTurbulence type="fractalNoise" baseFrequency="0.003 0.005" numOctaves="2" seed="17" result="air" />
                        <feDisplacementMap in="SourceGraphic" in2="air" scale="180" xChannelSelector="R" yChannelSelector="G" />
                        <feGaussianBlur stdDeviation="65" />
                    </filter>
                    <mask id={maskId} x="0" y="0" width={HERO_WIDTH} height={HERO_HEIGHT}
                        maskUnits="userSpaceOnUse" maskType="luminance">
                        <rect width={HERO_WIDTH} height={HERO_HEIGHT} fill="white" />
                        {/* A displaced, feathered silhouette grows in unequal
                            directions; no geometric aperture or looping noise. */}
                        <g filter={`url(#${mistFilterId})`}>
                            <g ref={mistRef} transform="translate(960 540) scale(0.18 0.24)" opacity="0" fill="black">
                                <path d="M-490 35 C-545-55-392-70-350-140 C-315-210-170-130-118-222 C-40-306 55-215 103-174 C160-116 272-210 335-126 C383-62 294 1 408 45 C505 86 389 164 286 133 C206 113 241 239 109 207 C18 184-36 296-132 228 C-201 175-166 116-285 145 C-387 171-421 104-490 35Z" />
                                <path opacity="0.35" d="M-610-25 C-550-155-375-194-253-147 C-105-100-105-294 60-257 C216-221 241-97 433-117 C610-132 581 48 408 105 C290 147 242 289 73 302 C-97 311-158 211-328 243 C-501 275-566 121-610-25Z" />
                            </g>
                        </g>
                    </mask>
                </defs>
                <rect
                    className="home-intro__reveal-surface"
                    width={HERO_WIDTH}
                    height={HERO_HEIGHT}
                    mask={`url(#${maskId})`}
                />
            </svg>
            <img
                ref={logoRef}
                className="home-intro__logo"
                src={logo}
                fetchPriority="high"
                alt="Diptyque Paris"
                width="618"
                height="225"
            />
            <button
                ref={topButtonRef}
                className="home-intro__mobile-top"
                type="button"
                aria-label="홈 맨 위로 이동"
                onClick={() => window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                })}
            >
                <img src={mobileTopIcon} alt="" aria-hidden="true" width="13" height="17" />
                <span aria-hidden="true">TOP</span>
            </button>
            <div
                ref={storyRef}
                className="home-intro__story"
                data-node-id="2863:8510"
                aria-label="The story of Diptyque"
            >
                <div className="home-intro__story-inner">
                    <img
                        className="home-intro__story-object"
                        data-story-plant
                        data-node-id="2863:8515"
                        src={!isMobile && storyMediaReady ? storyObject : undefined}
                        decoding="async" fetchPriority="low"
                        alt=""
                    />
                    <div className="home-intro__story-leaf" data-story-plant data-node-id="2863:8516">
                        <img src={!isMobile && storyMediaReady ? storyLeafDrawing : undefined} decoding="async" fetchPriority="low" alt="" />
                    </div>
                    <p className="home-intro__story-year" data-story-copy data-node-id="2863:8514">
                        1961
                    </p>
                    <figure className="home-intro__story-photo" data-story-paper data-node-id="2863:8517">
                        <img src={!isMobile && storyMediaReady ? storyFoundersPhoto : undefined} decoding="async" fetchPriority="low" alt="The founders of Diptyque" />
                    </figure>
                    <h2 className="home-intro__story-title" data-node-id="2863:8512">
                        <span data-story-title-line>
                            <span>THE </span>
                            <strong>STORY</strong>
                            <span> of</span>
                        </span>
                        <span data-story-title-line>
                            <strong>Diptyque</strong>
                        </span>
                    </h2>
                    <p className="home-intro__story-place" data-story-copy data-node-id="2863:8513">
                        Saint-Germain , Paris
                    </p>
                    <Link
                        className="home-intro__story-button"
                        data-story-button
                        data-node-id="2863:8522"
                        to="/about/history"
                    >
                        <span>Our Story</span>
                        <img src={storyButtonLine} alt="" />
                    </Link>
                </div>
            </div>
        </section>{isMobile && <MobileIntroStory mediaReady={storyMediaReady} />}</>
    );
}
