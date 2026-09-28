import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import garden from './assets/images/shared/eau-des-sens.png';
import background from './assets/images/shared/sens-background.png';
import bottle from './assets/images/shared/sens-bottle.svg';
import artichoke from './assets/images/shared/sens-angelica.png';
import upper from './assets/images/shared/sens-juniper.png';
import litchi from './assets/images/shared/sens-patchouli.png';
import left from './assets/images/shared/sens-orange.png';
import collage from './assets/images/shared/sens-collage.png';
import edp from './assets/images/shared/sens-edt.png';
import edt from './assets/images/shared/sens-hand-cream.png';
import gel from './assets/images/shared/sens-body-lotion.png';
import heart from './assets/images/shared/heart-outline.svg';
import heartFilled from './assets/images/shared/heart-filled.svg';
import './GalerieTamDao.css';
import './GalerieTamDaoLineup.css';
import './GalerieEauDesSens.css';

const decorations = [
    { name: 'artichoke', image: artichoke },
    { name: 'upper', image: upper },
    { name: 'litchi', image: litchi },
    { name: 'left', image: left },
];
const products = [
    { image: edp, type: 'Eau de toilette' },
    { image: edt, type: 'Perfumed hand cream' },
    { image: gel, type: 'Perfumed body lotion' },
];

export default function GalerieEauDesSens() {
    const rootRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const animations = [...root.querySelectorAll('[data-sens-float]')].map((element, index) => gsap.to(element, {
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
        <div className="galerie-sens" ref={rootRef}>
            <section className="galerie-tamdao galerie-sens__intro" aria-labelledby="galerie-sens-title">
                <div className="galerie-tamdao__scene">
                    <img className="galerie-tamdao__background" src={background} alt="" loading="lazy" />
                    <div className="galerie-tamdao__middle">
                        <div className="galerie-tamdao__oval">
                            <img className="galerie-tamdao__forest" src={garden} alt="" loading="lazy" />
                            <img className="galerie-tamdao__bottle" src={bottle} alt="딥티크 오 데 썽 오 드 뚜왈렛" width="520" height="670" loading="lazy" />
                        </div>
                        <h2 className="galerie-tamdao__title" id="galerie-sens-title">EAU DES SENS</h2>
                        <p className="galerie-tamdao__description">오렌지 껍질의 상큼함과 하얀 꽃, 싱그러운 초록빛 여운</p>
                    </div>
                    {decorations.map((item) => (
                        <div className={`galerie-sens__decoration galerie-sens__decoration--${item.name}`} key={item.name} aria-hidden="true">
                            <div data-sens-float><img src={item.image} alt="" loading="lazy" /></div>
                        </div>
                    ))}
                    <div className="galerie-tamdao__notes">
                        <p className="galerie-tamdao__concentration">EDT</p>
                        <p>ORANGE BLOSSOM<br />· ANGELICA ROOT<br />PATCHOULI · JUNIPER BERRY</p>
                    </div>
                </div>
            </section>
            <section className="galerie-lineup galerie-sens__lineup" aria-labelledby="galerie-sens-lineup-title">
                <div className="galerie-lineup__collection">
                    <h2 id="galerie-sens-lineup-title">EAU DES SENS , BEYOND THE PERFUME</h2>
                    <div className="galerie-lineup__products">
                        {products.map((product) => (
                            <article className="galerie-lineup__product" key={product.type}>
                                <div className="galerie-lineup__picture">
                                    <img src={product.image} alt={`EAU DES SENS ${product.type}`} loading="lazy" />
                                    <button className="galerie-lineup__favorite" type="button" aria-label={`EAU DES SENS ${product.type} 관심 표시`} aria-pressed={favorites.includes(product.type)}
                                        onClick={() => setFavorites((current) => current.includes(product.type) ? current.filter((type) => type !== product.type) : [...current, product.type])}>
                                        <img src={favorites.includes(product.type) ? heartFilled : heart} alt="" />
                                    </button>
                                </div>
                                <h3>EAU DES SENS</h3><p>{product.type}</p>
                            </article>
                        ))}
                    </div>
                </div>
                <aside className="galerie-lineup__scent" aria-label="오 데 썽 오 드 뚜왈렛의 향">
                    <div className="galerie-sens__collage"><img src={collage} alt="오렌지 정원 콜라주" loading="lazy" /></div>
                    <h3>THE SCENT OF EAU DES SENS EDT</h3>
                    <p>CITRUS<br />FRESH<br />SPICY<br />BRIGHT</p>
                </aside>
            </section>
        </div>
    );
}
