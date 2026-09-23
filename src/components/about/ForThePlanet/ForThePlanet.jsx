import './style.css';
import botanicalDivider from './assets/botanical-divider.png';
import candle from './assets/candle.png';
import coastBase from './assets/coast-base.png';
import coastRight from './assets/coast-right.png';
import crystalVessel from './assets/crystal-vessel.png';
import emblem from './assets/emblem.png';
import foliageLeft from './assets/foliage-left.png';
import foliageRight from './assets/foliage-right.png';

const assets = {
    foliageRight,
    foliageLeft,
    coastBase,
    coastRight,
    crystalVessel,
    candle,
    emblem,
    botanicalDivider,
};

function ArchScene({ className, background, product, productAlt }) {
    return (
        <div className={`planet-arch ${className}`} aria-hidden={!product}>
            <img
                className="planet-arch__background"
                src={background}
                alt=""
                decoding="async"
            />
            {product && (
                <img
                    className="planet-arch__product"
                    src={product}
                    alt={productAlt}
                    decoding="async"
                />
            )}
        </div>
    );
}

export default function ForThePlanet() {
    return (
        <main className="for-the-planet" data-node-id="3274:17332">
            <h1 className="sr-only">For the Planet</h1>

            <section className="for-the-planet__hero" aria-label="Diptyque sustainability collection">
                <div className="for-the-planet__scene">
                    <img
                        className="for-the-planet__foliage for-the-planet__foliage--left"
                        src={assets.foliageLeft}
                        alt=""
                        aria-hidden="true"
                    />
                    <img
                        className="for-the-planet__foliage for-the-planet__foliage--right"
                        src={assets.foliageRight}
                        alt=""
                        aria-hidden="true"
                    />

                    <div className="for-the-planet__mark" aria-hidden="true">
                        <img className="for-the-planet__emblem" src={assets.emblem} alt="" />
                        <img
                            className="for-the-planet__divider"
                            src={assets.botanicalDivider}
                            alt=""
                        />
                    </div>

                    <ArchScene
                        className="planet-arch--left"
                        background={assets.coastBase}
                        product={assets.crystalVessel}
                        productAlt="Diptyque crystal vessel"
                    />
                    <ArchScene
                        className="planet-arch--center"
                        background={assets.coastBase}
                        product={assets.candle}
                        productAlt="Diptyque candle"
                    />
                    <ArchScene
                        className="planet-arch--right"
                        background={assets.coastRight}
                    />
                </div>
            </section>
        </main>
    );
}
