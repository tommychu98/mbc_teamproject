import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import garden from './assets/images/shared/eau-rose.png';
import background from './assets/images/shared/rose-background.png';
import bottle from './assets/images/shared/rose-bottle.svg';
import artichoke from './assets/images/shared/rose-artichoke.png';
import upper from './assets/images/shared/rose-upper.png';
import litchi from './assets/images/shared/rose-litchi.png';
import left from './assets/images/shared/rose-left.png';
import boundary from './assets/images/shared/rose-boundary.png';
import collage from './assets/images/shared/rose-collage.png';
import edp from './assets/images/shared/rose-edp.png';
import edt from './assets/images/shared/rose-edt.png';
import gel from './assets/images/shared/rose-body-gel.png';
import heart from './assets/images/shared/heart-outline.svg';
import heartFilled from './assets/images/shared/heart-filled.svg';
import './GalerieTamDao.css';
import './GalerieTamDaoLineup.css';
import './GalerieEauRose.css';

const decorations = [
    { name: 'artichoke', image: artichoke },
    { name: 'upper', image: upper },
    { name: 'litchi', image: litchi },
    { name: 'left', image: left },
];
const products = [
    { image: edp, type: 'Eau de parfum' },
    { image: edt, type: 'Eau de toilette' },
    { image: gel, type: 'Perfumed cleansing body gel' },
];

export default function GalerieEauRose() {
    const rootRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const animations = [...root.querySelectorAll('[data-rose-float]')].map((element, index) => gsap.to(element, {
                y: index % 2 ? 14 : -18, x: index % 2 ? -5 : 6,
                rotation: index % 2 ? -2 : 2, duration: 3.4 + index * 0.6,
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
        <div className="galerie-rose" ref={rootRef}>
            <section className="galerie-tamdao galerie-rose__intro" aria-labelledby="galerie-rose-title">
                <div className="galerie-tamdao__scene">
                    <img className="galerie-tamdao__background" src={background} alt="" loading="lazy" />
                    <div className="galerie-tamdao__middle">
                        <div className="galerie-tamdao__oval">
                            <img className="galerie-tamdao__forest" src={garden} alt="" loading="lazy" />
                            <img className="galerie-tamdao__bottle" src={bottle} alt="딥티크 오 로즈 오 드 퍼퓸" width="520" height="670" loading="lazy" />
                        </div>
                        <h2 className="galerie-tamdao__title" id="galerie-rose-title">EAU ROSE</h2>
                        <p className="galerie-tamdao__description">한 아름의 장미와 은은한 과즙, 부드럽고 풍성하게 퍼지는 꽃의 여운</p>
                    </div>
                    {decorations.map((item) => (
                        <div className={`galerie-rose__decoration galerie-rose__decoration--${item.name}`} key={item.name} aria-hidden="true">
                            <div data-rose-float><img src={item.image} alt="" loading="lazy" /></div>
                        </div>
                    ))}
                    <div className="galerie-tamdao__notes">
                        <p className="galerie-tamdao__concentration">EDP</p>
                        <p>DAMASCENA ROSE · LITCHI · CENTIFOLIA ROSE · CHAMOMILE · ARTICHOKE</p>
                    </div>
                </div>
            </section>
            <section className="galerie-lineup galerie-rose__lineup" aria-labelledby="galerie-rose-lineup-title">
                <div className="galerie-rose__boundary" aria-hidden="true">
                    <div data-rose-float><img src={boundary} alt="" loading="lazy" /></div>
                </div>
                <div className="galerie-lineup__collection">
                    <h2 id="galerie-rose-lineup-title">EAU ROSE , BEYOND THE PERFUME</h2>
                    <div className="galerie-lineup__products">
                        {products.map((product) => (
                            <article className="galerie-lineup__product" key={product.type}>
                                <div className="galerie-lineup__picture">
                                    <img src={product.image} alt={`EAU ROSE ${product.type}`} loading="lazy" />
                                    <button className="galerie-lineup__favorite" type="button" aria-label={`EAU ROSE ${product.type} 관심 표시`} aria-pressed={favorites.includes(product.type)}
                                        onClick={() => setFavorites((current) => current.includes(product.type) ? current.filter((type) => type !== product.type) : [...current, product.type])}>
                                        <img src={favorites.includes(product.type) ? heartFilled : heart} alt="" />
                                    </button>
                                </div>
                                <h3>EAU ROSE</h3><p>{product.type}</p>
                            </article>
                        ))}
                    </div>
                </div>
                <aside className="galerie-lineup__scent" aria-label="오 로즈 오 드 퍼퓸의 향">
                    <div className="galerie-rose__collage"><img src={collage} alt="장미 정원 콜라주" loading="lazy" /></div>
                    <h3>THE SCENT OF EAU ROSE EDP</h3>
                    <p>FLORAL<br />LUSH<br />FRUITY<br />VELVETY</p>
                </aside>
            </section>
        </div>
    );
}
