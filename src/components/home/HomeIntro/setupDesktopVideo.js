import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const SCROLL_DISTANCE = 3600;
const REVEAL_END = 0.4;
const PLAYBACK_REVEAL_START = 0.18;
const VIDEO_REVEAL_SECONDS = 2.4;
const CAMERA_END = 6 / 14;
// First step out of the doorway in the desktop film (media seconds).
const STORY_START_TIME = 11.3;
const MAX_LOCKED_SCROLL_STEP = 160;
const INITIAL_REVEAL_DURATION = 0.9;
const smoothstep = p => p * p * (3 - 2 * p);

// Scroll controls only the existing reveal/pin. The media clock owns playback;
// never seek currentTime or decode/draw video frames in JavaScript.
export default function setupDesktopVideo({ root, video, logo, mist, overlay, topButton, onStoryStart }) {

    const revealEase = gsap.parseEase('power2.inOut');
    const cameraEase = gsap.parseEase('power1.inOut');
    let disposed = false;
    let visible = false;
    let revealProgress = 0;
    let scrollRevealProgress = 0;
    let revealCanOnlyAdvance = false;
    let lastReveal = -1;
    let frame = 0;
    let storyStarted = false;
    let storyAnimating = false;
    let additionalPinDistance = 0;
    let touchY = null;
    let initialRevealStarted = false;
    let revealTween;
    let trigger;
    const loadingIsActive = () => Boolean(document.querySelector('.intro-video'));
    // Keep the browser's initial autoplay buffering priority. onPlay below
    // pauses before presentation if the logo reveal is still covering it.

    const resize = () => root.style.setProperty('--story-scale', Math.max(innerWidth / 1920, innerHeight / 1080));
    const cancelCamera = () => {
        if (video.requestVideoFrameCallback) video.cancelVideoFrameCallback(frame);
        else cancelAnimationFrame(frame);
        frame = 0;
    };
    const paintCamera = mediaTime => {
        const p = video.duration > 0 ? mediaTime / video.duration : 0;
        const camera = cameraEase(gsap.utils.clamp(0, 1, (p - 0.012) / (CAMERA_END - 0.012)));
        gsap.set(logo, { y: -760 * camera });
        return p < CAMERA_END;
    };
    const paintMediaReveal = mediaTime => {
        const mediaReveal = gsap.utils.clamp(0, 1, mediaTime / VIDEO_REVEAL_SECONDS) * REVEAL_END;
        paintReveal(Math.max(scrollRevealProgress, mediaReveal));
    };
    const scheduleCamera = () => {
        if (frame || disposed || video.paused || document.hidden) return;
        const next = (_now, metadata) => {
            frame = 0;
            const mediaTime = metadata?.mediaTime ?? video.currentTime;
            paintMediaReveal(mediaTime);
            const cameraMoving = paintCamera(mediaTime);
            beginStory(mediaTime);
            if (cameraMoving || !storyStarted) scheduleCamera();
        };
        frame = video.requestVideoFrameCallback
            ? video.requestVideoFrameCallback(next) : requestAnimationFrame(next);
    };
    const finishStory = () => {
        if (disposed || !storyAnimating) return;
        storyAnimating = false;
        additionalPinDistance = 0;
        trigger?.refresh();
    };
    const beginStory = (mediaTime = video.currentTime) => {
        if (disposed || storyStarted || (mediaTime < STORY_START_TIME && !video.ended) || !visible || document.hidden) return;
        storyStarted = true;
        // Reveal the artwork as the woman exits; the film keeps playing behind it.
        // A short initial scroll must not leave the artwork behind the white mask.
        paintReveal(REVEAL_END);
        storyAnimating = true;
        const travelled = trigger ? Math.max(0, trigger.scroll() - trigger.start) : 0;
        additionalPinDistance = Math.max(0, travelled - SCROLL_DISTANCE) + Math.ceil(innerHeight * 2.3);
        trigger?.refresh();
        onStoryStart();
    };
    const canPlay = () => visible && revealProgress >= PLAYBACK_REVEAL_START && !document.hidden && !document.querySelector('.intro-video');
    const syncPlayback = () => {
        if (disposed) return;
        if (video.ended) { beginStory(); return; }
        if (!canPlay()) { if (!video.paused) video.pause(); return; }
        if (video.paused) video.play().catch(error => {
            if (!disposed && error.name === 'NotAllowedError') video.controls = true;
        });
    };
    const onPlay = () => {
        // autoPlay is present for browser policy, but the film must not run
        // invisibly behind the initial logo or the expensive SVG reveal.
        if (!canPlay()) video.pause();
    };
    const onPlaying = () => {
        if (!canPlay()) { video.pause(); return; }
        revealCanOnlyAdvance = true;
        video.controls = false;
        root.dataset.videoState = 'playing';
        scheduleCamera();
    };
    const onEnd = () => {
        cancelCamera();
        paintCamera(video.duration);
        root.dataset.videoState = 'ended';
        beginStory();
    };
    const onTimeUpdate = () => beginStory();
    const onError = () => {
        // A failed movie must never leave scroll input locked.
        finishStory();
        root.dataset.videoState = 'error';
    };
    const paintReveal = progress => {
        if (storyAnimating) return;
        const nextReveal = storyStarted ? 1 : revealEase(gsap.utils.clamp(0, 1, progress / REVEAL_END));
        revealProgress = revealCanOnlyAdvance ? Math.max(revealProgress, nextReveal) : nextReveal;
        if (revealProgress === lastReveal) return;
        lastReveal = revealProgress;
        const diffusion = smoothstep(revealProgress);
        const settle = smoothstep(gsap.utils.clamp(0, 1, (revealProgress - 0.62) / 0.38));
        gsap.set(topButton, { autoAlpha: 1 - diffusion, pointerEvents: revealProgress === 1 ? 'none' : 'auto' });
        gsap.set(mist, {
            attr: { transform: `translate(${960 - 55 * diffusion} ${540 - 35 * diffusion}) scale(${0.18 + diffusion * 3.7} ${0.24 + diffusion * 3.1})` },
            opacity: smoothstep(gsap.utils.clamp(0, 1, revealProgress / 0.35)),
        });
        gsap.set(overlay, { opacity: 1 - settle, visibility: revealProgress === 1 ? 'hidden' : 'visible' });
        gsap.set(video, { opacity: smoothstep(gsap.utils.clamp(0, 1, revealProgress / 0.75)), scale: 1.03 - diffusion * 0.03 });
        syncPlayback();
    };
    const startInitialReveal = () => {
        if (initialRevealStarted || storyStarted || disposed) return;
        initialRevealStarted = true;
        // The first downward intent starts one continuous reveal. It must not
        // stop halfway merely because the wheel/touch gesture was short.
        revealCanOnlyAdvance = true;
        const revealState = { progress: Math.max(scrollRevealProgress, revealProgress * REVEAL_END) };
        revealTween = gsap.to(revealState, {
            progress: REVEAL_END,
            duration: INITIAL_REVEAL_DURATION,
            ease: 'power2.inOut',
            overwrite: true,
            onUpdate: () => paintReveal(revealState.progress),
            onComplete: () => paintReveal(REVEAL_END),
        });
    };
    const context = gsap.context(() => {
        gsap.set(logo, { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 1 });
        const state = { progress: 0 };
        const timeline = gsap.timeline({ scrollTrigger: {
            id: 'home-intro-video', trigger: root, start: 'top top',
            end: () => `+=${SCROLL_DISTANCE + additionalPinDistance}`, pin: true,
            scrub: 0.8, invalidateOnRefresh: true,
        } });
        trigger = timeline.scrollTrigger;
        timeline.fromTo(state, { progress: 0 }, {
            progress: 1,
            duration: 1,
            ease: 'none',
            onUpdate: () => {
                scrollRevealProgress = state.progress;
                paintReveal(scrollRevealProgress);
            },
        });
        paintReveal(0);
    }, root);
    const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (storyStarted) {
            window.dispatchEvent(new CustomEvent('home-intro-header-visibility', {
                detail: { visible: true, locked: visible },
            }));
        }
        syncPlayback();
    }, { threshold: 0 });
    visibility.observe(root);
    const size = new ResizeObserver(resize);
    size.observe(root);
    resize();
    const onWheel = event => {
        if (loadingIsActive()) {
            if (event.cancelable) event.preventDefault();
            return;
        }
        if (event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (!storyStarted && visible && event.deltaY > 0) {
            if (event.cancelable) event.preventDefault();
            startInitialReveal();
            const maxScroll = Math.max(trigger?.start ?? 0, (trigger?.end ?? 0) - 1);
            const step = Math.min(event.deltaY, MAX_LOCKED_SCROLL_STEP);
            window.scrollTo({ top: Math.min(window.scrollY + step, maxScroll), behavior: 'instant' });
            return;
        }
        if (!storyAnimating) return;
        if (event.deltaY < 0) finishStory();
        else if (event.deltaY > 0 && event.cancelable) event.preventDefault();
    };
    const onTouchStart = event => {
        touchY = loadingIsActive() ? null : (event.touches.length === 1 ? event.touches[0].clientY : null);
    };
    const onTouchMove = event => {
        if (loadingIsActive()) {
            if (event.cancelable) event.preventDefault();
            touchY = null;
            return;
        }
        if (touchY === null) return;
        const nextY = event.touches[0]?.clientY;
        if (!storyStarted && visible && nextY < touchY) {
            if (event.cancelable) event.preventDefault();
            startInitialReveal();
            const maxScroll = Math.max(trigger?.start ?? 0, (trigger?.end ?? 0) - 1);
            const step = Math.min(touchY - nextY, MAX_LOCKED_SCROLL_STEP);
            window.scrollTo({ top: Math.min(window.scrollY + step, maxScroll), behavior: 'instant' });
        } else if (storyAnimating && nextY > touchY) finishStory();
        else if (storyAnimating && nextY < touchY && event.cancelable) event.preventDefault();
        touchY = nextY;
    };
    const onKey = event => {
        if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
        if (loadingIsActive() && [' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            return;
        }
        if (!storyStarted && visible && [' ', 'ArrowDown', 'PageDown', 'End'].includes(event.key) && !(event.key === ' ' && event.shiftKey)) {
            event.preventDefault();
            startInitialReveal();
            const maxScroll = Math.max(trigger?.start ?? 0, (trigger?.end ?? 0) - 1);
            window.scrollTo({ top: Math.min(window.scrollY + MAX_LOCKED_SCROLL_STEP, maxScroll), behavior: 'instant' });
            return;
        }
        if (!storyAnimating) return;
        if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey)) finishStory();
        else if ([' ', 'ArrowDown', 'PageDown', 'End'].includes(event.key)) event.preventDefault();
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', cancelCamera);
    video.addEventListener('ended', onEnd);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('error', onError);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', onKey, true);
    root.addEventListener('home-intro-story-complete', finishStory);
    return () => {
        disposed = true;
        visibility.disconnect();
        size.disconnect();
        revealTween?.kill();
        cancelCamera();
        video.removeEventListener('play', onPlay);
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('pause', cancelCamera);
        video.removeEventListener('ended', onEnd);
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('error', onError);
        document.removeEventListener('visibilitychange', syncPlayback);
        window.removeEventListener('wheel', onWheel, true);
        window.removeEventListener('touchstart', onTouchStart, true);
        window.removeEventListener('touchmove', onTouchMove, true);
        window.removeEventListener('keydown', onKey, true);
        root.removeEventListener('home-intro-story-complete', finishStory);
        if (!video.paused) video.pause();
        context.revert();
    };
}
