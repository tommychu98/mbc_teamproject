import { useEffect, useId, useRef, useState } from 'react';
import background from './assets/background.png';

export default function NightBackground() {
    const filterId = `night-leaf-wind-${useId().replaceAll(':', '')}`;
    const imageRef = useRef(null);
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        let visible = false;
        const update = () => setMoving(visible && !reduced.matches);
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            update();
        });
        observer.observe(imageRef.current);
        reduced.addEventListener('change', update);
        return () => {
            observer.disconnect();
            reduced.removeEventListener('change', update);
        };
    }, []);

    return (
        <>
            <svg className="home-night-ritual__wind-definitions" aria-hidden="true" focusable="false">
                <defs>
                    <filter id={filterId} x="-1%" y="-1%" width="102%" height="102%" colorInterpolationFilters="sRGB">
                        <feTurbulence type="fractalNoise" baseFrequency=".005 .008" numOctaves="1" seed="7" result="wind" />
                        {/* Feather the wind field around the right branches. A neutral
                            displacement outside this area keeps the architecture still. */}
                        <feFlood floodColor="white" x="76%" y="26%" width="24%" height="26%" result="leaves" />
                        <feGaussianBlur in="leaves" stdDeviation="10" result="softLeaves" />
                        <feComposite in="wind" in2="softLeaves" operator="in" result="leafWind" />
                        <feFlood floodColor="rgb(50%, 50%, 50%)" result="neutral" />
                        <feComposite in="neutral" in2="softLeaves" operator="out" result="still" />
                        <feComposite in="leafWind" in2="still" operator="arithmetic" k2="1" k3="1" result="localWind" />
                        <feDisplacementMap in="SourceGraphic" in2="localWind" scale="0" xChannelSelector="R" yChannelSelector="G">
                            {moving && <animate attributeName="scale" values="0;5;0;-5;0" dur="8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.25;.5;.75;1" keySplines=".42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1" />}
                        </feDisplacementMap>
                    </filter>
                </defs>
            </svg>
            <img ref={imageRef} className="home-night-ritual__background" src={background} alt="" style={{ filter: moving ? `url(#${filterId})` : 'none' }} />
        </>
    );
}
