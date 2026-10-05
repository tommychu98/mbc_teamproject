import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HistoryMaisonMobile.css';

gsap.registerPlugin(ScrollTrigger);

const image = (name) => `/images/history/maison/${name}`;

export default function HistoryMaisonTodayMobile() {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(max-width: 767px)', () => {
      const root = rootRef.current;
      const sun = root.querySelector('.history-maison-today-mobile__sun');
      const line = root.querySelector('.history-maison-today-mobile__fishing-line');
      const state = { progress: 0 };
      let geometry;
      const measure = () => {
        const scale = root.clientWidth / 430;
        const top = root.getBoundingClientRect().top + window.scrollY;
        const finalCenter = 52 + sun.offsetTop + sun.offsetWidth / 2;
        // The initial sun sits behind the cloud bank above FROM PARIS.
        const initialCenter = 52 + 900 * scale;
        const start = top + initialCenter - innerHeight * .25;
        const end = Math.max(start + 1, top + finalCenter - innerHeight * .55);
        geometry = { rise: finalCenter - initialCenter, start, end, lineHeight: 1037 * scale };
        line.style.height = `${geometry.lineHeight}px`;
      };
      const render = () => {
        const { rise, start, end, lineHeight } = geometry;
        const p = state.progress;
        const eased = (1 - Math.cos(Math.PI * p)) / 2;
        // Same viewport-space easing as the desktop useMaisonSun hook.
        const shift = -rise + (end - start) * p + (rise - (end - start)) * eased;
        gsap.set(sun, { y: shift });
        line.style.scale = `1 ${Math.max(0, lineHeight + shift) / lineHeight}`;
      };
      measure();
      const tween = gsap.to(state, {
        progress: 1, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: root, start: () => geometry.start, end: () => geometry.end,
          scrub: 0.8, invalidateOnRefresh: true,
          onRefreshInit: measure, onRefresh: render,
        },
      });
      render();
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(root);
      return () => {
        observer.disconnect();
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(sun, { clearProps: 'transform' });
        line.style.removeProperty('height');
        line.style.removeProperty('scale');
      };
    });
    return () => media.revert();
  }, []);
  return (
    <section ref={rootRef} className="history-maison-today-mobile" aria-labelledby="history-maison-today-mobile-title">
      <div className="history-maison-today-mobile__stage">
        <div className="history-maison-today-mobile__sky" aria-hidden="true">
          <img src={image('mobile-6b464.png')} alt="" />
        </div>

        <div className="history-maison-today-mobile__upper-scene" aria-hidden="true">
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--back" src={image('mobile-1f113.png')} alt="" />
          <div className="history-maison-today-mobile__angel history-maison-today-mobile__angel--harp">
            <img src={image('mobile-b862e.png')} alt="" />
          </div>
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--middle" src={image('mobile-47ca9.png')} alt="" />
          <div className="history-maison-today-mobile__angel history-maison-today-mobile__angel--fishing">
            <img src={image('mobile-7ca0d.png')} alt="" />
          </div>
          <img className="history-maison-today-mobile__fishing-line" src={image('mobile-fishing-line.svg')} alt="" />
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--bank" src={image('mobile-41545.png')} alt="" />
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--bridge" src={image('mobile-47ca9.png')} alt="" />
        </div>

        <article className="history-maison-today-mobile__copy history-maison-today-mobile__copy--today">
          <h2 id="history-maison-today-mobile-title">THE<br />MAISON<br />TODAY</h2>
          <p>오늘날 딥디크의 세계는<br />처음보다 훨씬 넓어졌습니다.</p>
          <p>하지만 자연과 예술, 여행과 발견<br />에서 영감을 얻는 태도는 여전히<br />그 중심에 남아 있습니다.</p>
        </article>

        <article className="history-maison-today-mobile__copy history-maison-today-mobile__copy--outward">
          <h2>FROM<br />PARIS,<br />OUTWARD</h2>
          <p>파리의 작은 공간에서 시작된 감각은<br />시간이 흐르며 더 넓은<br />세계로 이어졌습니다.</p>
          <p>딥디크의 역사는 완성된<br />이야기가 아니라 계속<br />만들어지는 과정에 가깝습니다.</p>
          <p>처음의 시선은 남아 있고,<br />그것을 표현하는 형태만<br />계속 새로워지고 있습니다.</p>
        </article>

        <div className="history-maison-today-mobile__lower-scene" aria-hidden="true">
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--outward" src={image('mobile-ced45.png')} alt="" />
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--sea-one" src={image('mobile-4607c.png')} alt="" />
          <img className="history-maison-today-mobile__cloud history-maison-today-mobile__cloud--sea-two" src={image('mobile-15b48.png')} alt="" />
          <img className="history-maison-today-mobile__sun" src={image('mobile-f5fdb.png')} alt="" />
          <img className="history-maison-today-mobile__plant history-maison-today-mobile__plant--left" src={image('mobile-97036.png')} alt="" />
          <img className="history-maison-today-mobile__plant history-maison-today-mobile__plant--hill" src={image('mobile-c7d5c.png')} alt="" />
          <img className="history-maison-today-mobile__plant history-maison-today-mobile__plant--cactus" src={image('mobile-245eb.png')} alt="" />
          <img className="history-maison-today-mobile__plant history-maison-today-mobile__plant--agave" src={image('mobile-28d63.png')} alt="" />
          <img className="history-maison-today-mobile__plant history-maison-today-mobile__plant--rock" src={image('mobile-0e594.png')} alt="" />
          <img className="history-maison-today-mobile__plant history-maison-today-mobile__plant--right" src={image('mobile-006f1.png')} alt="" />
        </div>
      </div>
    </section>
  );
}
