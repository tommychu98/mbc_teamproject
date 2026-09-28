import {
    ProductLineBackMain,
    ProductLineExplore,
    ProductLineServices,
    ViewMoreLink,
} from '../ProductLine/ProductLine';
import './NewSeason.css';

const ASSET_PATH = '/images/new-season';

function NewSeasonHero() {
    return (
        <section className="new-season__hero new-season__hero--rituels">
            <div className="new-season__canvas">
                <img src={`${ASSET_PATH}/hero-rituels.png`} alt="" />
                <p className="new-season__eyebrow">New Arrivals</p>
                <h1>Les Rituels<br />de Soin</h1>
            </div>
        </section>
    );
}

function NewSeasonDawn() {
    return <section className="new-season__dawn"><h2>At dawn, body and mind awaken.</h2></section>;
}

function NewSeasonRituals() {
    return (
        <section className="new-season__rituals">
            <div className="new-season__canvas">
                <div className="new-season__ritual-copy">
                    <h2>Holistic care rituals to bring body and mind into harmony.</h2>
                    <div>
                        <p>향기와 빛, 움직임이 하나로 어우러졌던 고대의 목욕 문화에서 영감을 받았습니다.</p>
                        <p>자연 유래 성분과 섬세한 포뮬러, 그리고 기분 좋은 향이 몸을 부드럽게 돌보는 동시에 일상의 분위기까지 새롭게 채워줍니다.</p>
                        <p>아침부터 저녁까지 이어지는 모든 케어의 순간은 몸과 감각을 깨우고, 나 자신에게 다시 집중하는 시간이 됩니다.</p>
                    </div>
                    <ViewMoreLink to="/shop/new-season/les-rituels-de-soin" label="Les Rituels de Soin" />
                </div>
                <div className="new-season__ritual-media"><img src={`${ASSET_PATH}/ritual-video-frame.png`} alt="" /></div>
            </div>
        </section>
    );
}

function NewSeasonSummerHero() {
    return (
        <section className="new-season__hero new-season__hero--summer">
            <div className="new-season__canvas">
                <img src={`${ASSET_PATH}/hero-summer.png`} alt="" />
                <span className="new-season__summer-overlay" aria-hidden="true" />
                <p className="new-season__summer-label">Season recommend</p>
                <h2>The last light of summer</h2>
            </div>
        </section>
    );
}

function NewSeasonAfterSunset() {
    return (
        <section className="new-season__after-sunset">
            <div className="new-season__canvas">
                <div className="new-season__after-image"><img src={`${ASSET_PATH}/after-sunset.png`} alt="" /></div>
                <div className="new-season__after-copy">
                    <h2>After sunset</h2>
                    <div>
                        <p>여름이 추억 속으로 저물어가도, 그 빛의 여운은 오래도록 남아 있습니다.</p>
                        <p>Diptyque의 향은 따뜻하고 빛나는 순간 속에서 여름의 감각을 조금 더 오래 이어주며, 마치 시간이 잠시 멈춘 듯한 순간을 선사합니다.</p>
                    </div>
                    <ViewMoreLink to="/shop/new-season/season-recommend" label="Season recommend" />
                </div>
            </div>
        </section>
    );
}

export default function NewSeason() {
    return (
        <main className="new-season" data-node-id="3540:7125">
            <NewSeasonHero />
            <NewSeasonDawn />
            <NewSeasonRituals />
            <NewSeasonSummerHero />
            <NewSeasonAfterSunset />
            <ProductLineExplore />
            <ProductLineBackMain />
            <ProductLineServices />
        </main>
    );
}
