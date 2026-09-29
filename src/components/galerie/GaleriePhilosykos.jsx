import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import garden from './assets/images/web/chapter-four-fig.png';
import background from './assets/images/shared/fig-background.png';
import bottle from './assets/images/shared/fig-bottle.svg';
import figs from './assets/images/shared/fig-upper.png';
import leaf from './assets/images/shared/fig-leaf.png';
import pepper from './assets/images/shared/fig-pepper.png';
import root from './assets/images/shared/fig-root.png';
import boundary from './assets/images/shared/fig-boundary.png';
import collage from './assets/images/shared/fig-collage.png';
import edp from './assets/images/shared/fig-edp.png';
import edt from './assets/images/shared/fig-edt.png';
import gel from './assets/images/shared/fig-body-gel.png';
import heart from './assets/images/shared/heart-outline.svg';
import heartFilled from './assets/images/shared/heart-filled.svg';
import mobileHeart from './assets/images/mobile/heart-outline.svg';
import mobileHeartFilled from './assets/images/mobile/heart-filled.svg';
import mobileGarden from './assets/images/mobile/chapter-four-mobile.png';
import mobileBottle from './assets/images/mobile/fig-bottle.svg';
import mobileBackground from './assets/images/shared/rose-background.png';
import './GalerieTamDao.css';
import './GalerieTamDaoLineup.css';
import './GaleriePhilosykos.css';

const decorations = [
    { name: 'figs', image: figs },
    { name: 'leaf', image: leaf },
    { name: 'pepper', image: pepper },
];
const products = [
    { image: edt, type: 'Eau de toilette' },
    { image: edp, type: 'Eau de parfum' },
    { image: gel, type: 'Perfumed cleansing body gel' },
];

export default function GaleriePhilosykos() {
    const rootRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const animations = [...root.querySelectorAll('[data-fig-float]')].map((element, index) => gsap.to(element, {
                y: index % 2 ? 20 : -25, x: index % 2 ? -7 : 9,
                rotation: index % 2 ? -2.8 : 2.8, duration: 3.2 + index * 0.45,
                ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
            }));
            const observer = new IntersectionObserver(([entry]) => {
                animations.forEach((animation) => entry.isIntersecting ? animation.play() : animation.pause());
            });
            observer.observe(root);
            return () => observer.disconnect();
        }, root);
        return () => media.revert();
    }, []);

    return (
        <div className="galerie-fig" id="galerie-fig-content" tabIndex={-1} ref={rootRef}>
            <section className="galerie-tamdao galerie-fig__intro" aria-labelledby="galerie-fig-title">
                <div className="galerie-tamdao__scene">
                    <picture>
                        <source media="(max-width: 767px)" srcSet={mobileBackground} />
                        <img className="galerie-tamdao__background" src={background} alt="" loading="lazy" />
                    </picture>
                    <div className="galerie-tamdao__middle">
                        <div className="galerie-tamdao__oval">
                            <picture>
                                <source media="(max-width: 767px)" srcSet={mobileGarden} />
                                <img className="galerie-tamdao__forest" src={garden} alt="" loading="lazy" />
                            </picture>
                            <picture>
                                <source media="(max-width: 767px)" srcSet={mobileBottle} />
                                <img className="galerie-tamdao__bottle" src={bottle} alt="딥티크 필로시코스 오 드 뚜왈렛" width="520" height="670" loading="lazy" />
                            </picture>
                        </div>
                        <h2 className="galerie-tamdao__title" id="galerie-fig-title">PHILOSYKOS</h2>
                        <p className="galerie-tamdao__description">햇살 머금은 무화과 잎과 수액, 부드럽게 번지는 초록빛 나무의 향</p>
                    </div>
                    {decorations.map((item) => (
                        <div className={`galerie-fig__decoration galerie-fig__decoration--${item.name}`} key={item.name} aria-hidden="true">
                            <div data-fig-float><picture>
                                {item.name === 'figs' && <source media="(max-width: 767px)" srcSet={boundary} />}
                                <img src={item.image} alt="" loading="lazy" />
                            </picture></div>
                        </div>
                    ))}
                    <div className="galerie-tamdao__notes">
                        <p className="galerie-tamdao__concentration"><span className="galerie-fig__desktop-label">EDT</span><span className="galerie-fig__mobile-label">EDP</span></p>
                        <p>FIG LEAVES · FIG TREE SAP<br />FIG TREE WOOD · BLACK PEPPER</p>
                    </div>
                </div>
            </section>
            <section className="galerie-lineup galerie-fig__lineup" aria-labelledby="galerie-fig-lineup-title">
                <div className="galerie-fig__root" aria-hidden="true">
                    <div data-fig-float><img src={root} alt="" loading="lazy" /></div>
                </div>
                <div className="galerie-fig__boundary" aria-hidden="true">
                    <div data-fig-float><picture>
                        <source media="(max-width: 767px)" srcSet={figs} />
                        <img src={boundary} alt="" loading="lazy" />
                    </picture></div>
                </div>
                <div className="galerie-lineup__collection">
                    <h2 id="galerie-fig-lineup-title">PHILOSYKOS , <br className="galerie-fig__mobile-break" />BEYOND THE PERFUME</h2>
                    <div className="galerie-lineup__products" tabIndex={0} role="region" aria-label="필로시코스 제품 목록">
                        {products.map((product) => (
                            <article className="galerie-lineup__product" key={product.type}>
                                <div className="galerie-lineup__picture">
                                    <img src={product.image} alt={`PHILOSYKOS ${product.type}`} loading="lazy" />
                                    <button className="galerie-lineup__favorite" type="button" aria-label={`PHILOSYKOS ${product.type} 관심 표시`} aria-pressed={favorites.includes(product.type)}
                                        onClick={() => setFavorites((current) => current.includes(product.type) ? current.filter((type) => type !== product.type) : [...current, product.type])}>
                                        <picture>
                                            <source media="(max-width: 767px)" srcSet={favorites.includes(product.type) ? mobileHeartFilled : mobileHeart} />
                                            <img src={favorites.includes(product.type) ? heartFilled : heart} alt="" />
                                        </picture>
                                    </button>
                                </div>
                                <h3>PHILOSYKOS</h3><p>{product.type}</p>
                            </article>
                        ))}
                    </div>
                </div>
                <aside className="galerie-lineup__scent" aria-label="필로시코스 오 드 뚜왈렛의 향">
                    <div className="galerie-fig__collage"><img src={collage} alt="무화과 나무 콜라주" loading="lazy" /></div>
                    <h3>THE SCENT OF PHILOSYKOS EDT</h3>
                    <p>LEAFY<br />MILKY<br />FRESH<br />WOODY</p>
                </aside>
            </section>
        </div>
    );
}
