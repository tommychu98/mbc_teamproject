import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { nightJourneyPanels } from './nightJourneyData';
import arrow from '../HomeNightRitual/assets/mobile-arrow.svg';
import useAmbientWind from './useAmbientWind';
import p25 from './assets/element-25.png';
import p20 from './assets/element-20.png';
import p05 from './assets/element-05.png';
import p08 from './assets/element-08.png';
import p59 from './assets/element-59.png';
import p42 from './assets/element-42.png';
import './MobileCategoryCarousel.css';

const CATEGORIES = nightJourneyPanels.slice(1).map(panel => panel.category);
const DESCRIPTIONS = [
    ['Eaux de parfum , Eaux de toilette ,', 'Exclusive Perfumes'],
    ['Scented Candles , Room Sprays ,', 'All Diffusers'],
    ['Body Care , Hand Care ,', 'Refillable Care'],
    ['Candle Holder & Lids , Stands', 'Others'],
];
const PARTICLES = [
    [p25,58,161,30.724,34.328,28.884,18.595,-59.34,'petal'],
    [p25,320,496,31.557,23.108,28.884,18.595,-170.5,'petal'],
    [p20,47,688,43.692,47.639,41.612,36.675,-79.42,'flower'],
    [p05,51,514,31.599,33.64,28.503,25.762,-76.78,'petal'],
    [p08,165,311,47.727,48.389,36.118,34.342,-119.7,'leaf'],
    [p59,327,763,49.852,49.959,36.513,34.099,46.79,'flower'],
    [p42,80,804,39.925,39.24,32.536,31.54,164.12,'flower'],
];

export default function MobileCategoryCarousel() {
    const rootRef = useRef(null);
    const viewportRef = useRef(null);
    const activeRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    useAmbientWind(rootRef, true);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const viewport = viewportRef.current;
        const measure = () => {
            root.style.setProperty('--mobile-category-scale', root.clientWidth / 430);
            viewport.scrollLeft = activeRef.current * viewport.clientWidth;
        };
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        measure();
        return () => observer.disconnect();
    }, []);
    const onScroll = () => {
        const viewport = viewportRef.current;
        const index = Math.max(0, Math.min(3, Math.round(viewport.scrollLeft / viewport.clientWidth)));
        activeRef.current = index;
        setActiveIndex(index);
    };
    const onKeyDown = event => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const next = Math.max(0, Math.min(3, activeRef.current + (event.key === 'ArrowRight' ? 1 : -1)));
        viewportRef.current.scrollTo({ left: next * viewportRef.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };
    return <section className="mobile-categories" ref={rootRef} data-node-id="2452:12423" data-active-index={activeIndex} aria-label="Diptyque categories" aria-roledescription="carousel">
        <div className="mobile-categories__ambient night-journey__canvas" aria-hidden="true">
            {PARTICLES.map(([src,x,y,w,h,iw,ih,angle,type],index) => <span className="mobile-categories__particle" key={index} style={{left:x,top:y,width:w,height:h,opacity:.6}}><span className="night-journey__wind" data-motion-type={type}><img src={src} alt="" style={{width:iw,height:ih,transform:`rotate(${angle}deg)`}} /></span></span>)}
        </div>
        <div className="mobile-categories__viewport" ref={viewportRef} onScroll={onScroll} onKeyDown={onKeyDown} tabIndex={0} aria-label="카테고리 좌우 스와이프">
            {CATEGORIES.map((category,index) => <article className="mobile-categories__slide" key={category.number} aria-label={`${index+1} of 4: ${category.title}`} aria-roledescription="slide">
                <div className="mobile-categories__canvas">
                    <div className="mobile-categories__card">
                        <img className="mobile-categories__image" src={category.image} alt={category.alt} />
                        <div className="mobile-categories__copy">
                            <div><p className="mobile-categories__number">{category.number}</p><h3>{category.title}</h3></div>
                            <p className="mobile-categories__description">{DESCRIPTIONS[index][0]}<br />{DESCRIPTIONS[index][1]}</p>
                            <Link className="mobile-categories__link" to={category.href} tabIndex={index === activeIndex ? 0 : -1}><span>View More</span><img src={arrow} alt="" /></Link>
                        </div>
                        <p className="mobile-categories__counter">{index+1}/4</p>
                    </div>
                </div>
            </article>)}
        </div>
        <span className="mobile-categories__announcement" aria-live="polite">{activeIndex+1}/4 {CATEGORIES[activeIndex].title}</span>
    </section>;
}
