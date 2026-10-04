import { useEffect, useRef } from 'react';
import './HistoryFabricMobile.css';

const existingAssets = {
  '5cb41.png': 'story-decorative-fabric-01.png',
  '6346d.png': 'floating-fabric-collage-01.png',
  'aa109.png': 'floating-decorative-fabric-01.png',
  '1e4e8.png': 'story-decorative-detail-01.png', '4258d.png': 'floating-decorative-object-08.png',
  '4bd3c.png': 'floating-fabric-collage-02.png', '82251.png': 'floating-small-accent-01.png',
  '851a6.png': 'floating-decorative-object-02.png', '8cb76.png': 'floating-small-accent-02.png',
  '8cc66.png': 'story-object-accent.png', '985ec.png': 'floating-small-accent-03.png',
  '9f901.png': 'floating-decorative-object-07.png', 'a5f2e.png': 'fabric-pick-up.png',
  'b0706.png': 'floating-decorative-object-05.png', 'c4e06.png': 'story-decorative-detail-02.png',
  'c6f88.png': 'story-founders-visual.png', 'f3ab8.png': 'floating-decorative-object-01.png',
  'f6547.png': 'floating-decorative-object-06.png',
};
const asset = (name) => `/images/history/fabric/${existingAssets[name] || `mobile/${name}`}`;
// Figma 2893:4583, 430 × 935. Preserve the individual collage layers.
const layers = [
  ['f3ab8.png', -114, 485, 174, 175],
  ['851a6.png', 207, 270, 276.648, 276.648, 205.832, 205.832, -26.88],
  ['8cb76.png', 12, 798, 48.02, 48.02, 36.285, 36.285, 24.35, .8],
  ['b0706.png', 300, 832, 172.627, 172.627, 168.162, 168.162, -91.54],
  ['f6547.png', 198, 660, 223.34, 223.34, 158.587, 158.587, -39.76],
  ['1e4e8.png', 220, 726, 152, 98],
  ['c4e06.png', 76, 726, 144, 98],
  ['8cc66.png', 36, 590, 124, 206, 206, 124, 90],
  ['82251.png', -15.684, 499.32, 130.364, 130.364, 99, 99, -23.61, .8],
  ['fa587.png', -25, 430, 475, 475, 475, 475, 0, 1, true],
  ['82251.png', 330, 753, 130.364, 130.364, 99, 99, 156.39, .8],
  ['985ec.png', 281, 822, 70.362, 70.362, 54.822, 54.822, 159.83, .8],
  ['4bd3c.png', -65, 768, 153.449, 230.173],
  ['9f901.png', 38, 793, 241, 241],
  ['4258d.png', 248, 808, 219.73, 219.73, 167.813, 167.813, 67.2],
  ['61882.png', -168, -10, 400.406, 474.913, 359, 442, 174.4, 1, 'y'],
  ['1e4e8.png', 238.96, 717.22, 152.12, 98.183],
  ['c6f88.png', 76.75, 503, 318.246, 348.795],
  ['c4e06.png', 97.4, 717.91, 143.271, 98.183],
  ['8cc66.png', 57, 621.447, 99.904, 166.507, 166.507, 99.904, 90],
  ['9b77c.png', 362.999, 595, 209.571, 247.845, 180.095, 225.038, 7.97],
];
const unit = (px) => `${px / 4.3}cqw`;
const storyLayers = [
  ['82251.png', 250, 118, 62.932, 62.932, 62.932, 62.932, 0, .8],
  ['8cb76.png', 12, 798, 48.02, 48.02, 36.285, 36.285, 24.35, .8],
  ['985ec.png', 316.005, 822, 72.205, 72.205, 54.822, 54.822, 66.36, .8],
  ['bd61f.png', -98, 87, 626, 626, 626, 626, -90],
  ['5cb41.png', -80, 656, 195.583, 195.583, 145.921, 145.921, -26.4],
  ['6346d.png', 337.01, 218.02, 291.061, 347.108, 255.85, 319.699, -6.63],
  ['2cfc5.png', 289, 370, 238.651, 258.761, 167, 208, 24.71],
  ['aa109.png', 27.004, 544, 474.796, 474.796, 410.716, 410.716, -9.83],
  ['7cb5d.png', -112, 707, 327.783, 327.783, 233.281, 233.281, -51.51],
  ['f1f37.png', -29, 555, 194.715, 194.715, 180.737, 180.737, 175.38],
];

const visionsLayers = [
  ['7fe88.png', -243, -6, 771, 771],
  ['82251.png', 250, 118, 62.932, 62.932, 62.932, 62.932, 0, .8],
  ['8cb76.png', 12, 798, 48.02, 48.02, 36.285, 36.285, 24.35, .8],
  ['985ec.png', 316.005, 822, 72.205, 72.205, 54.822, 54.822, 66.36, .8],
  ['5cb41.png', 74, 798, 195.583, 195.583, 145.921, 145.921, -26.4],
  ['f86fc.png', -146, 686, 331.406, 331.406, 250.886, 250.886, 114.08],
  ['f6547.png', -167, 367, 480.46, 480.46, 341.545, 341.545, 39.1],
  ['fa57c.png', 122, 0, 881.828, 721.702, 592.893, 790.524, 79.95],
  ['b0706.png', 262.003, 679, 172.627, 172.627, 168.162, 168.162, -91.54],
  ['567a8.png', 132, 599, 556.733, 556.733, 434.529, 434.529, -70.05],
];

export default function HistoryFabricMobile() {
  const ref = useRef(null);
  const storyRef = useRef(null);
  const visionsRef = useRef(null);
  useEffect(() => {
    const media = matchMedia('(max-width: 767px)');
    let frame, busy = false, lastWheel = 0, wheelDistance = 0, touchY = null, gesture = false, targetIndex = 0;
    const targets = () => {
      const pages = [0, ...[ref.current, storyRef.current, visionsRef.current, ...document.querySelectorAll('[data-history-mobile-page]')].map(item => item.getBoundingClientRect().top + window.scrollY)];
      const collect = document.querySelector('.history-collect-mobile');
      if (collect) {
        const top = collect.getBoundingClientRect().top + window.scrollY;
        pages.push(top - ref.current.offsetHeight, top, top + ref.current.offsetHeight);
      }
      const scent = document.querySelector('.history-scent-mobile');
      if (scent) pages.push(scent.getBoundingClientRect().top + window.scrollY);
      const candle = document.querySelector('.history-candle-mobile');
      if (candle) pages.push(candle.getBoundingClientRect().top + window.scrollY);
      const scentSpace = document.querySelector('.history-scent-space-mobile');
      if (scentSpace) pages.push(scentSpace.getBoundingClientRect().top + window.scrollY);
      const maison = document.querySelector('.history-maison-mobile');
      if (maison) pages.push(maison.getBoundingClientRect().top + window.scrollY);
      const maisonWord = document.querySelector('.history-maison-word-mobile');
      if (maisonWord) pages.push(maisonWord.getBoundingClientRect().top + window.scrollY);
      const maisonToday = document.querySelector('.history-maison-today-mobile');
      if (maisonToday) pages.push(maisonToday.getBoundingClientRect().top + window.scrollY);
      return pages;
    };
    const blocked = (e) => e.target.closest('a,button,input,textarea,select,[contenteditable],.header__nav');
    const destination = (delta) => {
      const stops = targets();
      const y = window.scrollY;
      // Objects stays native-scrolling until its final viewport. Only the
      // boundary from that last viewport to Collect returns to paging.
      if (stops.length > 5 && y > stops[4] + 2 && y < stops[5] - 2) return null;
      if (stops.length > 5 && delta > 0 && y >= stops[4] - 2 && y < stops[5] - 2) return null;
      if (y > stops.at(-1) + 2) return null;
      if (delta > 0) return stops.find(stop => stop > y + 2) ?? null;
      if (delta < 0) return [...stops].reverse().find(stop => stop < y - 2) ?? null;
      return null;
    };
    const move = (to) => {
      busy = true;
      const stops = targets();
      targetIndex = stops.indexOf(to);
      const from = window.scrollY, start = performance.now();
      // Keep a consistent speed per viewport. SCENT is two viewports tall,
      // so reaching THE CANDLE must take twice as long as a normal page snap.
      const viewportDistance = Math.max(1, Math.abs(to - from) / window.innerHeight);
      const duration = 700 * viewportDistance;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
        if (t < 1) frame = requestAnimationFrame(tick);
        else busy = false;
      };
      frame = requestAnimationFrame(tick);
    };
    const wheel = (e) => {
      if (!media.matches || blocked(e) || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const now = performance.now(), tail = now - lastWheel < 160;
      const to = destination(e.deltaY);
      if (busy || (gesture && tail)) { e.preventDefault(); lastWheel = now; return; }
      gesture = false;
      if (!tail || Math.sign(wheelDistance) !== Math.sign(e.deltaY)) wheelDistance = 0;
      if (to !== null) {
        e.preventDefault();
        wheelDistance += e.deltaY;
        lastWheel = now;
        if (Math.abs(wheelDistance) >= 3) { gesture = true; wheelDistance = 0; move(to); }
      }
    };
    const start = (e) => { touchY = !blocked(e) && e.touches.length === 1 ? e.touches[0].clientY : null; gesture = false; };
    const touch = (e) => {
      if (!media.matches || touchY === null || e.touches.length !== 1) return;
      const delta = touchY - e.touches[0].clientY;
      const to = destination(delta);
      if (busy || gesture) { e.preventDefault(); return; }
      if (to !== null) { e.preventDefault(); if (Math.abs(delta) >= 24) { gesture = true; move(to); } }
    };
    const key = (e) => {
      if (!media.matches || blocked(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      const delta = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? (e.shiftKey ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0;
      if (!delta) return;
      const to = destination(delta);
      if (busy || to !== null) { e.preventDefault(); if (!busy) move(to); }
    };
    const reset = () => { cancelAnimationFrame(frame); busy = false; gesture = false; wheelDistance = 0; };
    const resize = () => {
      const wasMoving = busy;
      reset();
      if (wasMoving && media.matches) window.scrollTo({ top: targets()[targetIndex], behavior: 'instant' });
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', touch, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('resize', resize);
    return () => {
      reset();
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <><section ref={ref} className="history-fabric-mobile" aria-labelledby="history-fabric-mobile-title">
    <img className="history-fabric-mobile__background" src={asset('a1b03.png')} alt="" />
    <div className="history-fabric-mobile__stage">
    <div className="history-fabric-mobile__copy">
      <h2 id="history-fabric-mobile-title">FABRIC</h2>
      <img className="history-fabric-mobile__divider" src={asset('a21f2.svg')} alt="" />
      <p>It began with a pattern.<br />Before scent, there was texture.</p>
    </div>
    {layers.map(([name, x, y, w, h, iw = w, ih = h, rotate = 0, opacity = 1, flip], i) =>
      <div key={i} className="history-fabric-mobile__layer" aria-hidden="true" style={{ left: unit(x), top: unit(y - 52), width: unit(w), height: unit(h) }}>
        <img src={asset(name)} alt="" style={{ width: unit(iw), height: unit(ih), opacity, transform: `rotate(${rotate}deg) scale(${flip === true ? -1 : 1}, ${flip === 'y' ? -1 : 1})` }} />
      </div>)}
    </div>
  </section>
  <section ref={storyRef} className="history-fabric-mobile history-fabric-mobile--story" aria-labelledby="history-fabric-mobile-story-title">
    <img className="history-fabric-mobile__background" src={asset('a1b03.png')} alt="" />
    <div className="history-fabric-mobile__stage">
      {storyLayers.map(([name, x, y, w, h, iw, ih, rotate = 0, opacity = 1], i) =>
        <div key={i} className="history-fabric-mobile__layer" aria-hidden="true" style={{ left: unit(x), top: unit(y - 52), width: unit(w), height: unit(h) }}>
          <img src={asset(name)} alt="" style={{ width: unit(iw), height: unit(ih), opacity, transform: `rotate(${rotate}deg)` }} />
        </div>)}
      <article className="history-fabric-mobile__story">
        <h2 id="history-fabric-mobile-story-title">A Language<br />Born from<br />Fabric</h2>
        <div className="history-fabric-mobile__story-body">
          <p>딥디크의 첫 번째 언어는<br />향이 아니라 패턴과 직물이었습니다.<br />형태와 색, 반복되는 리듬 속에서<br />브랜드의 감각이 처음 모습을 드러냈습니다.</p>
          <p>서로 다른 예술적 배경을<br />가진 세 창립자는 하나의 공간에서<br />감각을 공유했습니다.<br />각자의 시선은 패브릭과<br />드로잉을 통해 하나의 새로운 세계로 연결되었습니다.</p>
        </div>
      </article>
    </div>
  </section>
  <section ref={visionsRef} className="history-fabric-mobile history-fabric-mobile--visions" aria-labelledby="history-fabric-mobile-visions-title">
    <img className="history-fabric-mobile__background" src={asset('a1b03.png')} alt="" />
    <div className="history-fabric-mobile__stage">
      {visionsLayers.map(([name, x, y, w, h, iw = w, ih = h, rotate = 0, opacity = 1], i) =>
        <div key={i} className="history-fabric-mobile__layer" aria-hidden="true" style={{ left: unit(x), top: unit(y - 52), width: unit(w), height: unit(h) }}>
          <img src={asset(name)} alt="" style={{ width: unit(iw), height: unit(ih), opacity, transform: `rotate(${rotate}deg)` }} />
        </div>)}
      <article className="history-fabric-mobile__story">
        <h2 id="history-fabric-mobile-visions-title">Three Visions<br />One World</h2>
        <div className="history-fabric-mobile__story-body">
          <p>세 사람은 같은 것을 보면서도<br />서로 다른 방식으로 해석했습니다.<br />그 차이는 오히려 딥디크만의 독특한<br />균형과 리듬을 만들어냈습니다.</p>
          <p>서로 다른 예술적 배경을 가진<br />세 창립자는 하나의 공간에서<br />감각을 공유했습니다.<br />각자의 시선은 패브릭과 드로잉을<br />통해 하나의 새로운 세계로<br />연결되었습니다.</p>
        </div>
      </article>
    </div>
  </section></>;
}
