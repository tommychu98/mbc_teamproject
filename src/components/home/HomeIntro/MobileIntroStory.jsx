import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import house from './assets/mobile-story-house.webp';
import photo from './assets/story-founders-card.png';
import leaf from './assets/mobile-story-leaf.webp';
import object from './assets/mobile-story-object.webp';
import arrow from './assets/mobile-story-arrow.svg';
import './MobileIntroStory.css';

export default function MobileIntroStory({ mediaReady = false }) {
    const sectionRef = useRef(null);
    const [near, setNear] = useState(false);
    const loadImages = mediaReady || near;
    useEffect(() => {
        // Native lazy loading reaches this adjacent section before the movie
        // has buffered. Wait for media readiness, or an actual scroll here.
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setNear(true);
            observer.disconnect();
        }, { rootMargin: '0px 0px -10% 0px' });
        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const measure = () => section.style.setProperty('--mobile-story-scale', section.clientWidth / 430);
        const resize = new ResizeObserver(measure);
        resize.observe(section);
        measure();

        let timeline;
        const context = gsap.context(() => {
            gsap.set('[data-mobile-story-house]', { autoAlpha: 0, y: 24 });
            gsap.set('[data-story-plant]', { autoAlpha: 0, y: 42, rotate: -2.8 });
            gsap.set('[data-story-paper]', { autoAlpha: 0, x: -34, y: 34, rotate: -24.5 });
            gsap.set('[data-story-copy]', { autoAlpha: 0, y: 16 });
            gsap.set('[data-story-title-line]', { clipPath: 'inset(0 100% 0 0)', y: 10 });
            gsap.set('[data-story-button]', { autoAlpha: 0, y: 8 });
            timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
                .to('[data-mobile-story-house]', { autoAlpha: 1, y: 0, duration: 1.15 }, 0)
                .to('[data-story-plant]', {
                    autoAlpha: 1, y: 0, rotate: 0, duration: 1.15, stagger: .16,
                }, .05)
                .to('[data-story-paper]', { autoAlpha: 1, x: 0, y: 0, rotate: 0, duration: .95 }, .38)
                .to('[data-story-copy]', { autoAlpha: 1, y: 0, duration: .7, stagger: .14 }, .62)
                .to('[data-story-title-line]', {
                    clipPath: 'inset(0 0% 0 0)', y: 0, duration: 1.05, stagger: .2, ease: 'power1.inOut',
                }, .82)
                .to('[data-story-button]', { autoAlpha: 1, y: 0, duration: .55 }, 1.75);
        }, section);
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            timeline.play();
            observer.disconnect();
            section.dataset.storyState = 'played';
        }, { threshold: .45 });
        observer.observe(section);
        return () => { observer.disconnect(); resize.disconnect(); context.revert(); };
    }, []);

    return (
        <section className="home-mobile-story" ref={sectionRef} aria-labelledby="home-mobile-story-title" data-node-id="2452:12792">
            <div className="home-mobile-story__canvas">
                <div className="home-mobile-story__object" data-story-plant><img loading="lazy" decoding="async" fetchPriority="low" src={loadImages ? object : undefined} alt="" /></div>
                <figure className="home-mobile-story__photo" data-story-paper>
                    <div className="home-mobile-story__photo-image"><img loading="lazy" decoding="async" fetchPriority="low" src={loadImages ? photo : undefined} alt="The founders of Diptyque" /></div>
                </figure>
                <div className="home-mobile-story__house" data-mobile-story-house><img loading="lazy" decoding="async" fetchPriority="low" src={loadImages ? house : undefined} alt="Diptyque Saint-Germain 매장" /></div>
                <div className="home-mobile-story__leaf" data-story-plant><div><img loading="lazy" decoding="async" fetchPriority="low" src={loadImages ? leaf : undefined} alt="" /></div></div>
                <p className="home-mobile-story__year" data-story-copy>1961</p>
                <h2 className="home-mobile-story__title" id="home-mobile-story-title">
                    <span data-story-title-line><span>THE </span><strong>STORY</strong><span> of</span></span>
                    <span data-story-title-line><strong>Diptyque</strong></span>
                </h2>
                <p className="home-mobile-story__place" data-story-copy>Saint-Germain , Paris</p>
                <Link className="home-mobile-story__button" data-story-button to="/about/history"><span>Our Story</span><img loading="lazy" decoding="async" fetchPriority="low" src={arrow} alt="" /></Link>
            </div>
        </section>
    );
}
