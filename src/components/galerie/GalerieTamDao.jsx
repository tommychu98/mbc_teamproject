import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import background from './assets/images/shared/tam-dao-background.png';
import forest from './assets/images/shared/chapter-one-forest.png';
import bottle from './assets/images/web/tam-dao-bottle.svg';
import mobileBottle from './assets/images/mobile/tam-dao-bottle-mobile.svg';
import cypress from './assets/images/shared/cypress.png';
import cedar from './assets/images/shared/cedar.png';
import coriander from './assets/images/shared/coriander.png';
import './GalerieTamDao.css';

const ingredients = [
    { name: 'cypress', image: cypress },
    { name: 'cedar', image: cedar },
    { name: 'coriander', image: coriander },
];

export default function GalerieTamDao() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const floats = [...section.querySelectorAll('.galerie-tamdao__float')].map((element, index) => (
                gsap.to(element, {
                    y: index % 2 ? 14 : -18,
                    x: index % 2 ? -5 : 6,
                    rotation: index % 2 ? -2 : 2,
                    duration: 3.4 + index * 0.6,
                    delay: index * 0.4,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    paused: true,
                })
            ));
            const observer = new IntersectionObserver(([entry]) => {
                floats.forEach((animation) => entry.isIntersecting ? animation.play() : animation.pause());
            });
            observer.observe(section);
            return () => observer.disconnect();
        }, section);
        return () => media.revert();
    }, []);

    return (
        <section className="galerie-tamdao" ref={sectionRef} aria-labelledby="galerie-tamdao-title">
            <div className="galerie-tamdao__scene">
                <img className="galerie-tamdao__background" src={background} alt="" loading="lazy" />
                <div className="galerie-tamdao__middle">
                    <div className="galerie-tamdao__oval">
                        <img className="galerie-tamdao__forest" src={forest} alt="" loading="lazy" />
                        <picture>
                            <source media="(max-width: 767px)" srcSet={mobileBottle} />
                            <img className="galerie-tamdao__bottle" src={bottle} alt="딥티크 탐다오 오 드 퍼퓸" width="520" height="670" loading="lazy" />
                        </picture>
                    </div>
                    <h2 className="galerie-tamdao__title" id="galerie-tamdao-title">TAM DAO</h2>
                    <p className="galerie-tamdao__description">젖은 나무결과 서늘한 숲 공기, 부드럽게 남는 샌들우드</p>
                </div>
                {ingredients.map(({ name, image }) => (
                    <div className={`galerie-tamdao__ingredient galerie-tamdao__ingredient--${name}`} key={name} aria-hidden="true">
                        <div className="galerie-tamdao__float">
                            <div className="galerie-tamdao__crop">
                                <img src={image} alt="" loading="lazy" />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="galerie-tamdao__notes">
                    <p className="galerie-tamdao__concentration">EDP</p>
                    <p>SANDALWOOD · CEDAR · CYPRESS · CORIANDER</p>
                </div>
            </div>
        </section>
    );
}
