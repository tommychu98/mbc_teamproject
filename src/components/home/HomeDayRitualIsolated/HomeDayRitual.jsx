import { useLayoutEffect, useRef, useState } from 'react';
import background from './assets/background.png';
import woman from './assets/woman.png';
import floralOverlay from './assets/floral-overlay.png';
import leftFloral from './assets/left-floral.png';
import rightFloral from './assets/right-floral.png';
import foregroundLeaf from './assets/leaf-flight.png';
import topLemon from './assets/top-lemon.png';
import bird from './assets/bird.png';
import bathObjects from './assets/bath-objects.png';
import morningRule from './assets/rule-morning.svg';
import sensorialRule from './assets/rule-sensorial.svg';
import buttonArrow from './assets/button-arrow.svg';
import './HomeDayRitual.css';
import useLeafExit from './useLeafExit';
import useLemonReveal from './useLemonReveal';
import MobileDayRitual from './MobileDayRitual';

const DESIGN_WIDTH = 1920;

/** Standalone desktop section based on Figma node 2863:8282. */
export default function HomeDayRitual({ collectionHref = '/shop/new-season/les-rituels-de-soin' }) {
    const containerRef = useRef(null);
    const leafRef = useRef(null);
    const lemonRef = useRef(null);
    const [scale, setScale] = useState(1);
    useLeafExit(containerRef, leafRef, scale);
    useLemonReveal(containerRef, lemonRef);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measure = () => setScale(container.clientWidth / DESIGN_WIDTH);
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        measure();
        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="home-day-ritual"
            ref={containerRef}
            style={{ '--home-day-scale': scale }}
            aria-labelledby="home-day-ritual-title"
            data-node-id="2863:8282"
        >
            <MobileDayRitual collectionHref={collectionHref} />
            <div className="home-day-ritual__canvas">
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__background" src={background} alt="" draggable="false" />
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__woman" src={woman} alt="" draggable="false" />

                <div className="home-day-ritual__floral-overlay"><img loading="lazy" decoding="async" fetchPriority="low" src={floralOverlay} alt="" draggable="false" /></div>
                <div className="home-day-ritual__left-floral"><img loading="lazy" decoding="async" fetchPriority="low" src={leftFloral} alt="" draggable="false" /></div>
                <div className="home-day-ritual__right-floral"><img loading="lazy" decoding="async" fetchPriority="low" src={rightFloral} alt="" draggable="false" /></div>
                <div className="home-day-ritual__foreground-leaf" ref={leafRef} data-node-id="2863:8288" data-name="leaf"><img loading="lazy" decoding="async" fetchPriority="low" src={foregroundLeaf} alt="" draggable="false" /></div>

                <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__top-lemon" ref={lemonRef} src={topLemon} alt="" draggable="false" />
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__bird" src={bird} alt="" draggable="false" />
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__bath-objects" src={bathObjects} alt="" draggable="false" />

                <div className="home-day-ritual__morning-copy">
                    <h2>Embrace the day.<br />Explore the<br />morning ritual.</h2>
                    <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__morning-rule" src={morningRule} alt="" />
                    <div className="home-day-ritual__body-copy">
                        <p>아침의 첫 빛과 함께, 나를 돌보는 시간이 시작됩니다.</p>
                        <p>피부를 깨끗이 씻고 수분을 채우며 감각을 깨우는 여섯 단계의 케어.<br />몸과 마음에 부드러운 활력을 더하며 하루를 시작해 보세요.</p>
                    </div>
                </div>

                <div className="home-day-ritual__sensorial-copy">
                    <h2>A sensorial start<br />of the day</h2>
                    <img loading="lazy" decoding="async" fetchPriority="low" className="home-day-ritual__sensorial-rule" src={sensorialRule} alt="" />
                    <div className="home-day-ritual__body-copy">
                        <p>Le Matin 캔들이 케어의 시작을 알리고, 그 순간의 분위기를 완성합니다.</p>
                        <p>클렌징 젤부터 인비고레이팅 스크럽, 모이스처라이징 로션과 퍼펙팅 새틴 오일, 그리고 립 왁스까지.</p>
                        <p>하나하나의 케어가 피부에 생기와 활력을 더하고, 한층 환하게 깨워줍니다.<br />몸과 감각도 서서히 깨어나며 새로운 하루를 맞이합니다.</p>
                    </div>
                </div>

                <h1 id="home-day-ritual-title" className="home-day-ritual__title">Les Rituels<br />de Soin</h1>
                <p className="home-day-ritual__byline">Diptyque</p>

                <a className="home-day-ritual__collection" href={collectionHref} aria-label="New Collection 보기">
                    <span>New Collection</span>
                    <img loading="lazy" decoding="async" fetchPriority="low" src={buttonArrow} alt="" />
                </a>
            </div>
        </section>
    );
}
