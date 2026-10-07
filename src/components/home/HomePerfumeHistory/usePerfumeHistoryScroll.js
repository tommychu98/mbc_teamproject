import { useCallback, useLayoutEffect, useRef } from 'react';
import { createDampedValue, MOTION_RESPONSE } from '../../../utils/scrollMotion';

const HOLD_VIEWPORTS = 0.65;
const TRANSITION_VIEWPORTS = 0.85;
const FINAL_HOLD_VIEWPORTS = 0.4;
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
        let settleTimer = 0;
        let touching = false;
        let mobileIndex = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let horizontalGesture = false;
        let verticalGesture = false;
        let verticalDelta = 0;
        let wheelLocked = false;
        const photoMotion = createDampedValue({ response: MOTION_RESPONSE.scene, maxLag: 12, epsilon: 0.001 });
        const logoMotion = createDampedValue({ response: MOTION_RESPONSE.foreground, maxLag: 12, epsilon: 0.001 });

        const paintMobile = (index, animate = true) => {
            mobileIndex = Math.min(slides.length - 1, Math.max(0, index));
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
        const settleSlide = () => {
            clearTimeout(settleTimer);
            if (!mobile.matches || touching || !scrollUnitRef.current) return;
            const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
            const offset = stickyTop - section.getBoundingClientRect().top;
            const unit = scrollUnitRef.current;
            const position = offset / unit;
            if (position < 0 || position >= totalDistance) return;
            const segmentLength = HOLD_VIEWPORTS + TRANSITION_VIEWPORTS;
            const segment = Math.floor(position / segmentLength);
            const localPosition = position - segment * segmentLength;
            // Only settle a partial transition; leave the reading holds and
            // section entry/exit free for ordinary vertical scrolling.
            if (segment >= slides.length - 1 || localPosition <= HOLD_VIEWPORTS) return;
            const transition = (localPosition - HOLD_VIEWPORTS) / TRANSITION_VIEWPORTS;
            const index = segment + (transition >= 0.5 ? 1 : 0);
            const hold = index === slides.length - 1 ? FINAL_HOLD_VIEWPORTS : HOLD_VIEWPORTS;
            const targetOffset = (index * segmentLength + hold / 2) * unit;
            window.scrollTo({
                top: window.scrollY + targetOffset - offset,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            });
        };
        const scheduleSettle = () => {
            clearTimeout(settleTimer);
            if (mobile.matches && !touching) settleTimer = setTimeout(settleSlide, 180);
        };
        const onScroll = () => { schedulePaint(); scheduleSettle(); };
        const onTouchStart = (event) => {
            touching = true;
            clearTimeout(settleTimer);
            if (!mobile.matches || event.touches.length !== 1) return;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            horizontalGesture = false;
            verticalGesture = false;
            verticalDelta = 0;
        };
        const onTouchMove = (event) => {
            if (!mobile.matches || event.touches.length !== 1) return;
            const deltaX = event.touches[0].clientX - touchStartX;
            const deltaY = event.touches[0].clientY - touchStartY;
            if (!horizontalGesture && !verticalGesture && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 10) {
                horizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);
                verticalGesture = !horizontalGesture;
            }
            verticalDelta = deltaY;
            if ((horizontalGesture || verticalGesture) && event.cancelable) event.preventDefault();
        };
        const onTouchEnd = (event) => {
            touching = false;
            if (mobile.matches && horizontalGesture) {
                const endX = event.changedTouches[0]?.clientX ?? touchStartX;
                const deltaX = endX - touchStartX;
                if (Math.abs(deltaX) >= 42) paintMobile(mobileIndex + (deltaX < 0 ? 1 : -1));
                horizontalGesture = false;
                return;
            }
            if (mobile.matches && verticalGesture && Math.abs(verticalDelta) >= 36) {
                const destination = verticalDelta < 0 ? section.nextElementSibling : section.previousElementSibling;
                destination?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                verticalGesture = false;
                return;
            }
            scheduleSettle();
        };
        const onWheel = (event) => {
            if (!mobile.matches || wheelLocked || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 8) return;
            if (event.cancelable) event.preventDefault();
            const destination = event.deltaY > 0 ? section.nextElementSibling : section.previousElementSibling;
            wheelLocked = true;
            destination?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.setTimeout(() => { wheelLocked = false; }, 700);
        };
        const measure = () => {
            const stageHeight = stage.offsetHeight;
            const unit = Math.max(window.innerHeight, stageHeight);
            scrollUnitRef.current = unit;
            section.style.setProperty('--history-stage-height', `${stageHeight}px`);
            // Retain a full pinned viewport on mobile, while vertical input is
            // handled above as one smooth jump to the adjacent section.
            section.style.setProperty('--history-scroll-distance', mobile.matches ? `${unit}px` : `${unit * totalDistance}px`);
            if (mobile.matches) paintMobile(mobileIndex, false);
            schedulePaint();
        };

        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', settleSlide);
        stage.addEventListener('touchstart', onTouchStart, { passive: true });
        stage.addEventListener('touchmove', onTouchMove, { passive: false });
        stage.addEventListener('touchend', onTouchEnd, { passive: true });
        stage.addEventListener('touchcancel', onTouchEnd, { passive: true });
        stage.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('resize', measure);

        measure();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            clearTimeout(settleTimer);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', settleSlide);
            stage.removeEventListener('touchstart', onTouchStart);
            stage.removeEventListener('touchmove', onTouchMove);
            stage.removeEventListener('touchend', onTouchEnd);
            stage.removeEventListener('touchcancel', onTouchEnd);
            stage.removeEventListener('wheel', onWheel);
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
