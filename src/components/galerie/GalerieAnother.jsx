import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createPaperCurl } from './paperCurl';
import forest from './assets/images/shared/another-one.png';
import roses from './assets/images/shared/another-two.png';
import oranges from './assets/images/shared/another-three.png';
import figs from './assets/images/shared/another-four.png';
import './GalerieAnother.css';

const chapters = [
    { id: 'one', image: forest, title: '비가 그친 숲' },
    { id: 'two', image: roses, title: '장미 향이 머무는 정원' },
    { id: 'three', image: oranges, title: '오렌지 향이 번지는 오후' },
    { id: 'four', image: figs, title: '햇살 머금은 무화과 나무' },
];

export default function GalerieAnother() {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const media = gsap.matchMedia();
        media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
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

    const navigateToChapter = (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const target = document.querySelector(event.currentTarget.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
    };

    return (
        <section ref={rootRef} className="galerie-another" id="galerie-another" aria-labelledby="galerie-another-title">
            <h2 id="galerie-another-title">Another</h2>
            <nav className="galerie-another__chapters" aria-label="다른 챕터 둘러보기">
                {chapters.map((chapter, index) => (
                    <a className="galerie-another__card" key={chapter.id} href={`#galerie-chapter-${chapter.id}`} onClick={navigateToChapter}>
                        <span className="galerie-another__paper">
                            <img src={chapter.image} alt="" width="400" height="500" loading="lazy" />
                        </span>
                        <span className="galerie-another__number">Chapter {index + 1}</span>
                        <span className="galerie-another__title">{chapter.title}</span>
                    </a>
                ))}
            </nav>
        </section>
    );
}
