import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import sandalwood from './assets/images/shared/sandalwood.png';
import wood from './assets/images/shared/tam-dao-wood-collage.png';
import edp from './assets/images/web/tam-dao-edp.png';
import edt from './assets/images/web/tam-dao-edt.png';
import soap from './assets/images/shared/tam-dao-soap.png';
import forest from './assets/images/shared/tam-dao-forest-collage.png';
import heart from './assets/images/shared/heart-outline.svg';
import heartFilled from './assets/images/shared/heart-filled.svg';
import './GalerieTamDaoLineup.css';
import mobileEdp from './assets/images/mobile/tam-dao-edp.png';
import mobileEdt from './assets/images/mobile/tam-dao-edt.png';
import mobileHeart from './assets/images/mobile/heart-outline.svg';
import mobileTop from './assets/images/mobile/top-arrow.svg';

const products = [
    { type: 'Eau de parfum', image: edp, mobileImage: mobileEdp },
    { type: 'Eau de toilette', image: edt, mobileImage: mobileEdt },
    { type: 'Scented soap', image: soap, soap: true },
];

export default function GalerieTamDaoLineup() {
    const rootRef = useRef(null);
    const [favorites, setFavorites] = useState([]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const animations = [...root.querySelectorAll('[data-lineup-float]')].map((element, index) => (
                gsap.to(element, {
                    y: index ? -18 : 14,
                    x: index ? 6 : -5,
                    rotation: index ? 2 : -2,
                    duration: index ? 4 : 5.2,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    paused: true,
                })
            ));
            const observer = new IntersectionObserver(([entry]) => {
                animations.forEach((animation) => entry.isIntersecting ? animation.play() : animation.pause());
            });
            observer.observe(root);
            return () => observer.disconnect();
        }, root);
        return () => media.revert();
    }, []);

    return (
        <section className="galerie-lineup" ref={rootRef} aria-labelledby="galerie-lineup-title">
            <div className="galerie-lineup__wood-shavings" aria-hidden="true">
                <img src={sandalwood} alt="" loading="lazy" data-lineup-float />
            </div>
            <div className="galerie-lineup__wood" aria-hidden="true">
                <img src={wood} alt="" loading="lazy" data-lineup-float />
            </div>
            <div className="galerie-lineup__collection">
                <h2 id="galerie-lineup-title">TAM DAO , <br className="galerie-lineup__mobile-break" />BEYOND THE PERFUME</h2>
                <div className="galerie-lineup__products">
                    {products.map((product) => (
                        <article className="galerie-lineup__product" key={product.type}>
                            <div className={`galerie-lineup__picture${product.soap ? ' galerie-lineup__picture--soap' : ''}`}>
                                <picture className="galerie-lineup__product-image">
                                    {product.mobileImage && <source media="(max-width: 767px)" srcSet={product.mobileImage} />}
                                    <img src={product.image} alt={`TAM DAO ${product.type}`} loading="lazy" />
                                </picture>
                                <button
                                    className="galerie-lineup__favorite"
                                    type="button"
                                    aria-label={`TAM DAO ${product.type} 관심 표시`}
                                    aria-pressed={favorites.includes(product.type)}
                                    onClick={() => setFavorites((current) => current.includes(product.type)
                                        ? current.filter((type) => type !== product.type)
                                        : [...current, product.type])}
                                >
                                    <picture>
                                        <source media="(max-width: 767px)" srcSet={favorites.includes(product.type) ? heartFilled : mobileHeart} />
                                        <img src={favorites.includes(product.type) ? heartFilled : heart} alt="" />
                                    </picture>
                                </button>
                            </div>
                            <h3>TAM DAO</h3>
                            <p>{product.type}</p>
                        </article>
                    ))}
                </div>
            </div>
            <aside className="galerie-lineup__scent" aria-label="탐다오 오 드 퍼퓸의 향">
                <img src={forest} alt="숲 풍경 콜라주" loading="lazy" />
                <h3>THE SCENT OF TAM DAO EDP</h3>
                <p>WOODY<br />CREAMY<br />GREEN<br />CALM</p>
            </aside>
            <button className="galerie-lineup__top" type="button" aria-label="페이지 맨 위로 이동" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
                <img src={mobileTop} alt="" /><span>TOP</span>
            </button>
        </section>
    );
}
