import { useCallback, useLayoutEffect, useRef } from 'react';
import { createDampedValue, MOTION_RESPONSE } from '../../../utils/scrollMotion';

const HOLD_VIEWPORTS = 0.65;
const TRANSITION_VIEWPORTS = 0.85;
const FINAL_HOLD_VIEWPORTS = 0.4;
const MOBILE_AUTOPLAY_MS = 5000;
const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

export default function usePerfumeHistoryScroll(sectionRef, stageRef, photoTrackRef, logoTrackRef, slides, setStoryState) {
    const scrollUnitRef = useRef(0);
    const totalDistance = (slides.length - 1) * (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS) + FINAL_HOLD_VIEWPORTS;

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;

        const mobile = window.matchMedia('(max-width: 767px)');
        let frameId = 0;
        let previousIndex = -1;
        let previousTransition = null;
        let mobileIndex = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let horizontalGesture = false;
        let verticalGesture = false;
        let touching = false;
        let autoplayFrame = 0;
        let elapsed = 0;
        let lastTick = 0;
        const photoMotion = createDampedValue({ response: MOTION_RESPONSE.scene, maxLag: 12, epsilon: 0.001 });
        const logoMotion = createDampedValue({ response: MOTION_RESPONSE.foreground, maxLag: 12, epsilon: 0.001 });

        const paintMobile = (index, animate = true) => {
            mobileIndex = ((index % slides.length) + slides.length) % slides.length;
            elapsed = 0;
            section.style.setProperty('--history-autoplay-progress', '0');
            photoTrackRef.current.dataset.animate = String(animate);
            logoTrackRef.current.dataset.animate = String(animate);
            photoTrackRef.current.style.transform = `translate3d(${mobileIndex * 100}cqw, 0, 0)`;
            logoTrackRef.current.style.transform = `translate3d(${-mobileIndex * 100}cqw, 0, 0)`;
            section.dataset.slideProgress = String(mobileIndex);
            setStoryState({ activeIndex: mobileIndex, isTransitioning: false });
        };

        const paint = now => {
            frameId = 0;
            if (mobile.matches) {
                const bounds = section.getBoundingClientRect();
                section.dataset.pinned = String(bounds.top <= stage.offsetTop && bounds.bottom > stage.offsetTop);
                return;
            }
            const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
            const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
            const offset = stickyTop - section.getBoundingClientRect().top;
            const progress = distance > 0 ? clamp(offset / distance) : 0;
            section.dataset.pinned = String(offset >= 0 && offset <= distance);
            const position = Math.min(totalDistance, Math.max(0, offset / scrollUnitRef.current));
            const segment = Math.min(slides.length - 1, Math.floor(position / (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS)));
            const localPosition = position - segment * (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS);
            const rawTransition = segment < slides.length - 1 ? clamp((localPosition - HOLD_VIEWPORTS) / TRANSITION_VIEWPORTS) : 0;
            // Document scroll positions round to pixels. Snap only sub-pixel
            // endpoints so a button landing on a hold is never left disabled.
            const epsilon = 1 / (scrollUnitRef.current * TRANSITION_VIEWPORTS);
            const transition = rawTransition < epsilon ? 0 : rawTransition > 1 - epsilon ? 1 : rawTransition;
            const eased = smoothstep(transition);
            const next = Math.min(slides.length - 1, segment + 1);
            const interpolate = (property) => {
                const from = parseFloat(slides[segment][property]);
                const to = parseFloat(slides[next][property]);
                return from + (to - from) * eased;
            };

            // Preserve the original paths; the two tracks settle with different weights.
            const mobileShift = (segment + eased) * 100;
            const photoShift = photoMotion.update(mobile.matches ? mobileShift : interpolate('photoShift'), now, false);
            const logoShift = logoMotion.update(mobile.matches ? -mobileShift : interpolate('logoShift'), now, false);
            photoTrackRef.current.style.transform = `translate3d(${photoShift}cqw, 0, 0)`;
            logoTrackRef.current.style.transform = `translate3d(${logoShift}cqw, 0, 0)`;
            const activeIndex = segment + (eased >= 0.5 && next !== segment ? 1 : 0);
            const isTransitioning = (transition > 0 && transition < 1) || photoMotion.moving || logoMotion.moving;
            section.dataset.scrollProgress = progress.toFixed(6);
            section.dataset.slideProgress = (segment + eased).toFixed(6);
            if (activeIndex !== previousIndex || isTransitioning !== previousTransition) {
                previousIndex = activeIndex;
                previousTransition = isTransitioning;
                setStoryState({ activeIndex, isTransitioning });
            }
            if (photoMotion.moving || logoMotion.moving) frameId = requestAnimationFrame(paint);
        };

        const schedulePaint = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };
        // Home paging exclusively owns vertical movement on mobile.
        const onScroll = schedulePaint;
        const onTouchStart = (event) => {
            if (!mobile.matches || event.touches.length !== 1) return;
            touching = true;
            elapsed = 0;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            horizontalGesture = false;
            verticalGesture = false;
        };
        const onTouchMove = (event) => {
            if (!mobile.matches || event.touches.length !== 1) return;
            const deltaX = event.touches[0].clientX - touchStartX;
            const deltaY = event.touches[0].clientY - touchStartY;
            if (!horizontalGesture && !verticalGesture && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 10) {
                horizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);
                verticalGesture = !horizontalGesture;
            }
            if (horizontalGesture) {
                if (event.cancelable) event.preventDefault();
                const width = Math.max(1, stage.clientWidth);
                const rawProgress = mobileIndex - deltaX / width;
                const progress = rawProgress < 0
                    ? rawProgress * .18
                    : rawProgress > slides.length - 1
                        ? slides.length - 1 + (rawProgress - (slides.length - 1)) * .18
                        : rawProgress;
                photoTrackRef.current.dataset.animate = 'false';
                logoTrackRef.current.dataset.animate = 'false';
                photoTrackRef.current.style.transform = `translate3d(${progress * 100}cqw, 0, 0)`;
                logoTrackRef.current.style.transform = `translate3d(${-progress * 100}cqw, 0, 0)`;
            }
        };
        const onTouchEnd = (event) => {
            touching = false;
            elapsed = 0;
            if (mobile.matches && horizontalGesture) {
                const endX = event.changedTouches[0]?.clientX ?? touchStartX;
                const deltaX = endX - touchStartX;
                const nextIndex = Math.abs(deltaX) >= 42 ? mobileIndex + (deltaX < 0 ? 1 : -1) : mobileIndex;
                paintMobile(nextIndex);
                horizontalGesture = false;
                return;
            }
        };
        const onTouchCancel = () => {
            touching = false;
            horizontalGesture = false;
            verticalGesture = false;
            if (mobile.matches) paintMobile(mobileIndex);
        };
        const tickAutoplay = (now) => {
            const bounds = stage.getBoundingClientRect();
            const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
            const running = mobile.matches && !document.hidden && !touching
                && visibleHeight >= Math.min(stage.clientHeight, window.innerHeight) * .6;
            if (running) {
                elapsed += lastTick ? Math.min(now - lastTick, 100) : 0;
                if (elapsed >= MOBILE_AUTOPLAY_MS) paintMobile(mobileIndex + 1);
            } else {
                elapsed = 0;
            }
            section.style.setProperty('--history-autoplay-progress', String(elapsed / MOBILE_AUTOPLAY_MS));
            lastTick = now;
            autoplayFrame = requestAnimationFrame(tickAutoplay);
        };
        const measure = () => {
            const stageHeight = stage.offsetHeight;
            const unit = Math.max(window.innerHeight, stageHeight);
            scrollUnitRef.current = unit;
            section.style.setProperty('--history-stage-height', `${stageHeight}px`);
            section.style.setProperty('--history-scroll-distance', mobile.matches ? '0px' : `${unit * totalDistance}px`);
            if (mobile.matches) paintMobile(mobileIndex, false);
            schedulePaint();
        };

        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        window.addEventListener('scroll', onScroll, { passive: true });
        stage.addEventListener('touchstart', onTouchStart, { passive: true });
        stage.addEventListener('touchmove', onTouchMove, { passive: false });
        stage.addEventListener('touchend', onTouchEnd, { passive: true });
        stage.addEventListener('touchcancel', onTouchCancel, { passive: true });
        window.addEventListener('resize', measure);

        measure();
        autoplayFrame = requestAnimationFrame(tickAutoplay);

        return () => {
            cancelAnimationFrame(frameId);
            cancelAnimationFrame(autoplayFrame);
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
            stage.removeEventListener('touchstart', onTouchStart);
            stage.removeEventListener('touchmove', onTouchMove);
            stage.removeEventListener('touchend', onTouchEnd);
            stage.removeEventListener('touchcancel', onTouchCancel);
            window.removeEventListener('resize', measure);

        };
    }, [sectionRef, stageRef, photoTrackRef, logoTrackRef, slides, setStoryState, totalDistance]);

    // Buttons follow the same document scroll timeline as wheel, touch and
    // keyboard scrolling, so they cannot desynchronise the story state.
    return useCallback((index) => {
        if (index < 0 || index >= slides.length) return;
        if (window.matchMedia('(max-width: 767px)').matches) {
            photoTrackRef.current.dataset.animate = 'true';
            logoTrackRef.current.dataset.animate = 'true';
            photoTrackRef.current.style.transform = `translate3d(${index * 100}cqw, 0, 0)`;
            logoTrackRef.current.style.transform = `translate3d(${-index * 100}cqw, 0, 0)`;
            setStoryState({ activeIndex: index, isTransitioning: false });
            return;
        }
        const section = sectionRef.current;
        const start = section.getBoundingClientRect().top + window.scrollY;
        const position = index * (HOLD_VIEWPORTS + TRANSITION_VIEWPORTS);
        window.scrollTo({
            top: start - (parseFloat(getComputedStyle(stageRef.current).top) || 0) + position * scrollUnitRef.current,
            behavior: 'smooth',
        });
    }, [sectionRef, stageRef, photoTrackRef, logoTrackRef, slides, setStoryState]);
}
