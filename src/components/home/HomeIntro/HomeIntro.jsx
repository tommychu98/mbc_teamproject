import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from './assets/diptyque-sketch-logo-transparent.png';
import storyObject from './assets/story-object.png';
import storyLeafDrawing from './assets/story-leaf-drawing.png';
import storyFoundersPhoto from './assets/story-founders-photo.png';
import storyButtonLine from './assets/story-button-line.svg';
import mobileTopIcon from './assets/mobile-top-bk.svg';
import mobileScrollDown from './assets/mobile-scroll-down.svg';
import mobileHero from './assets/mobile-hero-source.png';
import mobileFilm from './assets/phone-main.mp4';
import setupMobileIntro from './setupMobileIntro';
import MobileIntroStory from './MobileIntroStory';
import './HomeIntro.css';

gsap.registerPlugin(ScrollTrigger);

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;
const REVEAL_END_PROGRESS = 0.4;
const SEQUENCE_DRIFT_START = REVEAL_END_PROGRESS;
const SEQUENCE_MAIN_START = 0.58;
const SEQUENCE_COMPLETE_PROGRESS = 0.94;
const SEQUENCE_DRIFT_PROGRESS = 0.015;
const SCROLL_DISTANCE = 3600;
const SEEK_SMOOTHING = 0.12;
const VIDEO_DURATION_FALLBACK = 14;
const CAMERA_MOVE_END = 6;
const CAMERA_MOVE_END_PROGRESS = CAMERA_MOVE_END / VIDEO_DURATION_FALLBACK;
const LOGO_SEQUENCE_START = 0.012;
const LOGO_EXIT_Y = -760;
const CAMERA_EASE = gsap.parseEase('power1.inOut');
const REVEAL_EASE = gsap.parseEase('power2.inOut');
const FIRST_FRAME = 0;
const LAST_FRAME = 892;
const FRAME_COUNT = LAST_FRAME - FIRST_FRAME + 1;
const FRAME_CACHE_SIZE = 3;
const SEQUENCE_EDGE_EASE = 0.12;
const FRAME_FILE_PREFIX = 'hf_20260930_041313_b5eca77f-7b2f-4103-a56a-e8e995ae9e9a';
const frameSrc = (frame) => `/mainhero/${FRAME_FILE_PREFIX}${String(frame).padStart(3, '0')}.webp`;

const smoothstep = (progress) => progress * progress * (3 - 2 * progress);

const remapSequenceProgress = (progress) => {
    if (progress <= SEQUENCE_DRIFT_START) return 0;

    if (progress < SEQUENCE_MAIN_START) {
        const driftProgress = gsap.utils.clamp(
            0,
            1,
            (progress - SEQUENCE_DRIFT_START) / (SEQUENCE_MAIN_START - SEQUENCE_DRIFT_START)
        );
        return smoothstep(driftProgress) * SEQUENCE_DRIFT_PROGRESS;
    }

    const mainProgress = gsap.utils.clamp(
        0,
        1,
        (progress - SEQUENCE_MAIN_START) / (SEQUENCE_COMPLETE_PROGRESS - SEQUENCE_MAIN_START)
    );
    return SEQUENCE_DRIFT_PROGRESS + smoothstep(mainProgress) * (1 - SEQUENCE_DRIFT_PROGRESS);
};

const easeSequenceEdges = (progress) => {
    if (progress < SEQUENCE_EDGE_EASE) {
        const edgeProgress = progress / SEQUENCE_EDGE_EASE;
        return SEQUENCE_EDGE_EASE * (2 * edgeProgress ** 2 - edgeProgress ** 3);
    }

    if (progress > 1 - SEQUENCE_EDGE_EASE) {
        const edgeProgress = (1 - progress) / SEQUENCE_EDGE_EASE;
        return 1 - SEQUENCE_EDGE_EASE * (2 * edgeProgress ** 2 - edgeProgress ** 3);
    }

    return progress;
};

export default function HomeIntro() {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
    const maskId = `home-intro-mask-${useId().replace(/:/g, '')}`;
    const mistFilterId = `${maskId}-mist`;
    const rootRef = useRef(null);
    const mistRef = useRef(null);
    const revealOverlayRef = useRef(null);
    const canvasRef = useRef(null);
    const mobileVideoRef = useRef(null);
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
        if (isMobile) return setupMobileIntro({
            root: rootRef.current, video: mobileVideoRef.current, logo: logoRef.current,
            mist: mistRef.current, overlay: revealOverlayRef.current, topButton: topButtonRef.current,
            downButton: downButtonRef.current,
        });
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        const frameCache = new Map();
        const mobileViewport = window.matchMedia('(max-width: 767px)');
        let frameRequest = 0;
        let previousFrameTime = performance.now();
        let targetTime = 0;
        let currentTime = 0;
        let scrollProgress = 0;
        let maxScrollProgress = 0;
        let requestedFrame = FIRST_FRAME;
        let disposed = false;
        let storyStarted = false;

        const updateStoryTimeline = (activeFrame) => {
            if (isMobile) return;
            const storyTimeline = storyTimelineRef.current;
            if (!storyTimeline || storyStarted || activeFrame !== LAST_FRAME) return;

            storyStarted = true;
            storyTimeline.play();
        };

        const updateReveal = () => {
            const revealProgress = REVEAL_EASE(
                gsap.utils.clamp(0, 1, scrollProgress / REVEAL_END_PROGRESS)
            );

            // Use the existing scrubbed progress: the logo and film timeline
            // retain their original timing. Only the ivory-to-film reveal changes.
            const diffusion = smoothstep(revealProgress);
            gsap.set(logoRef.current, { autoAlpha: mobileViewport.matches ? 1 - diffusion : 1 });
            gsap.set(topButtonRef.current, {
                autoAlpha: 1 - diffusion,
                pointerEvents: revealProgress === 1 ? 'none' : 'auto',
            });
            const settle = smoothstep(gsap.utils.clamp(0, 1, (revealProgress - 0.62) / 0.38));
            const scaleX = 0.18 + diffusion * 3.7;
            const scaleY = 0.24 + diffusion * 3.1;
            gsap.set(mistRef.current, {
                attr: { transform: `translate(${960 - 55 * diffusion} ${540 - 35 * diffusion}) scale(${scaleX} ${scaleY})` },
                opacity: smoothstep(gsap.utils.clamp(0, 1, revealProgress / 0.35)),
            });
            gsap.set(revealOverlayRef.current, {
                opacity: 1 - settle,
                visibility: revealProgress === 1 ? 'hidden' : 'visible',
            });
            gsap.set(canvas, {
                opacity: smoothstep(gsap.utils.clamp(0, 1, revealProgress / 0.75)),
                filter: revealProgress === 1 ? 'none' : `blur(${12 * (1 - diffusion)}px)`,
                scale: 1.03 - diffusion * 0.03,
            });
        };

        const resizeCanvas = () => {
            // Measure layout size, independent of the reveal's subtle scale.
            const { clientWidth: width, clientHeight: height } = canvas;
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.max(1, Math.round(width * pixelRatio));
            canvas.height = Math.max(1, Math.round(height * pixelRatio));
            rootRef.current?.style.setProperty(
                '--story-scale',
                Math.max(window.innerWidth / HERO_WIDTH, window.innerHeight / HERO_HEIGHT)
            );
        };

        const drawFrame = (image, frame) => {
            if (!image.complete || image.naturalWidth === 0) return;

            const canvasRatio = canvas.width / canvas.height;
            const imageRatio = image.naturalWidth / image.naturalHeight;
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = image.naturalWidth;
            let sourceHeight = image.naturalHeight;

            if (imageRatio > canvasRatio) {
                sourceWidth = image.naturalHeight * canvasRatio;
                sourceX = (image.naturalWidth - sourceWidth) / 2;
            } else {
                sourceHeight = image.naturalWidth / canvasRatio;
                sourceY = (image.naturalHeight - sourceHeight) / 2;
            }

            canvasContext.drawImage(
                image,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );
            // Start the story only after the final image has actually been drawn.
            updateStoryTimeline(frame);
        };

        const trimFrameCache = (activeFrame) => {
            if (frameCache.size <= FRAME_CACHE_SIZE) return;

            [...frameCache.keys()]
                .sort((a, b) => Math.abs(b - activeFrame) - Math.abs(a - activeFrame))
                .slice(0, frameCache.size - FRAME_CACHE_SIZE)
                .forEach((frame) => {
                    const image = frameCache.get(frame);
                    frameCache.delete(frame);
                    if (!image.complete) {
                        image.onload = null;
                        image.src = '';
                    }
                });
        };

        const loadFrame = (frame, shouldDraw = false) => {
            if (frameCache.has(frame)) {
                const cachedImage = frameCache.get(frame);
                if (shouldDraw && cachedImage.complete) drawFrame(cachedImage, frame);
                return;
            }

            const image = new Image();
            frameCache.set(frame, image);
            image.onload = () => {
                if (disposed) return;
                // A prefetched image may become the requested frame while loading.
                if (frame === requestedFrame) drawFrame(image, frame);
                trimFrameCache(requestedFrame);
            };
            image.src = frameSrc(frame);
            trimFrameCache(requestedFrame);
        };

        const updateTargetTime = () => {
            const videoProgress = remapSequenceProgress(scrollProgress);
            targetTime = videoProgress * VIDEO_DURATION_FALLBACK;
        };

        const smoothSequenceTime = (frameTime) => {
            const elapsedFrames = Math.max(1, (frameTime - previousFrameTime) / (1000 / 60));
            const smoothing = 1 - Math.pow(1 - SEEK_SMOOTHING, elapsedFrames);
            const difference = targetTime - currentTime;

            if (Math.abs(difference) > 0.001) currentTime += difference * smoothing;

            const sequenceProgress = easeSequenceEdges(
                gsap.utils.clamp(0, 1, currentTime / VIDEO_DURATION_FALLBACK)
            );
            const nextFrame = Math.round(FIRST_FRAME + sequenceProgress * (FRAME_COUNT - 1));
            if (nextFrame !== requestedFrame) {
                requestedFrame = nextFrame;
                loadFrame(requestedFrame, true);
                loadFrame(Math.min(LAST_FRAME, requestedFrame + 1));
            }

            const cameraProgress = CAMERA_EASE(
                gsap.utils.clamp(
                    0,
                    1,
                    (sequenceProgress - LOGO_SEQUENCE_START) /
                        (CAMERA_MOVE_END_PROGRESS - LOGO_SEQUENCE_START)
                )
            );
            gsap.set(logoRef.current, { y: LOGO_EXIT_Y * cameraProgress });

            previousFrameTime = frameTime;
            frameRequest = window.requestAnimationFrame(smoothSequenceTime);
        };

        const context = gsap.context(() => {
            updateReveal();
            gsap.set(logoRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
            gsap.set(storyRef.current, { autoAlpha: 0 });
            gsap.set('[data-story-plant]', { autoAlpha: 0, y: 42, rotate: -2.8 });
            gsap.set('[data-story-paper]', { autoAlpha: 0, x: -34, y: 34, rotate: -24.5 });
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
                    0.05
                )
                .to(
                    '[data-story-paper]',
                    {
                        autoAlpha: 1,
                        x: 0,
                        y: 0,
                        rotate: -17.01,
                        duration: 0.95,
                    },
                    0.38
                )
                .to('[data-story-copy]', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.14 }, 0.62)
                .to(
                    '[data-story-title-line]',
                    {
                        clipPath: 'inset(0 0% 0 0)',
                        y: 0,
                        duration: 1.05,
                        stagger: 0.2,
                        ease: 'power1.inOut',
                    },
                    0.82
                )
                .to('[data-story-button]', { autoAlpha: 1, y: 0, duration: 0.55 }, 1.75);

            const scrollState = { progress: 0 };


            const scrollTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: `+=${SCROLL_DISTANCE}`,
                    pin: true,
                    scrub: 0.7,
                    invalidateOnRefresh: true,
                },
            });

            scrollTimeline
                .to(
                    scrollState,
                    {
                        progress: 1,
                        duration: 1,
                        ease: 'none',
                        onUpdate: () => {
                            maxScrollProgress = Math.max(maxScrollProgress, scrollState.progress);
                            scrollProgress = maxScrollProgress;
                            updateTargetTime();
                            updateReveal();
                        },
                    },
                    0
                );
        }, rootRef);

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
            const currentImage = frameCache.get(requestedFrame);
            if (currentImage?.complete) drawFrame(currentImage, requestedFrame);
        });
        resizeObserver.observe(canvas);
        resizeCanvas();
        loadFrame(FIRST_FRAME, true);
        frameRequest = window.requestAnimationFrame(smoothSequenceTime);

        return () => {
            disposed = true;
            resizeObserver.disconnect();
            window.cancelAnimationFrame(frameRequest);
            frameCache.clear();
            context.revert();
        };
    }, [isMobile]);

    return (
        <><section ref={rootRef} className="home-intro" data-node-id="1991:658">
            {isMobile && <video ref={mobileVideoRef} className="home-intro__mobile-film"
                src={mobileFilm} poster={mobileHero} preload="auto" muted playsInline
                aria-label="Diptyque 모바일 히어로 영상"
                onEnded={() => {
                    const root = rootRef.current;
                    const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height ?? 52;
                    if (!root || root.getBoundingClientRect().bottom <= headerHeight) return;
                    downButtonRef.current?.click();
                }} />}
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
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                    });
                }}
            ><img src={mobileScrollDown} alt="" aria-hidden="true" /></button>}
            <canvas
                ref={canvasRef}
                className="home-intro__video"
                role="img"
                aria-label="Diptyque hero animation"
            />
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
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
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
                        src={storyObject}
                        alt=""
                    />
                    <div className="home-intro__story-leaf" data-story-plant data-node-id="2863:8516">
                        <img src={storyLeafDrawing} alt="" />
                    </div>
                    <p className="home-intro__story-year" data-story-copy data-node-id="2863:8514">
                        1961
                    </p>
                    <figure className="home-intro__story-photo" data-story-paper data-node-id="2863:8517">
                        <img src={storyFoundersPhoto} alt="The founders of Diptyque" />
                        <figcaption className="home-intro__story-photo-caption">
                            THE FOUNDERS OF DIPTYQUE
                        </figcaption>
                        <span className="home-intro__story-photo-code">3/61 PAR</span>
                        <span className="home-intro__story-photo-number">34</span>
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
        </section>{isMobile && <MobileIntroStory />}</>
    );
}
