import { useLayoutEffect, useRef } from 'react';
import lemon from './assets/top-lemon.png';
import floral from './assets/floral-overlay.png';
import left from './assets/left-floral.png';
import background from './assets/background.png';
import woman from './assets/woman.png';
import bath from './assets/bath-objects.png';
import morningRule from './assets/mobile-morning-rule.svg';
import sensorialRule from './assets/mobile-sensorial-rule.svg';
import arrow from './assets/mobile-button-arrow.svg';
import './MobileDayRitual.css';

export default function MobileDayRitual({ collectionHref }) {
    const rootRef = useRef(null);
    const lemonRef = useRef(null);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const firstPage = root.querySelector('.home-mobile-day__page');
        const firstBranch = root.querySelector('.home-mobile-day__left--first');
        const secondBranch = root.querySelector('.home-mobile-day__left--second');
        const delay = `${-(document.timeline.currentTime ?? performance.now())}ms`;
        root.style.setProperty('--mobile-day-sway-delay', delay);
        const measure = () => {
            const scale = root.clientWidth / 430;
            root.style.setProperty('--mobile-day-scale', scale);
            if (!scale) return;
            const firstTop = parseFloat(getComputedStyle(firstBranch).top);
            const pageHeight = parseFloat(getComputedStyle(firstPage).height) / scale;
            secondBranch.style.setProperty('--mobile-branch-top', `${firstTop - pageHeight}px`);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        observer.observe(firstPage);
        measure();
        return () => observer.disconnect();
    }, []);
    return <div className="home-mobile-day" ref={rootRef}>
        <section className="home-mobile-day__page" aria-labelledby="mobile-day-title" data-node-id="2452:12578">
            <div className="home-mobile-day__canvas">
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-mobile-day__lemon home-day-ritual__top-lemon" ref={lemonRef} src={lemon} alt="" />
                <h2 className="home-mobile-day__title" id="mobile-day-title">Les Rituels<br />de Soin</h2>
                <p className="home-mobile-day__byline">Diptyque</p>
                <div className="home-mobile-day__floral"><img loading="lazy" decoding="async" fetchPriority="low" src={floral} alt="" /></div>
                <div className="home-mobile-day__morning">
                    <h3>Embrace the day.<br />Explore the<br />morning ritual.</h3>
                    <img loading="lazy" decoding="async" fetchPriority="low" className="home-mobile-day__rule" src={morningRule} alt="" />
                    <div className="home-mobile-day__body">
                        <p>아침의 첫 빛과 함께, 나를 돌보는 시간이 시작됩니다.</p>
                        <p>피부를 깨끗이 씻고 수분을 채우며 감각을 깨우는 여섯 단계의 케어.<br />몸과 마음에 부드러운 활력을 더하며 하루를 시작해 보세요.</p>
                    </div>
                </div>
                <div className="home-mobile-day__left home-mobile-day__left--first"><img loading="lazy" decoding="async" fetchPriority="low" src={left} alt="" /></div>
            </div>
        </section>
        <section className="home-mobile-day__page" aria-labelledby="mobile-day-sensorial-title" data-node-id="2452:12566">
            <div className="home-mobile-day__canvas">
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-mobile-day__background" src={background} alt="" />
                <div className="home-mobile-day__left home-mobile-day__left--second"><img loading="lazy" decoding="async" fetchPriority="low" src={left} alt="" /></div>
                <div className="home-mobile-day__sensorial">
                    <h3 id="mobile-day-sensorial-title">A sensorial<br />start of the day</h3>
                    <img loading="lazy" decoding="async" fetchPriority="low" className="home-mobile-day__rule" src={sensorialRule} alt="" />
                    <div className="home-mobile-day__body">
                        <p>Le Matin 캔들이 케어의 시작을 알리고, 그 순간의 분위기를 완성합니다.</p>
                        <p>클렌징 젤부터 인비고레이팅 스크럽, 모이스처라이징 로션과 퍼펙팅 새틴 오일, 그리고 립 왁스까지.</p>
                        <p>하나하나의 케어가 피부에 생기와 활력을 더하고, 한층 환하게 깨워줍니다.<br />몸과 감각도 서서히 깨어나며 새로운 하루를 맞이합니다.</p>
                    </div>
                </div>
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-mobile-day__woman" src={woman} alt="" />
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-mobile-day__bath" src={bath} alt="" />
                <a className="home-mobile-day__collection" href={collectionHref}><span>New Collection</span><img loading="lazy" decoding="async" fetchPriority="low" src={arrow} alt="" /></a>
            </div>
        </section>
    </div>;
}
