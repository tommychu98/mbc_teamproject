import { useLayoutEffect, useRef } from 'react';
import useAmbientWind from './useAmbientWind';
import flowers from '../HomeNightRitual/assets/foreground-flowers.png';
import p56 from './assets/element-56.png';
import p52 from './assets/element-52.png';
import p45 from './assets/element-45.png';
import p07 from './assets/element-07.png';
import p25 from './assets/element-25.png';
import p20 from './assets/element-20.png';
import p05 from './assets/element-05.png';
import p08 from './assets/element-08.png';
import p59 from './assets/element-59.png';
import './MobileNightWind.css';

const PARTICLES = [
    [p56,195,100,42.967,39.717,34.771,29.029,21.4,1,'botanical'],
    [p52,215,140,41.272,40.726,36.108,21.895,-136.56,1,'botanical'],
    [p45,207,185,50.205,46.618,35.984,41.421,-107.19,1,'botanical'],
    [p07,168,232,39.196,48.406,23.061,42.628,25.56,1,'botanical'],
    [p25,308.34,156.78,29.276,19.21,28.884,18.595,-178.77,.6,'petal'],
    [p25,126,292,29.729,34.187,28.884,18.595,-62.84,.6,'petal'],
    [p20,276,611,51.286,48.226,41.612,36.675,19,.6,'flower'],
    [p05,199,388,31.599,33.64,28.503,25.762,-76.78,.6,'petal'],
    [p08,140,535,47.727,48.389,36.118,34.342,-119.7,.6,'leaf'],
    [p59,203,764,49.852,49.959,36.513,34.099,46.79,.6,'flower'],
];

export default function MobileNightWind() {
    const rootRef = useRef(null);
    useLayoutEffect(() => {
        const root = rootRef.current;
        const measure = () => root.style.setProperty('--mobile-wind-scale', root.clientWidth / 430);
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        measure();
        return () => observer.disconnect();
    }, []);
    useAmbientWind(rootRef, true);
    return <div className="home-mobile-wind" ref={rootRef} data-node-id="2452:12489" aria-hidden="true">
        <div className="home-mobile-wind__canvas night-journey__canvas">
            <div className="home-mobile-wind__branch"><img src={flowers} alt="" /></div>
            {PARTICLES.map(([src,x,y,w,h,iw,ih,angle,opacity,type],index) => <span className="home-mobile-wind__particle" key={index} style={{left:x,top:y,width:w,height:h,opacity}}>
                <span className="night-journey__wind" data-motion-type={type}><img src={src} alt="" style={{width:iw,height:ih,transform:`rotate(${angle}deg)`}} /></span>
            </span>)}
        </div>
    </div>;
}
