import GalerieBottle from './GalerieBottle';
import { useRef, useState } from 'react';
import useDecorationPop from './useDecorationPop';
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
import mobileHeart from './assets/images/mobile/heart-outline.svg';
import mobileHeartFilled from './assets/images/mobile/heart-filled.svg';
import mobileGarden from './assets/images/mobile/chapter-three-mobile.png';
import mobileBottle from './assets/images/mobile/sens-bottle.png';
import mobileEdt from './assets/images/mobile/sens-edt.png';
import mobileHandCream from './assets/images/mobile/sens-hand-cream.png';
import mobileBodyLotion from './assets/images/mobile/sens-body-lotion.png';
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
    { image: edp, mobileImage: mobileEdt, type: 'Eau de toilette' },
    { image: edt, mobileImage: mobileHandCream, type: 'Perfumed hand cream' },
    { image: gel, mobileImage: mobileBodyLotion, type: 'Perfumed body lotion' },
];

export default function GalerieEauDesSens() {
    const rootRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    useDecorationPop(rootRef, '[data-sens-float]', true);

    return (
        <div className="galerie-sens" id="galerie-sens-content" tabIndex={-1} ref={rootRef}>
            <section className="galerie-tamdao galerie-sens__intro" aria-labelledby="galerie-sens-title">
                <div className="galerie-tamdao__scene">
                    <img className="galerie-tamdao__background" src={background} alt="" loading="lazy" />
                    <div className="galerie-tamdao__middle">
                        <div className="galerie-tamdao__oval">
                            <picture>
                                <source media="(max-width: 767px)" srcSet={mobileGarden} />
                                <img className="galerie-tamdao__forest" src={garden} alt="" loading="lazy" />
                            </picture>
                            <GalerieBottle desktop={bottle} mobile={mobileBottle} alt="딥티크 오 데 썽 오 드 뚜왈렛" />
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
                        <p>ORANGE BLOSSOM<br />· ANGELICA ROOT<br />PATCHOULI · <br className="galerie-sens__mobile-break" />JUNIPER BERRY</p>
                    </div>
                </div>
            </section>
            <section className="galerie-lineup galerie-sens__lineup" aria-labelledby="galerie-sens-lineup-title">
                <div className="galerie-sens__boundary" aria-hidden="true">
                    <div data-sens-float><img src={litchi} alt="" loading="lazy" /></div>
                </div>
                <div className="galerie-lineup__collection">
                    <h2 id="galerie-sens-lineup-title">EAU DES SENS , <br className="galerie-sens__mobile-break" />BEYOND THE PERFUME</h2>
                    <div className="galerie-lineup__products" tabIndex={0} role="region" aria-label="오 데 썽 제품 목록">
                        {products.map((product) => (
                            <article className="galerie-lineup__product" key={product.type}>
                                <div className="galerie-lineup__picture">
                                    <picture className="galerie-lineup__product-image">
                                        <source media="(max-width: 767px)" srcSet={product.mobileImage} />
                                        <img src={product.image} alt={`EAU DES SENS ${product.type}`} loading="lazy" />
                                    </picture>
                                    <button className="galerie-lineup__favorite" type="button" aria-label={`EAU DES SENS ${product.type} ${favorites.includes(product.type) ? '관심 해제' : '관심 표시'}`} aria-pressed={favorites.includes(product.type)}
                                        onClick={(event) => {
                                            event.currentTarget.dataset.interacted = 'true';
                                            setFavorites((current) => current.includes(product.type)
                                                ? current.filter((type) => type !== product.type)
                                                : [...current, product.type]);
                                        }}>
                                        <picture>
                                            <source media="(max-width: 767px)" srcSet={favorites.includes(product.type) ? mobileHeartFilled : mobileHeart} />
                                            <img src={favorites.includes(product.type) ? heartFilled : heart} alt="" />
                                        </picture>
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
