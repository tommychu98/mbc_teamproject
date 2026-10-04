import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createPaperCurl } from './paperCurl';
import forest from './assets/images/shared/another-one.png';
import roses from './assets/images/shared/another-two.png';
import oranges from './assets/images/shared/another-three.png';
import figs from './assets/images/shared/another-four.png';
import forestMobile from './assets/images/mobile/another-one.png';
import rosesMobile from './assets/images/mobile/another-two.png';
import orangesMobile from './assets/images/mobile/another-three.png';
import figsMobile from './assets/images/mobile/another-four.png';
import './GalerieAnother.css';

const chapters = [
    { id: 'one', image: forest, mobileImage: forestMobile, title: '비가 그친 숲' },
    { id: 'two', image: roses, mobileImage: rosesMobile, title: '장미 향이 머무는 정원' },
    { id: 'three', image: oranges, mobileImage: orangesMobile, title: '오렌지 향이 번지는 오후' },
    { id: 'four', image: figs, mobileImage: figsMobile, title: '햇살 머금은 무화과 나무' },
];

export default function GalerieAnother() {
    const rootRef = useRef(null);
    const pressRef = useRef(null);
    const feedbackRef = useRef(null);

    useLayoutEffect(() => () => feedbackRef.current?.cancel(), []);

    const startPress = (event) => {
        pressRef.current = null;
        if (!event.isPrimary || event.button !== 0 || !window.matchMedia('(max-width: 767px)').matches) return;
        pressRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: true, cancelled: false };
        event.currentTarget.dataset.pressed = 'true';
    };

    const cancelPress = (event) => {
        delete event.currentTarget.dataset.pressed;
        const press = pressRef.current;
        if (press?.active && press.pointerId === event.pointerId) press.cancelled = true;
    };

    const movePress = (event) => {
        const press = pressRef.current;
        if (!press?.active || press.pointerId !== event.pointerId) return;
        if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) cancelPress(event);
    };

    const endPress = (event) => {
        movePress(event);
        delete event.currentTarget.dataset.pressed;
        // Chrome emits pointerleave after touch release, before the click.
        // Only movement while the pointer is down should cancel navigation.
        if (pressRef.current?.pointerId === event.pointerId) pressRef.current.active = false;
    };

    useLayoutEffect(() => {
        const media = gsap.matchMedia();
        media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
            const section = rootRef.current;
            const papers = [...section.querySelectorAll('.galerie-another__paper')];
            const reveal = gsap.fromTo(papers,
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power2.out', paused: true },
            );
            const observer = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) return;
                reveal.play();
                observer.disconnect();
            }, { threshold: 0.1 });
            observer.observe(section);
            return () => observer.disconnect();
        }, rootRef);
        media.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
            const cleanups = [...rootRef.current.querySelectorAll('.galerie-another__card')].map((card) => {
                const paper = card.querySelector('img');
                const curl = createPaperCurl(paper);
                if (!curl) return () => {};
                const lift = gsap.timeline({ paused: true, defaults: { duration: 0.45, ease: 'power2.out' } })
                    .to(curl.state, { progress: 1, onUpdate: curl.render }, 0);
                let hovered = false;
                const update = () => {
                    if (hovered || card.matches(':focus-visible')) lift.timeScale(1).play();
                    else lift.timeScale(0.8).reverse();
                };
                const enter = (event) => {
                    if (event.pointerType === 'touch') return;
                    hovered = true;
                    update();
                };
                const leave = () => { hovered = false; update(); };
                card.addEventListener('pointerenter', enter);
                card.addEventListener('pointerleave', leave);
                card.addEventListener('pointercancel', leave);
                card.addEventListener('focus', update);
                card.addEventListener('blur', update);
                return () => {
                    lift.kill();
                    curl.dispose();
                    card.removeEventListener('pointerenter', enter);
                    card.removeEventListener('pointerleave', leave);
                    card.removeEventListener('pointercancel', leave);
                    card.removeEventListener('focus', update);
                    card.removeEventListener('blur', update);
                };
            });
            return () => cleanups.forEach((cleanup) => cleanup());
        }, rootRef);
        return () => media.revert();
    }, []);

    const navigateToChapter = async (event) => {
        const cancelled = pressRef.current?.cancelled;
        pressRef.current = null;
        if (event.detail > 0 && cancelled) {
            event.preventDefault();
            return;
        }
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const target = document.querySelector(event.currentTarget.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        const mobile = window.matchMedia('(max-width: 767px)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const card = event.currentTarget;
        if (mobile && !reducedMotion) {
            if (feedbackRef.current) return;
            const feedback = card.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0.98)', offset: 0.4 },
                { transform: 'scale(1)' },
            ], { duration: 200, easing: 'ease-out' });
            feedbackRef.current = feedback;
            try {
                await feedback.finished;
            } catch {
                return;
            } finally {
                feedbackRef.current = null;
            }
        }
        if (!target.isConnected) return;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
    };

    return (
        <section ref={rootRef} className="galerie-another" id="galerie-another" aria-labelledby="galerie-another-title">
            <h2 id="galerie-another-title">Another</h2>
            <nav className="galerie-another__chapters" aria-label="다른 챕터 둘러보기">
                {chapters.map((chapter, index) => (
                    <a className="galerie-another__card" key={chapter.id} href={`#galerie-chapter-${chapter.id}`} onClick={navigateToChapter}
                        onPointerDown={startPress} onPointerMove={movePress} onPointerUp={endPress}
                        onPointerCancel={cancelPress} onPointerLeave={cancelPress} onDragStart={cancelPress}>
                        <span className="galerie-another__paper">
                            <picture>
                                <source media="(max-width: 767px)" srcSet={chapter.mobileImage} />
                                <img src={chapter.image} alt="" width="400" height="500" loading="lazy" />
                            </picture>
                        </span>
                        <span className="galerie-another__caption">
                            <span className="galerie-another__number">Chapter {index + 1}</span>
                            <span className="galerie-another__title">{chapter.title}</span>
                        </span>
                    </a>
                ))}
            </nav>
        </section>
    );
}
