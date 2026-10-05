import gsap from 'gsap';

const PLAYBACK_REVEAL_START = 0.04;

export default function setupMobileIntro({ root, video, logo, mist, overlay, topButton, downButton }) {
    let started = false;
    let consumeGesture = false;
    let disposed = false;
    let visible = false;
    // Gate presentation in onPlay, without cancelling initial media buffering.
    const reveal = { progress: 0 };

    const paint = () => {
        const p = gsap.parseEase('power2.inOut')(reveal.progress);
        const diffusion = p * p * (3 - 2 * p);
        const settle = gsap.utils.clamp(0, 1, (p - .62) / .38);
        gsap.set(mist, { attr: { transform: `translate(${960 - 55 * diffusion} ${540 - 35 * diffusion}) scale(${.18 + diffusion * 3.7} ${.24 + diffusion * 3.1})` }, opacity: gsap.utils.clamp(0, 1, p / .35) });
        gsap.set(overlay, { opacity: 1 - settle * settle * (3 - 2 * settle), visibility: p === 1 ? 'hidden' : 'visible' });
        gsap.set([logo, topButton], { autoAlpha: 1 - diffusion });
        gsap.set(topButton, { pointerEvents: p === 1 ? 'none' : 'auto' });
        gsap.set(downButton, { autoAlpha: p === 1 ? .8 : 0, pointerEvents: p === 1 ? 'auto' : 'none' });
        gsap.set(video, { opacity: Math.min(1, p / .75) });
        syncPlayback();
    };
    const syncPlayback = () => {
        if (disposed || video.ended) return;
        if (!visible || reveal.progress < PLAYBACK_REVEAL_START || document.hidden) { if (!video.paused) video.pause(); return; }
        video.play().catch(error => { if (!disposed && error.name === 'NotAllowedError') video.controls = true; });
    };
    const onPlay = () => {
        if (!visible || reveal.progress < PLAYBACK_REVEAL_START || document.hidden) video.pause();
    };
    const onPlaying = () => { video.controls = false; root.dataset.videoState = 'playing'; };
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); });
    visibility.observe(root);
    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlaying);
    document.addEventListener('visibilitychange', syncPlayback);
    let timeline;
    const context = gsap.context(() => {
        gsap.set(logo, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
        paint();
        timeline = gsap.timeline({ paused: true }).to(reveal, {
            progress: 1, duration: 1.3, ease: 'none', onUpdate: paint,
            onComplete: syncPlayback,
        });
    }, root);
    let autoStartTimer;
    const start = () => {
        if (started || disposed || document.querySelector('.intro-video')) return;
        started = true;
        clearTimeout(autoStartTimer);
        observer.disconnect();
        timeline.play();
    };
    const scheduleStart = () => {
        if (started || autoStartTimer || document.querySelector('.intro-video')) return;
        autoStartTimer = setTimeout(start, 500);
    };
    const observer = new MutationObserver(scheduleStart);
    observer.observe(document.body, { childList: true, subtree: true });
    const isControl = target => target instanceof Element && !!target.closest('button, a, input');
    const onTouchStart = event => {
        consumeGesture = false;
        if ((started && reveal.progress === 1) || event.touches.length !== 1 || isControl(event.target)) return;
        consumeGesture = true;
        if (event.cancelable) event.preventDefault();
        start();
    };
    const onTouchMove = event => { if (consumeGesture && event.cancelable) event.preventDefault(); };
    const onTouchEnd = () => { consumeGesture = false; };
    const onWheel = event => {
        if ((started && reveal.progress === 1) || !event.deltaY || isControl(event.target)) return;
        if (event.cancelable) event.preventDefault();
        start();
    };
    const onPointerDown = event => { if (event.pointerType !== 'touch' && !isControl(event.target)) start(); };
    const onKeyDown = event => {
        if ((started && reveal.progress === 1) || isControl(event.target) || !['Enter', ' ', 'ArrowDown', 'PageDown'].includes(event.key)) return;
        event.preventDefault();
        start();
    };
    root.addEventListener('touchstart', onTouchStart, { passive: false });
    root.addEventListener('touchmove', onTouchMove, { passive: false });
    root.addEventListener('touchend', onTouchEnd);
    root.addEventListener('touchcancel', onTouchEnd);
    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    scheduleStart();
    return () => {
        disposed = true;
        observer.disconnect();
        visibility.disconnect();
        video.removeEventListener('play', onPlay);
        video.removeEventListener('playing', onPlaying);
        document.removeEventListener('visibilitychange', syncPlayback);
        clearTimeout(autoStartTimer);
        root.removeEventListener('touchstart', onTouchStart);
        root.removeEventListener('touchmove', onTouchMove);
        root.removeEventListener('touchend', onTouchEnd);
        root.removeEventListener('touchcancel', onTouchEnd);
        root.removeEventListener('wheel', onWheel);
        root.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('keydown', onKeyDown);
        if (!video.paused) video.pause();
        context.revert();
    };
}
