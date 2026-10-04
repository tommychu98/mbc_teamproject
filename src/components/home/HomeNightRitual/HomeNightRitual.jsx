import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useDraperyPull from './useDraperyPull';
import NightBackground from './NightBackground';
import man from './assets/man.png';
import moon from './assets/moon.png';
import rose from './assets/rose.png';
import columns from './assets/columns.png';
import foregroundFlowers from './assets/foreground-flowers.png';
import rightLeaves from './assets/right-leaves.png';
import introRule from './assets/rule-intro.svg';
import sensorialRule from './assets/rule-sensorial.svg';
import buttonArrow from './assets/button-arrow.svg';
import './HomeNightRitual.css';
import useHomeMobile from '../useHomeMobile';
import MobileNightRitual from './MobileNightRitual';

export default function HomeNightRitual() {
    const mobile = useHomeMobile();
    return mobile ? <MobileNightRitual /> : <DesktopNightRitual />;
}

function DesktopNightRitual() {
    const sectionRef = useRef(null);
    const draperyRef = useRef(null);
    useDraperyPull(sectionRef, draperyRef);
    return (
        <section ref={sectionRef} className="home-night-ritual" aria-labelledby="home-night-ritual-title" data-node-id="2863:8262">
            <NightBackground />
            <img className="home-night-ritual__man" src={man} alt="" />
            <img className="home-night-ritual__moon" src={moon} alt="" />

            <div className="home-night-ritual__intro">
                <h2 id="home-night-ritual-title">Night with peace.<br />Experience the<br />evening ritual.</h2>
                <img className="home-night-ritual__intro-rule" src={introRule} alt="" />
                <div className="home-night-ritual__body">
                    <p>밤이 찾아오면, 포근한 텍스처와 편안한 향이 피부를 감싸며 영양을 채우고 지친 피부를 회복시켜 줍니다.</p>
                    <p>몸과 감각을 차분하게 가라앉히고 휴식으로 이끄는 다섯 단계의 이브닝 케어.<br />천천히 나 자신에게 돌아오는 시간입니다.</p>
                </div>
            </div>

            <div className="home-night-ritual__rose" data-node-id="4245:21566">
                <img src={rose} alt="" />
            </div>

            <div className="home-night-ritual__sensorial">
                <h3>A sensorial start<br />of the day</h3>
                <img className="home-night-ritual__sensorial-rule" src={sensorialRule} alt="" />
                <div className="home-night-ritual__body">
                    <p>Le Soir 캔들이 편안한 향을 은은하게 퍼뜨리며, 몸과 마음이 천천히 긴장을 풀 수 있도록 준비해 줍니다.</p>
                    <p>클렌징 젤부터 리치 밤, 립 왁스와 오일 인 오일까지.</p>
                    <p>하나하나의 케어가 몸을 부드럽게 감싸고 편안하게 진정시키며 휴식으로 이끌어 줍니다.</p>
                    <p>케어가 이어질수록 감각도 서서히 차분함을 되찾습니다.</p>
                </div>
            </div>

            <div className="home-night-ritual__columns"><img src={columns} alt="" /></div>
            <div className="home-night-ritual__foreground-flowers"><img src={foregroundFlowers} alt="" /></div>
            <div ref={draperyRef} className="home-night-ritual__right-leaves">
                <img src={rightLeaves} alt="" />
                <canvas aria-hidden="true" />
            </div>

            <Link className="home-night-ritual__collection" to="/shop/new-season/les-rituels-de-soin">
                <span>New Collection</span>
                <img src={buttonArrow} alt="" />
            </Link>
        </section>
    );
}
