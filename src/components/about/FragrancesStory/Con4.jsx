import { useEffect, useRef } from 'react';
import useStoryTypographyMotion from './useStoryTypographyMotion';
import useCon4ManEntrance from './useCon4ManEntrance';
import StoryImage from './StoryImage';
import man from './assets/mobile-con4-man.png';
import mobileTable from './assets/mobile-con4-table.png';
import desktopMan from './assets/con4-desktop-man.png';
import desktopTable from './assets/con4-desktop-table.png';
import petal1 from './assets/con4-desktop-petal-1.png';
import petal2 from './assets/con4-desktop-petal-2.png';
import petal3 from './assets/con4-desktop-petal-3.png';
import cabinet from './assets/con4-cabinet.png';
import clock from './assets/con4-clock.png';
import drawing1 from './assets/con4-drawing1.png';
import drawing2 from './assets/con4-drawing2.png';
import './Con4.css';

export default function Con4() {
  const sceneRef = useRef(null);
  useStoryTypographyMotion(sceneRef, 'con4', 'title-the', 'title-34');
  useCon4ManEntrance(sceneRef);

  useEffect(() => {
    const scene = sceneRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      scene.classList.toggle('fragrances-con4__scene--visible', entry.isIntersecting);
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="fragrances-con4" aria-labelledby="fragrances-con4-title">
      <div ref={sceneRef} className="fragrances-con4__scene">
        {/* Exports already contain 80% alpha. Restore solid petal interiors
            without changing their RGB artwork or antialiased edges. */}
        <svg className="fragrances-con4__effects" width="0" height="0" aria-hidden="true" focusable="false">
          <defs>
            <filter id="fragrances-con4-petal-opacity" colorInterpolationFilters="sRGB">
              <feComponentTransfer>
                <feFuncA type="linear" slope="1.27" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <p className="fragrances-con4__text fragrances-con4__text--body1">
          오 드 퍼퓸은 34번가의 기억을 더욱 깊이 담아냅니다.<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          바닐라와 앰버 우드가 풍성한 온기를 더하며,<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          오래된 부티크의 따스한 분위기를 그립니다.
        </p>
        <p className="fragrances-con4__text fragrances-con4__text--body2">
          문이 닫힌 뒤에도 향은 그 자리에 남아,<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          당신의 향취와 함께 34번가의 기억을 불러옵니다.
        </p>
        <div className="fragrances-con4__intro">
          <h3 className="fragrances-con4__subtitle"><span className="fragrances-story__desktop-copy">BEFORE FRAGRANCE, THERE WAS A PLACE</span><span className="fragrances-story__mobile-copy">BEFORE FRAGRANCE,<br />THERE WAS A PLACE</span></h3>
          <p className="fragrances-con4__text">
            34번가의 문이 처음 열리던 날,<br /><span className="fragrances-story__mobile-copy">{' '}</span>
            그 공간을 가득 채운 향에서 이야기는 시작됩니다.
          </p>
        </div>
        <h2 className="fragrances-con4__title" id="fragrances-con4-title">
          <span className="fragrances-con4__title-the">The </span>
          <span className="fragrances-con4__title-34">34</span>
        </h2>
        <p className="fragrances-con4__chapter">Chapter II</p>

        <StoryImage mobileSrc={man} className="fragrances-con4__man" src={desktopMan} alt="직물을 살펴보는 남성 콜라주" width="1415" height="1548" draggable="false" />
        {/* Image_Calendar is an empty, transparent frame in the final Figma. */}
        <div className="fragrances-con4__calendar" aria-hidden="true" />
        <StoryImage mobileSrc={mobileTable} className="fragrances-con4__table" src={desktopTable} alt="꽃무늬 직물, 촛대, 상자와 편지가 놓인 나무 테이블" width="1920" height="960" draggable="false" />
        {/* Reuse only the candle pixels from the table; keep the wax and brass still. */}
        <div className="fragrances-con4__candle" aria-hidden="true">
          {/* One filled plume: its base stays connected and the curl travels upward. */}
          <svg className="fragrances-con4__smoke" viewBox="0 -40 82 196" width="82" height="196" focusable="false">
            <defs>
              <linearGradient id="fragrances-con4-smoke-fade" x1="0" y1="152" x2="0" y2="-40" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#c4b8a5" stopOpacity="0.3" />
                <stop offset="0.18" stopColor="#bbb9b4" stopOpacity="0.62" />
                <stop offset="0.65" stopColor="#b7b7b3" stopOpacity="0.45" />
                <stop offset="0.84" stopColor="#b7b7b3" stopOpacity="0.2" />
                <stop offset="1" stopColor="#b7b7b3" stopOpacity="0" />
              </linearGradient>
              <filter id="fragrances-con4-smoke-soften" x="-20%" y="-10%" width="140%" height="120%">
                <feGaussianBlur stdDeviation="0.65" />
              </filter>
              {/* The photographed flame crop also contains old gray smoke.
                  Keep its bright flame pixels; the wick remains on the table. */}
              <filter id="fragrances-con4-flame-isolate" colorInterpolationFilters="sRGB">
                <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.2756 4.2912 0.4332 0 -3.3" result="flame-light-mask" />
                <feComposite in="SourceGraphic" in2="flame-light-mask" operator="in" />
              </filter>
            </defs>
            <path className="fragrances-con4__smoke-plume" d="M36.5 152 C36.69 149 37.18 141.33 37.63 134 C38.08 126.67 40.97 116.67 39.2 108 C37.43 99.33 30.65 90.67 27 82 C23.35 73.33 16.12 64.67 17.28 56 C18.45 47.33 28.14 38.67 33.99 30 C39.84 21.33 51.75 12.67 52.38 4 C53.02 -4.67 43.6 -14.67 37.8 -22 C32 -29.33 20.94 -37 17.57 -40 L30.57 -40 C33.77 -37 44.33 -29.33 49.8 -22 C55.27 -14.67 64.35 -4.67 63.38 4 C62.42 12.67 50.17 21.33 43.99 30 C37.8 38.67 27.78 47.33 26.28 56 C24.79 64.67 31.85 73.33 35 82 C38.15 90.67 44.16 99.33 45.2 108 C46.24 116.67 42.51 126.67 41.23 134 C39.94 141.33 38.12 149 37.5 152 Z" fill="url(#fragrances-con4-smoke-fade)" filter="url(#fragrances-con4-smoke-soften)" />
          </svg>
          <span className="fragrances-con4__candle-glow" />
          <div className="fragrances-con4__flame">
            <img src={desktopTable} alt="" width="1920" height="960" draggable="false" />
          </div>
        </div>
        <div className="fragrances-con4__petal fragrances-con4__petal--second" aria-hidden="true">
          <img src={petal2} alt="" width="1024" height="1024" draggable="false" />
        </div>
        <div className="fragrances-con4__cabinet">
          <div className="fragrances-con4__cabinet-artwork">
            <img className="fragrances-con4__cabinet-image" src={cabinet} alt="" width="1050" height="1498" draggable="false" />
          </div>
        </div>
        <div className="fragrances-con4__clock">
          <img className="fragrances-con4__clock-image fragrances-con4__clock-image--mount" src={clock} alt="" width="1024" height="1536" draggable="false" />
          <img className="fragrances-con4__clock-image fragrances-con4__clock-image--hanging" src={clock} alt="" width="1024" height="1536" draggable="false" />
        </div>
        <div className="fragrances-con4__petal fragrances-con4__petal--third" aria-hidden="true">
          <img src={petal3} alt="" width="1024" height="1024" draggable="false" />
        </div>
        <div className="fragrances-con4__petal fragrances-con4__petal--first" aria-hidden="true">
          <img src={petal1} alt="" width="1024" height="1024" draggable="false" />
        </div>
        <div className="fragrances-con4__drawing fragrances-con4__drawing--second">
          <img className="fragrances-con4__drawing-image fragrances-con4__drawing-image--second" src={drawing2} alt="" width="1536" height="1024" draggable="false" />
        </div>
        <div className="fragrances-con4__drawing fragrances-con4__drawing--first">
          <img className="fragrances-con4__drawing-image fragrances-con4__drawing-image--first" src={drawing1} alt="" width="1536" height="1024" draggable="false" />
        </div>
      </div>
    </section>
  );
}
