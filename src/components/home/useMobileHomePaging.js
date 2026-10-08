import { useEffect } from 'react';

// Match History's cubic page transition, with one destination per gesture.
export default function useMobileHomePaging(homeRef) {
    useEffect(() => {
        const mobile = matchMedia('(max-width: 767px)');
        let frame = 0, busy = false, consumed = false, lastWheel = 0;
        let touch = null;
        const stops = () => {
            const header = 52;
            const height = innerHeight - header;
            const maximum = document.documentElement.scrollHeight - innerHeight;
            const positions = [0];
            const sections = [...homeRef.current.querySelectorAll('section')].filter(node => {
                const bounds = node.getBoundingClientRect();
                return bounds.height > 0 && bounds.width > 0 && !node.parentElement.closest('section');
            });
            sections.forEach(section => {
                const top = section.getBoundingClientRect().top + scrollY - header;
                if (section.matches('.home-mobile-story')) {
                    // This is one composition, not two pages. Use layout
                    // coordinates so the entrance animation cannot move the stop.
                    const canvas = section.querySelector('.home-mobile-story__canvas');
                    const house = section.querySelector('.home-mobile-story__house');
                    const scale = parseFloat(getComputedStyle(section).getPropertyValue('--mobile-story-scale')) || 1;
                    const center = canvas && house
                        ? section.offsetHeight / 2 + (house.offsetTop + house.offsetHeight / 2 - canvas.offsetHeight / 2) * scale
                        : section.offsetHeight / 2;
                    const offset = Math.max(0, Math.min(Math.max(0, section.offsetHeight - height), center - height / 2));
                    positions.push(top + offset);
                    return;
                }
                if (section.matches('.night-journey')) {
                    // Travel through the petal bridge without stopping there;
                    // the category is the destination of this continuous scene.
                    const categories = section.querySelector('.mobile-categories');
                    if (categories) {
                        positions.push(categories.getBoundingClientRect().top + scrollY - header);
                    }
                    return;
                }
                if (section.matches('.home-day-ritual')) {
                    // Mobile Day is authored as two explicit pages. Using the
                    // outer section height creates a short, unwanted third stop.
                    // Keep the second page's true bottom as a boundary because
                    // that page is taller than the mobile viewport.
                    const pages = [...section.querySelectorAll('.home-mobile-day__page')];
                    pages.forEach(page => {
                        positions.push(page.getBoundingClientRect().top + scrollY - header);
                    });
                    const lastPage = pages.at(-1);
                    if (lastPage) {
                        const pageTop = lastPage.getBoundingClientRect().top + scrollY - header;
                        const pageBottom = pageTop + Math.max(0, lastPage.offsetHeight - height);
                        if (pageBottom > pageTop + 2) positions.push(pageBottom);
                    }
                    return;
                }
                if (section.matches('.home-mobile-night__page')) {
                    // Each mobile night composition is a single authored frame.
                    // Its 883px design canvas can be taller than the viewport,
                    // but must begin with the dark panel directly below header
                    // and must not create an extra stop inside the same frame.
                    positions.push(top);
                    return;
                }
                if (section.matches('.scent-sequence')) {
                    // The text scenes contain intentional erase/write gaps.
                    // Uniform viewport stops can land inside those gaps and
                    // present a completely blank page, so stop only where each
                    // sentence has finished writing.
                    const stage = section.querySelector('.scent-sequence__stage');
                    const distance = Math.max(0, section.offsetHeight - (stage?.offsetHeight || height));
                    [1.45, 4.95, 8.55].forEach(time => {
                        positions.push(top + distance * (time / 9.45));
                    });
                    return;
                }
                positions.push(top);
                // Retain every viewport of long scenes and their final frame.
                const last = top + section.offsetHeight - height;
                for (let y = top + height; y < last - 2; y += height) positions.push(y);
                if (last > top + 2) positions.push(last);
            });
            positions.push(homeRef.current.getBoundingClientRect().bottom + scrollY - header, maximum);
            return [...new Set(positions.map(y => Math.round(Math.max(0, Math.min(maximum, y)))))].sort((a, b) => a - b);
        };
        const blocked = event => !mobile.matches || document.querySelector('.mobile-menu, .intro-video, [role="dialog"][aria-modal="true"]')
            || event.target.closest('input,textarea,select,[contenteditable="true"],.header,video[controls]');
        const dayPageScrollRange = () => {
            const page = homeRef.current.querySelector('.home-day-ritual .home-mobile-day__page:last-child');
            if (!page) return null;
            const header = 52;
            const viewportHeight = innerHeight - header;
            const top = page.getBoundingClientRect().top + scrollY - header;
            const bottom = top + Math.max(0, page.offsetHeight - viewportHeight);
            return bottom > top + 2 ? { top, bottom } : null;
        };
        const canScrollInsideDayPage = direction => {
            const range = dayPageScrollRange();
            if (!range || !direction) return false;
            return direction > 0
                ? scrollY >= range.top - 3 && scrollY < range.bottom - 3
                : scrollY > range.top + 3 && scrollY <= range.bottom + 3;
        };
        const scrollInsideDayPage = delta => {
            const range = dayPageScrollRange();
            if (!range) return;
            window.scrollTo({
                top: Math.max(range.top, Math.min(range.bottom, scrollY + delta)),
                behavior: 'instant',
            });
        };
        const cancel = () => { cancelAnimationFrame(frame); busy = false; };
        const animateTo = (to, settling = false) => {
            if (to === undefined) return;
            const from = scrollY, start = performance.now();
            const distanceInScreens = Math.abs(to - from) / Math.max(1, innerHeight - 52);
            const nightPage = homeRef.current.querySelector('.home-mobile-night__page:last-child');
            const category = homeRef.current.querySelector('.mobile-categories');
            const nightStart = nightPage ? nightPage.getBoundingClientRect().top + scrollY - 52 : Infinity;
            const nightEnd = category ? category.getBoundingClientRect().top + scrollY - 52 : -Infinity;
            const followsPetals = Math.min(from, to) < nightEnd - 3 && Math.max(from, to) > nightStart + 3;
            const scentSequence = homeRef.current.querySelector('.scent-sequence');
            const scentTop = scentSequence ? scentSequence.getBoundingClientRect().top + scrollY - 52 : Infinity;
            const scentBottom = scentSequence ? scentTop + scentSequence.offsetHeight : -Infinity;
            const movesThroughScentText = (from >= scentTop - 3 && from <= scentBottom + 3)
                || (to >= scentTop - 3 && to <= scentBottom + 3);
            // Keep one fixed destination per gesture, with a gentler travel
            // speed and gradual acceleration/deceleration between sections.
            const duration = matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 0
                : followsPetals
                    ? Math.max(500, Math.min(2100, distanceInScreens * 1050))
                : settling
                    ? Math.min(650, Math.max(280, 650 * distanceInScreens))
                    : movesThroughScentText
                    ? 1600
                    : 1100 * Math.max(1, Math.min(1.6, distanceInScreens));
            busy = true;
            const tick = now => {
                const t = duration ? Math.min(1, (now - start) / duration) : 1;
                const eased = settling && !followsPetals ? 1 - (1 - t) ** 3 : (1 - Math.cos(Math.PI * t)) / 2;
                window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
                if (t < 1) frame = requestAnimationFrame(tick);
                else busy = false;
            };
            frame = requestAnimationFrame(tick);
        };
        const move = direction => {
            if (busy) return;
            const pages = stops();
            animateTo(direction > 0 ? pages.find(y => y > scrollY + 3) : pages.reverse().find(y => y < scrollY - 3));
        };
        const consume = event => { if (event.cancelable) event.preventDefault(); event.stopImmediatePropagation(); };
        const wheel = event => {
            if (blocked(event) || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
            const direction = Math.sign(event.deltaY);
            if (canScrollInsideDayPage(direction)) {
                // Apply the wheel delta directly because other home scenes also
                // capture scrolling. A later gesture at the edge changes page.
                consume(event);
                scrollInsideDayPage(event.deltaY);
                consumed = false;
                return;
            }
            const now = performance.now(), tail = now - lastWheel < 200;
            lastWheel = now;
            consume(event);
            if (busy || (consumed && tail)) return;
            consumed = true;
            move(direction);
        };
        const start = event => {
            if (!blocked(event) && event.touches.length === 1) cancel();
            touch = !blocked(event) && event.touches.length === 1
                ? { x: event.touches[0].clientX, y: event.touches[0].clientY, lastY: event.touches[0].clientY, originY: scrollY, axis: null, dayScroll: false }
                : null;
        };
        const drag = event => {
            if (!touch || blocked(event) || event.touches.length !== 1) return;
            const currentY = event.touches[0].clientY;
            const dx = touch.x - event.touches[0].clientX, dy = touch.y - currentY;
            if (!touch.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 5) touch.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
            if (touch.axis !== 'y') return;
            const step = touch.lastY - currentY;
            touch.lastY = currentY;
            if (touch.dayScroll || canScrollInsideDayPage(Math.sign(step))) {
                consume(event);
                touch.dayScroll = true;
                if (canScrollInsideDayPage(Math.sign(step))) scrollInsideDayPage(step);
                return;
            }
            consume(event);
            const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
            window.scrollTo({ top: Math.max(0, Math.min(maximum, scrollY + step)), behavior: 'instant' });
        };
        const end = event => {
            if (touch?.axis === 'y') {
                consume(event);
                if (!touch.dayScroll) {
                    const pages = stops();
                    const anchor = pages.reduce((best, y) => Math.abs(y - touch.originY) < Math.abs(best - touch.originY) ? y : best, pages[0]);
                    const endY = event.changedTouches[0]?.clientY ?? touch.lastY;
                    const travel = touch.y - endY;
                    const destination = Math.abs(travel) >= 6 && event.type !== 'touchcancel'
                        ? travel > 0
                            ? pages.find(y => y > anchor + 3)
                            : [...pages].reverse().find(y => y < anchor - 3)
                        : anchor;
                    animateTo(destination ?? anchor, true);
                }
            }
            touch = null;
        };
        const key = event => {
            if (blocked(event) || event.target.closest('a,button') || event.ctrlKey || event.metaKey || event.altKey) return;
            const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
            if (direction) { consume(event); if (!event.repeat) move(direction); }
        };
        // A short swipe can generate a compatibility click after touchend.
        // Only actual navigation controls should interrupt the settling motion.
        const click = event => {
            if (event.target.closest('a,button,input,select,textarea')) {
                cancel();
                consumed = false;
            }
        };
        let viewportWidth = innerWidth;
        const resize = () => {
            if (innerWidth !== viewportWidth) {
                viewportWidth = innerWidth;
                cancel();
            }
        };
        window.addEventListener('wheel', wheel, { passive: false, capture: true });
        window.addEventListener('touchstart', start, { passive: true, capture: true });
        window.addEventListener('touchmove', drag, { passive: false, capture: true });
        window.addEventListener('touchend', end, { passive: false, capture: true });
        window.addEventListener('touchcancel', end, { passive: false, capture: true });
        window.addEventListener('keydown', key, true);
        window.addEventListener('click', click, true);
        window.addEventListener('resize', resize);
        return () => {
            cancel();
            window.removeEventListener('wheel', wheel, true);
            window.removeEventListener('touchstart', start, true);
            window.removeEventListener('touchmove', drag, true);
            window.removeEventListener('touchend', end, true);
            window.removeEventListener('touchcancel', end, true);
            window.removeEventListener('keydown', key, true);
            window.removeEventListener('click', click, true);
            window.removeEventListener('resize', resize);
        };
    }, [homeRef]);
}
