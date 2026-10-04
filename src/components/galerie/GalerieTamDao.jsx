import GalerieBottle from './GalerieBottle';
import { useRef } from 'react';
import useDecorationPop from './useDecorationPop';
import background from './assets/images/shared/tam-dao-background.png';
import forest from './assets/images/shared/chapter-one-forest.png';
import bottle from './assets/images/web/tam-dao-bottle.svg';
import mobileBottle from './assets/images/mobile/tam-dao-bottle.png';
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

    useDecorationPop(sectionRef, '.galerie-tamdao__float', true);

    return (
        <section className="galerie-tamdao" ref={sectionRef} aria-labelledby="galerie-tamdao-title">
            <div className="galerie-tamdao__scene">
                <img className="galerie-tamdao__background" src={background} alt="" loading="lazy" />
                <div className="galerie-tamdao__middle">
                    <div className="galerie-tamdao__oval">
                        <img className="galerie-tamdao__forest" src={forest} alt="" loading="lazy" />
                        <GalerieBottle desktop={bottle} mobile={mobileBottle} alt="딥티크 탐다오 오 드 퍼퓸" cropped />
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
