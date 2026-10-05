import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const SCROLL_DISTANCE = 3600;
const REVEAL_END = 0.4;
const PLAYBACK_REVEAL_START = 0.04;
const CAMERA_END = 6 / 14;
// First step out of the doorway in the desktop film (media seconds).
const STORY_START_TIME = 11.3;
const smoothstep = p => p * p * (3 - 2 * p);

// Scroll controls only the existing reveal/pin. The media clock owns playback;
// never seek currentTime or decode/draw video frames in JavaScript.
export default function setupDesktopVideo({ root, video, logo, mist, overlay, topButton, onStoryStart }) {

    const revealEase = gsap.parseEase('power2.inOut');
    const cameraEase = gsap.parseEase('power1.inOut');
    let disposed = false;
    let visible = false;
    let revealProgress = 0;
    let lastReveal = -1;
    let frame = 0;
    let storyStarted = false;
    let storyAnimating = false;
    let additionalPinDistance = 0;
    let touchY = null;
    let trigger;
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
    const scheduleCamera = () => {
        if (frame || disposed || video.paused || document.hidden) return;
        const next = (_now, metadata) => {
            frame = 0;
            const mediaTime = metadata?.mediaTime ?? video.currentTime;
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
        revealProgress = storyStarted ? 1 : revealEase(gsap.utils.clamp(0, 1, progress / REVEAL_END));
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
    const context = gsap.context(() => {
        gsap.set(logo, { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 1 });
        const state = { progress: 0 };
        const timeline = gsap.timeline({ scrollTrigger: {
            id: 'home-intro-video', trigger: root, start: 'top top',
            end: () => `+=${SCROLL_DISTANCE + additionalPinDistance}`, pin: true,
            scrub: 0.8, invalidateOnRefresh: true,
        } });
        trigger = timeline.scrollTrigger;
        timeline.fromTo(state, { progress: 0 }, { progress: 1, duration: 1, ease: 'none', onUpdate: () => paintReveal(state.progress) });
        paintReveal(0);
    }, root);
    const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
    }, { threshold: 0 });
    visibility.observe(root);
    const size = new ResizeObserver(resize);
    size.observe(root);
    resize();
    const onWheel = event => {
        if (!storyAnimating || event.ctrlKey) return;
        if (event.deltaY < 0) finishStory();
        else if (event.deltaY > 0 && event.cancelable) event.preventDefault();
    };
    const onTouchStart = event => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const onTouchMove = event => {
        if (!storyAnimating || touchY === null) return;
        if (event.touches[0]?.clientY > touchY) finishStory();
        else if (event.touches[0]?.clientY < touchY && event.cancelable) event.preventDefault();
    };
    const onKey = event => {
        if (!storyAnimating || event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
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
