import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import rose from './assets/rose.png';
import moon from './assets/moon.png';
import background from './assets/background.png';
import man from './assets/man.png';
import flowers from './assets/foreground-flowers.png';
import introRule from './assets/mobile-intro-rule.svg';
import sensorialRule from './assets/mobile-sensorial-rule.svg';
import arrow from './assets/mobile-arrow.svg';
import './MobileNightRitual.css';

export default function MobileNightRitual() {
    const rootRef = useRef(null);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const updateHeader = () => {
            const bounds = root.getBoundingClientRect();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 52;
            const journey = root.nextElementSibling;
            const bottom = journey?.matches('.night-journey') ? journey.getBoundingClientRect().bottom : bounds.bottom;
            document.body.classList.toggle('home-mobile-night-active', bounds.top <= headerHeight && bottom > headerHeight);
        };
        const measure = () => {
            root.style.setProperty('--mobile-night-scale', root.clientWidth / 430);
            updateHeader();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        window.addEventListener('scroll', updateHeader, { passive: true });
        measure();
        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', updateHeader);
            document.body.classList.remove('home-mobile-night-active');
        };
    }, []);
    return <div className="home-mobile-night" ref={rootRef}>
        <section className="home-mobile-night__page" aria-labelledby="mobile-night-title" data-node-id="2452:12549">
            <div className="home-mobile-night__canvas">
                <div className="home-mobile-night__rose"><img src={rose} alt="" /></div>
                <div className="home-mobile-night__intro">
                    <h2 id="mobile-night-title">Night with peace.<br />Experience the<br />evening ritual.</h2>
                    <img className="home-mobile-night__rule" src={introRule} alt="" />
                    <div className="home-mobile-night__body">
                        <p>밤이 찾아오면, 포근한 텍스처와 편안한 향이 피부를 감싸며 영양을 채우고 지친 피부를 회복시켜 줍니다.</p>
                        <p>몸과 감각을 차분하게 가라앉히고 휴식으로 이끄는 다섯 단계의 이브닝 케어.<br />천천히 나 자신에게 돌아오는 시간입니다.</p>
                    </div>
                </div>
                <div className="home-mobile-night__moon"><div><img src={moon} alt="" /></div></div>
            </div>
        </section>
        <section className="home-mobile-night__page" aria-labelledby="mobile-night-sensorial-title" data-node-id="2452:12510">
            <div className="home-mobile-night__canvas">
                <img className="home-mobile-night__background" src={background} alt="" />
                <div className="home-mobile-night__sensorial">
                    <h3 id="mobile-night-sensorial-title">A sensorial start<br />of the day</h3>
                    <img className="home-mobile-night__rule" src={sensorialRule} alt="" />
                    <div className="home-mobile-night__body">
                        <p>Le Soir 캔들이 편안한 향을 은은하게 퍼뜨리며, 몸과 마음이 천천히 긴장을 풀 수 있도록 준비해 줍니다.</p>
                        <p>클렌징 젤부터 리치 밤, 립 왁스와 오일 인 오일까지.</p>
                        <p>하나하나의 케어가 몸을 부드럽게 감싸고 편안하게 진정시키며 휴식으로 이끌어 줍니다.</p>
                        <p>케어가 이어질수록 감각도 서서히 차분함을 되찾습니다.</p>
                    </div>
                </div>
                <img className="home-mobile-night__man" src={man} alt="" />
                <div className="home-mobile-night__flowers"><img src={flowers} alt="" /></div>
                <Link className="home-mobile-night__collection" to="/shop/new-season/les-rituels-de-soin"><span>New Collection</span><img src={arrow} alt="" /></Link>
            </div>
        </section>
    </div>;
}
