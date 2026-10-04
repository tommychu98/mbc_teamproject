import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import house from './assets/mobile-story-house.png';
import photo from './assets/mobile-story-photo.png';
import leaf from './assets/mobile-story-leaf.png';
import object from './assets/mobile-story-object.png';
import arrow from './assets/mobile-story-arrow.svg';
import './MobileIntroStory.css';

export default function MobileIntroStory() {
    const sectionRef = useRef(null);
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const measure = () => section.style.setProperty('--mobile-story-scale', section.clientWidth / 430);
        const resize = new ResizeObserver(measure);
        resize.observe(section);
        measure();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
            if (reduced) timeline.progress(1);
            else timeline.play();
            observer.disconnect();
            section.dataset.storyState = 'played';
        }, { threshold: .45 });
        observer.observe(section);
        return () => { observer.disconnect(); resize.disconnect(); context.revert(); };
    }, []);

    return (
        <section className="home-mobile-story" ref={sectionRef} aria-labelledby="home-mobile-story-title" data-node-id="2452:12792">
            <div className="home-mobile-story__canvas">
                <div className="home-mobile-story__object" data-story-plant><img src={object} alt="" /></div>
                <figure className="home-mobile-story__photo" data-story-paper>
                    <div className="home-mobile-story__photo-image"><img src={photo} alt="The founders of Diptyque" /></div>
                    <figcaption>THE FOUNDERS OF DIPTYQUE</figcaption>
                    <span className="home-mobile-story__photo-code">3/61 PAR</span>
                    <span className="home-mobile-story__photo-number">34</span>
                </figure>
                <div className="home-mobile-story__house" data-mobile-story-house><img src={house} alt="Diptyque Saint-Germain 매장" /></div>
                <div className="home-mobile-story__leaf" data-story-plant><div><img src={leaf} alt="" /></div></div>
                <p className="home-mobile-story__year" data-story-copy>1961</p>
                <h2 className="home-mobile-story__title" id="home-mobile-story-title">
                    <span data-story-title-line><span>THE </span><strong>STORY</strong><span> of</span></span>
                    <span data-story-title-line><strong>Diptyque</strong></span>
                </h2>
                <p className="home-mobile-story__place" data-story-copy>Saint-Germain , Paris</p>
                <Link className="home-mobile-story__button" data-story-button to="/about/history"><span>Our Story</span><img src={arrow} alt="" /></Link>
            </div>
        </section>
    );
}
