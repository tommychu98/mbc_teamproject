import { useId, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from './assets/diptyque-sketch-logo-transparent.png';
import storyObject from './assets/story-object.png';
import storyLeafDrawing from './assets/story-leaf-drawing.png';
import storyFoundersPhoto from './assets/story-founders-photo.png';
import storyButtonLine from './assets/story-button-line.svg';
import './HomeIntro.css';

gsap.registerPlugin(ScrollTrigger);

const INITIAL_HOLE_WIDTH = 0;
const INITIAL_HOLE_HEIGHT = 0;
const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;
const INITIAL_HOLE_X = (HERO_WIDTH - INITIAL_HOLE_WIDTH) / 2;
const INITIAL_HOLE_Y = (HERO_HEIGHT - INITIAL_HOLE_HEIGHT) / 2;
const REVEAL_END_PROGRESS = 0.4;
const SEQUENCE_DRIFT_START = REVEAL_END_PROGRESS;
const SEQUENCE_MAIN_START = 0.58;
const SEQUENCE_COMPLETE_PROGRESS = 0.94;
const STORY_TRIGGER_PROGRESS = 0.8;
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
    const maskId = `home-intro-mask-${useId().replace(/:/g, '')}`;
    const rootRef = useRef(null);
    const holeRef = useRef(null);
    const canvasRef = useRef(null);
    const logoRef = useRef(null);
    const storyRef = useRef(null);
    const storyTimelineRef = useRef(null);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        const frameCache = new Map();
        let frameRequest = 0;
        let previousFrameTime = performance.now();
        let targetTime = 0;
        let currentTime = 0;
        let scrollProgress = 0;
        let maxScrollProgress = 0;
        let requestedFrame = FIRST_FRAME;
        let disposed = false;

        const updateStoryTimeline = (activeFrame) => {
            const storyTimeline = storyTimelineRef.current;
            if (!storyTimeline) return;

            const hasReachedFinalFrame =
                scrollProgress >= STORY_TRIGGER_PROGRESS || activeFrame >= LAST_FRAME - 1;

            if (hasReachedFinalFrame) {
                storyTimeline.play();
            }
        };

        const updateReveal = () => {
            const revealProgress = REVEAL_EASE(
                gsap.utils.clamp(0, 1, scrollProgress / REVEAL_END_PROGRESS)
            );

            gsap.set(holeRef.current, {
                attr: {
                    x: INITIAL_HOLE_X * (1 - revealProgress),
                    y: INITIAL_HOLE_Y * (1 - revealProgress),
                    width: HERO_WIDTH * revealProgress,
                    height: HERO_HEIGHT * revealProgress,
                },
            });
        };

        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.max(1, Math.round(width * pixelRatio));
            canvas.height = Math.max(1, Math.round(height * pixelRatio));
            rootRef.current?.style.setProperty(
                '--story-scale',
                Math.max(window.innerWidth / HERO_WIDTH, window.innerHeight / HERO_HEIGHT)
            );
        };

        const drawFrame = (image) => {
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
                if (shouldDraw && cachedImage.complete) drawFrame(cachedImage);
                return;
            }

            const image = new Image();
            frameCache.set(frame, image);
            image.onload = () => {
                if (disposed) return;
                if (shouldDraw && frame === requestedFrame) drawFrame(image);
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
            updateStoryTimeline(nextFrame);
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
            gsap.set(holeRef.current, {
                attr: {
                    x: INITIAL_HOLE_X,
                    y: INITIAL_HOLE_Y,
                    width: INITIAL_HOLE_WIDTH,
                    height: INITIAL_HOLE_HEIGHT,
                },
            });
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
            if (currentImage?.complete) drawFrame(currentImage);
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
    }, []);

    return (
        <section ref={rootRef} className="home-intro" data-node-id="1991:658">
            <canvas
                ref={canvasRef}
                className="home-intro__video"
                role="img"
                aria-label="Diptyque hero animation"
            />
            <svg
                className="home-intro__reveal-overlay"
                viewBox={`0 0 ${HERO_WIDTH} ${HERO_HEIGHT}`}
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <mask id={maskId} maskUnits="userSpaceOnUse" maskType="luminance">
                        <rect width={HERO_WIDTH} height={HERO_HEIGHT} fill="white" />
                        <rect
                            ref={holeRef}
                            x={INITIAL_HOLE_X}
                            y={INITIAL_HOLE_Y}
                            width={INITIAL_HOLE_WIDTH}
                            height={INITIAL_HOLE_HEIGHT}
                            fill="black"
                        />
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
        </section>
    );
}
