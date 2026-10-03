import {
    ProductLineBackMain,
    ProductLineExplore,
    ProductLineServices,
    ViewMoreLink,
} from '../ProductLine/ProductLine';
import './NewSeason.css';
import heroRituels from './assets/hero-rituels.png';
import heroAutumn from './assets/hero-autumn.png';
import autumnScents from './assets/autumn-scents.png';

const ASSET_PATH = '/images/new-season';

function NewSeasonHero() {
    return (
        <section className="new-season__hero new-season__hero--rituels">
            <div className="new-season__canvas">
                <img src={heroRituels} alt="" />
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
                <div className="new-season__ritual-media">
                    <video autoPlay muted playsInline loop>
                        <source src={`${ASSET_PATH}/4k-new-season.mp4`} type="video/mp4" />
                    </video>
                </div>
            </div>
        </section>
    );
}

function NewSeasonAutumnHero() {
    return (
        <section className="new-season__hero new-season__hero--autumn" data-node-id="3540:7188">
            <div className="new-season__canvas">
                <img src={heroAutumn} alt="" />
                <span className="new-season__autumn-overlay" aria-hidden="true" />
                <p className="new-season__autumn-label">Season recommend</p>
                <h2>Autumn Aglow</h2>
            </div>
        </section>
    );
}

function NewSeasonAutumnScents() {
    return (
        <section className="new-season__after-sunset" data-node-id="3540:7181">
            <div className="new-season__canvas">
                <div className="new-season__after-image"><img src={autumnScents} alt="" /></div>
                <div className="new-season__after-copy">
                    <h2>Autumn Scents</h2>
                    <div>
                        <p>Mousses(무스), Chêne(셴), Noisetier(누아즈티에), Feu de Bois(푀 드 부아)…</p>
                        <p>숲길을 오래 거닐고 돌아온 듯, 가을이 깊은 향기와 함께 찾아왔습니다<br />이 계절이 선사하는 특별한 순간을 만끽해보세요</p>
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
            <NewSeasonAutumnHero />
            <NewSeasonAutumnScents />
            <ProductLineExplore />
            <ProductLineBackMain />
            <ProductLineServices />
        </main>
    );
}
