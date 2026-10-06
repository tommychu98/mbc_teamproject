import gsap from 'gsap';

// Change playback speed only; the media clock still drives the camera/story cues.
export default function setupScrollPlaybackRate({ root, video }) {
    const baseRate = video.defaultPlaybackRate;
    const fastRate = baseRate * 2 * 1.7;
    let target = baseRate;
    let tween;
    let releaseTimer;
    let touchY = null;

    const transition = (rate, duration) => {
        if (target === rate) return;
        target = rate;
        tween?.kill();
        tween = gsap.to(video, { playbackRate: rate, duration, ease: 'power2.inOut' });
    };
    const release = () => {
        clearTimeout(releaseTimer);
        transition(baseRate, 0.6);
    };
    const accelerate = delta => {
        if (delta < 0) { release(); return; }
        if (!delta || video.paused || video.ended || document.hidden) return;
        const bounds = root.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
        transition(fastRate, 0.35);
        clearTimeout(releaseTimer);
        // Let a single wheel notch finish accelerating before easing back down.
        releaseTimer = setTimeout(release, 400);
    };
    const onWheel = event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        accelerate(event.deltaY);
    };
    const onTouchStart = event => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const onTouchMove = event => {
        if (touchY === null || event.touches.length !== 1) return;
        const nextY = event.touches[0].clientY;
        accelerate(touchY - nextY);
        touchY = nextY;
    };
    const onTouchEnd = () => { touchY = null; };
    const reset = () => {
        clearTimeout(releaseTimer);
        tween?.kill();
        target = baseRate;
        video.playbackRate = baseRate;
    };
    const onVisibility = () => { if (document.hidden) reset(); };
    const options = { passive: true, capture: true };
    root.addEventListener('wheel', onWheel, options);
    root.addEventListener('touchstart', onTouchStart, options);
    root.addEventListener('touchmove', onTouchMove, options);
    root.addEventListener('touchend', onTouchEnd, options);
    root.addEventListener('touchcancel', onTouchEnd, options);
    video.addEventListener('pause', reset);
    video.addEventListener('ended', reset);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
        reset();
        root.removeEventListener('wheel', onWheel, true);
        root.removeEventListener('touchstart', onTouchStart, true);
        root.removeEventListener('touchmove', onTouchMove, true);
        root.removeEventListener('touchend', onTouchEnd, true);
        root.removeEventListener('touchcancel', onTouchEnd, true);
        video.removeEventListener('pause', reset);
        video.removeEventListener('ended', reset);
        document.removeEventListener('visibilitychange', onVisibility);
    };
}
