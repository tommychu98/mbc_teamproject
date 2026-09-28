import { useEffect, useRef, useState } from 'react';
import coast from './assets/coast-base.png';
import vessel from './assets/crystal-vessel.png';
import candle from './assets/candle.png';
import forest from './assets/95360.png';
import forestPerfume from './assets/3370f.png';
import hamster from './assets/69fd2.png';
import designingBackground from './assets/8eb2a.png';
import closingBackground from './assets/25fb5.png';
import emblem from './assets/emblem.png';
import ambitionPortrait from './assets/3228d.png';
import impactPortrait from './assets/81c67.png';
import ambitionDecoration from './assets/d1e91.png';
import impactDecoration from './assets/fbca1.png';
import impactCollage from './assets/3a37a.png';
import ambitionCollage from './assets/ea8c4.png';
import productLandscape from './assets/c4a07.png';
import productCollage from './assets/58a08.png';
import productDetail from './assets/61e53.png';
import ecoPainting from './assets/2736c.png';
import ecoCollage from './assets/5e0fa.png';
import ecoFrame from './assets/d8288.png';
import sustainableImage from './assets/d3fe2.png';
import ecoDesignImage from './assets/0b724.png';
import originImage from './assets/cc410.png';
import communityImage from './assets/0d2f8.png';
import ylangHarvest from './assets/2786b.png';
import ylangCollage from './assets/cd92d.png';
import ylangBottle from './assets/97c36.png';
import fragranceStill from './assets/f86d1.png';
import fragranceCollage from './assets/16a3b.png';
import fragranceProducts from './assets/cadcc.png';
import archFoliageLeft from './assets/596d1.png';
import archFoliageRight from './assets/a4d5f.png';
import decor01 from './assets/9ba2e.png';
import decor02 from './assets/b12b4.png';
import decor03 from './assets/33772.png';
import decor04 from './assets/4b050.png';
import decor05 from './assets/1cc56.png';
import decor06 from './assets/2fe33.png';
import decor07 from './assets/09970.png';
import decor08 from './assets/d910f.png';
import decor09 from './assets/65f92.png';
import decor10 from './assets/decc9.png';
import decor11 from './assets/95dd9.png';
import decor12 from './assets/4cd74.png';
import decor13 from './assets/de641.png';
import decor14 from './assets/d49c5.png';
import decor15 from './assets/7ef64.png';
import decor16 from './assets/6df44.png';
import decor17 from './assets/9ea37.png';
import decor18 from './assets/e8fc7.png';
import decor19 from './assets/927d6.png';
import decor20 from './assets/e2d7e.png';
import decor21 from './assets/c85a7.png';
import decor22 from './assets/7107d.png';
import decor23 from './assets/eeda9.png';
import decor24 from './assets/c50e1.png';
import decor25 from './assets/98e2c.png';
import decor26 from './assets/aa36e.png';
import './style.css';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (value, start, end) => clamp((value - start) / (end - start));
const ease = (value) => 1 - Math.pow(1 - clamp(value), 3);

function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      if (window.innerWidth < 900 || reducedMotion.matches) {
        setProgress(1);
        return;
      }
      const rect = element.getBoundingClientRect();
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      setProgress(clamp(-rect.top / distance));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);

  return [ref, progress];
}

const canvasPosition = (x, y, width, height) => ({
  left: `${(x / 1920) * 100}%`, top: `${(y / 1080) * 100}%`,
  width: `${(width / 1920) * 100}%`, height: `${(height / 1080) * 100}%`,
});

function ArchScene({ variant, first = false }) {
  const [ref, rawProgress] = useScrollProgress();
  const progress = ease(rawProgress);
  const isCoast = variant === 'coast';
  const background = isCoast ? coast : forest;
  const side = isCoast ? { leftX: 80, rightX: 1410, y: 373 } : { leftX: 97, rightX: 1412, y: 357 };
  const object = isCoast ? {
    vessel: { x: 155 + (139 - 155) * progress, y: 515 + (177 - 515) * progress, w: 278 + (488 - 278) * progress, h: 370 + (650 - 370) * progress },
    candle: { x: 847 + (526 - 847) * progress, y: 570 + (353 - 570) * progress, w: 223 + (395 - 223) * progress, h: 298 + (526 - 298) * progress },
  } : {
    perfume: { x: 848 + (766 - 848) * progress, y: 474 + (360 - 474) * progress, w: 221 + (387 - 221) * progress, h: 332 + (581 - 332) * progress },
    hamster: { x: 1606 + (1465 - 1606) * progress, y: 827 + (762 - 827) * progress, w: 102 + (142 - 102) * progress, h: 102 + (142 - 102) * progress },
  };
  const insetTop = 22.59 * (1 - progress);
  const insetLeft = 37.45 * (1 - progress);
  const insetRight = 37.5 * (1 - progress);
  const insetBottom = 13.98 * (1 - progress);

  return (
    <section ref={ref} className={`ftp-arch-scroll ${first ? 'ftp-arch-scroll--first' : ''}`} aria-label={isCoast ? '지중해 환경' : '숲의 환경'}>
      <div className="ftp-sticky-stage"><div className="ftp-arch-canvas">
        <div className="ftp-arch-decoration" aria-hidden="true">
          <img className="ftp-arch-decoration__left" src={archFoliageLeft} alt="" />
          <img className="ftp-arch-decoration__right" src={archFoliageRight} alt="" />
        </div>
        <div className="ftp-crest" style={{ opacity: (first ? 1 : range(rawProgress, 0, 0.1)) * (1 - range(rawProgress, 0.18, 0.4)) }} aria-hidden="true"><img src={emblem} alt="" /><span>FOR THE PLANET</span></div>
        <div className="ftp-side-arch" style={{ ...canvasPosition(side.leftX, side.y, 429, 611), opacity: 1 - range(rawProgress, 0.08, 0.34) }}>
          <img className="ftp-side-arch__background" src={background} alt="" />
          {isCoast && <img className="ftp-side-arch__object" src={vessel} alt="딥티크 크리스털 오브제" style={{ left: '17.48%', top: '23.24%', width: '64.8%', height: '60.56%' }} />}
        </div>
        <div className="ftp-side-arch" style={{ ...canvasPosition(side.rightX, side.y, 429, 611), opacity: 1 - range(rawProgress, 0.08, 0.34) }}>
          <img className="ftp-side-arch__background" src={background} alt="" />
          {!isCoast && <img className="ftp-side-arch__object" src={hamster} alt="숲속 햄스터" style={{ left: '45.22%', top: '76.92%', width: '23.78%', height: '16.69%' }} />}
        </div>
        <div className="ftp-expanding-arch" style={{ clipPath: `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}% round ${250 * (1 - progress)}px ${250 * (1 - progress)}px ${4 * (1 - progress)}px ${4 * (1 - progress)}px)` }}>
          <img className="ftp-expanding-arch__background" src={background} alt="" />
          {isCoast ? <>
            <img className="ftp-expanding-object" src={vessel} alt="딥티크 크리스털 오브제" style={canvasPosition(object.vessel.x, object.vessel.y, object.vessel.w, object.vessel.h)} />
            <img className="ftp-expanding-object" src={candle} alt="딥티크 캔들" style={canvasPosition(object.candle.x, object.candle.y, object.candle.w, object.candle.h)} />
          </> : <>
            <img className="ftp-expanding-object" src={forestPerfume} alt="딥티크 향수" style={canvasPosition(object.perfume.x, object.perfume.y, object.perfume.w, object.perfume.h)} />
            <img className="ftp-expanding-object ftp-expanding-object--no-shadow" src={hamster} alt="숲속 햄스터" style={canvasPosition(object.hamster.x, object.hamster.y, object.hamster.w, object.hamster.h)} />
          </>}
        </div>
        <div className="ftp-center-arch-outline" style={{ ...canvasPosition(719, 244, 481, 685), opacity: 1 - range(rawProgress, 0.12, 0.46) }} aria-hidden="true" />
        <p className="ftp-scroll-cue" style={{ opacity: 1 - range(rawProgress, 0.04, 0.2) }}>SCROLL TO EXPAND</p>
      </div></div>
    </section>
  );
}

const ambition = {
  id: 'our-ambition', portrait: ambitionPortrait, title: 'Our ambition', introBodyTop: 243,
  intro: [
    '딥티크는 투명한 공급망을 바탕으로 파트너와 함께 환경과 사회에 미치는 영향을 줄이고, 생물다양성을 보호하며 더욱 지속가능한 생산 방식을 만들어가고 있습니다.',
    '딥티크는 공급업체와의 협력을 바탕으로 공급망의 투명성과 추적 가능성을 높이고, 원료가 어디에서 어떻게 조달되는지 보다 명확하게 관리하고 있습니다. 또한 책임 있는 기준을 적용해 천연 원료 조달 과정에서 환경과 사회에 미치는 영향을 줄이고, 보다 지속가능한 생산 방식을 만들어가고 있습니다.',
  ],
  introDecoration: { src: ambitionDecoration, x: 1218, y: 106, w: 533, h: 533, opacity: 0.45 },
  extraDecoration: { src: ambitionCollage, x: 2633.5, y: 469, w: 389, h: 389, rotate: 30 },
  stats: [
    { x: 1580, y: 269, number: '2025', title: 'SUPPLIER CODE · COMMITMENT · STANDARDS', body: <>2025년까지 생산 관련<br />모든 공급업체가 행동강령에 서명합니다.</> },
    { x: 1910, y: 477, number: '2026', title: 'TRANSPARENCY · TRACEABILITY · PLATFORM', body: <>2026년까지 모든 제품 정보를<br />투명성 및 추적 플랫폼에 공개할 예정입니다.</> },
    { x: 2185, y: 685, number: '2028', title: 'RESPONSIBLE · SOURCING', body: <>2028년까지 향수 천연 원료 100%를<br />책임감 있게 조달하는 것을 목표로 합니다.</> },
  ],
  clusters: [
    [
      { src: productLandscape, x: 3067, y: 625, w: 651.24, h: 366.87, fromX: -650, fromY: 360 },
      { src: productCollage, x: 3553, y: 431, w: 599, h: 599, fromX: 620, fromY: -410, opacity: 0.86 },
      { src: productDetail, x: 3356, y: 159, w: 497.15, h: 445.87, fromX: -240, fromY: -540 },
    ],
    [
      { src: ecoPainting, x: 6575, y: 173, w: 490, h: 569, fromX: -600, fromY: 420 },
      { src: ecoCollage, x: 6842.89, y: 375.05, w: 531, h: 531, fromX: 520, fromY: 350 },
      { src: ecoFrame, x: 6987.83, y: 37, w: 598.71, h: 598.71, fromX: 280, fromY: -520, opacity: 0.8 },
    ],
  ],
  stories: [
    { x: 4225, y: 139, w: 1224, h: 649, image: sustainableImage, imageX: 16, imageY: 92, textX: 706, textY: 92, textW: 370, title: <>Striking a sustainable<br />balance</>, body: ['딥티크에게 자연은 소중한 자원이자 영감의 원천입니다. 우리는 환경에 미치는 영향을 더 깊이 이해하고 줄이기 위해 배출량을 측정하며, 지속 가능한 미래를 위한 실질적인 감축 계획을 이어가고 있습니다.'] },
    { x: 5358, y: 254, w: 1211, h: 676, image: ecoDesignImage, imageX: 45, imageY: 183, textX: 735, textY: 166, textW: 398, title: <>Eco-designing our creations<br />and solutions</>, body: ['딥티크는 환경에 미치는 영향을 줄이면서도 브랜드가 지닌 창의성과 품질을 유지하기 위해 운영과 생산 방식을 지속적으로 개선하고 있습니다. 제품을 만드는 전 과정에서 보다 책임 있는 선택을 고민하며, 환경 부담을 줄일 수 있는 방향을 모색하고 있습니다.', '또한 딥티크는 오랫동안 높은 품질의 제품을 만드는 것을 중요하게 여겨왔습니다. 이러한 기준을 유지하면서도 자원의 사용과 생산 과정 전반을 세심하게 살피고, 보다 지속가능한 방식으로 제품을 개발하기 위한 노력을 이어가고 있습니다.'] },
  ],
};

const impact = {
  id: 'environmental-impact', portrait: impactPortrait, title: <>Our Environmental<br />&amp; Social Impact</>, introBodyTop: 275,
  intro: [
    '딥티크는 지구의 생태계를 보호해야 할 책임을 중요하게 생각하며, 사회와 환경에 미치는 영향을 줄이기 위한 다양한 방안을 지속적으로 모색하고 있습니다.',
    '특히 공급업체와의 협력에서 투명성을 중요한 기준으로 삼아 탄소 배출을 줄이고 생물다양성을 보호하기 위해 노력합니다. 이를 통해 사회와 환경에 미치는 영향을 최소화하고, 보다 지속가능한 방식으로 발전해 나가는 것을 목표로 하고 있습니다.',
  ],
  introDecoration: { src: impactDecoration, x: 1081, y: 301, w: 802, h: 733, opacity: 1 },
  extraDecoration: { src: impactCollage, x: 2598, y: 412, w: 379, h: 379 },
  stats: [
    { x: 1643, y: 248, number: '10', title: 'SUSTAINABLE PARTNERSHIP', body: <>지속 가능한 공급망을 위해 지역 재단과<br />10년간 협력해오고 있습니다.</> },
    { x: 1973, y: 456, number: '+50,000', title: 'REFORESTATION SUPPORT', body: <>2014년부터 코모로 제도에<br />5만 그루 이상의 나무를 심었습니다.</> },
    { x: 2303, y: 664, number: '+100', title: 'WOMEN & SUSTAINABILITY', body: <>100명 이상의 여성에게 생물 관리와<br />지속 가능한 생산 교육을 지원합니다.</> },
  ],
  clusters: [
    [
      { src: ylangHarvest, x: 3149, y: 96, w: 611.18, h: 611.18, fromX: -640, fromY: -430, rotate: 8.62 },
      { src: ylangCollage, x: 3677.01, y: 209.78, w: 467.61, h: 467.61, fromX: 570, fromY: -180, rotate: -12.38 },
      { src: ylangBottle, x: 3520.58, y: 609.24, w: 286.21, h: 357.76, fromX: -210, fromY: 430 },
    ],
    [
      { src: fragranceStill, x: 6626, y: 152, w: 506.91, h: 506.91, fromX: -600, fromY: -390 },
      { src: fragranceCollage, x: 6626, y: 442.22, w: 906.45, h: 518.78, fromX: -520, fromY: 430 },
      { src: fragranceProducts, x: 7153, y: 252, w: 450.33, h: 450.33, fromX: 620, fromY: -260 },
    ],
  ],
  stories: [
    { x: 4257, y: 281, w: 1166, h: 649, image: originImage, imageX: 16, imageY: 107, textX: 706, textY: 107, textW: 310, title: <>Information on the origin<br />of our ingredients</>, body: ['딥티크는 투명성을 중요한 가치로 여기며, 제품의 구성 성분과 원료의 원산지, 공급업체 정보를 고객에게 제공합니다.', '보다 정확한 추적을 위해 블록체인 기반 플랫폼을 도입해 주요 원료의 상세 정보를 확인할 수 있도록 하고 있으며, 앞으로는 제품 패키지의 QR 코드를 통해 더욱 쉽게 확인할 수 있습니다.', '향수 원액부터 향수, 화장품, 홈 제품에 사용되는 주요 성분까지 투명하게 공개하고 있습니다.'] },
    { x: 5408, y: -16, w: 1166, h: 649, image: communityImage, imageX: 45, imageY: 162, textX: 735, textY: 162, textW: 387, title: <>Partnering<br />with local communities</>, body: ['천연 원료 조달의 투명성을 높이기 위해 공급업체의 모범 사례를 공유하고 지원합니다. 또한 오랜 파트너십을 통해 지역 사회의 자립과 지속 가능한 발전을 함께 만들어가고 있습니다.', '삼림 벌채와 농업 확장으로 어려움을 겪는 지역에서는 생태계 회복을 위한 다양한 활동을 이어갑니다. 과일나무 재배, 친환경 스토브 설치, 훼손된 토지 복원과 나무 심기 등을 통해 자연을 보호하고 지역 주민들에게 새로운 기회를 제공하고 있습니다.'] },
  ],
};

const worldPosition = (x, y, width, height) => ({
  left: `${x}px`, top: `${y}px`,
  width: `${width}px`, height: `${height}px`,
});

// Figma background image layers across the four 1920px story panels.
const ambitionBackground = [
  [decor01,1651,714,48,51],[decor02,1322.5,684,71,74],[decor03,1388,181,113,88],
  [decor04,1509,811,65,57],[decor06,373,702,162,126],[decor11,942,710,144,102],
  [decor09,708,853,74,72],
  [decor12,2135,437,74,72],[decor05,2534,359,75,65],[decor13,3388,296,68,63],
  [decor14,3351,359,60,74],[decor15,2776,170,59,58],[decor16,2311,340,58,56],
  [decor16,3158,484,58,56],[decor10,2992,302,81,86],[decor18,3172,492,35,33],
  [decor10,2685,566,107,85],[decor19,4769,882,69,76],[decor20,4369,265,106,106],
  [decor21,4379,605,72,64],[decor22,4604,527,99,97],[decor10,4138,190,81,86],
  [decor19,5000,605,69,76],[decor23,5565,912,95,82],[decor19,7057,1047,69,76],
  [decor24,5823,975,72,75],[decor19,6177,1029,69,76],
];
const impactBackground = [
  [decor06,373,701,162,126],[decor08,594,893,96,69],[decor04,1257,163,65,57],
  [decor07,894,792,91,69],[decor11,1108,263,123,147],[decor09,1225,271,65,62],
  [decor03,1388,180,113,88],[decor01,1344,122,48,44],[decor25,1034,471,58,60],
  [decor05,1163,609,81,77],[decor02,1860,126,61,56],[decor09,708,681,74,72],
  [decor26,932,701,70,69],[decor16,3158,484,58,56],[decor16,2370,411,58,56],
  [decor14,3351,359,60,74],[decor13,3430,333,68,63],[decor05,2554,347,75,65],
  [decor12,2135,283,74,72],[decor15,2776,381,59,58],[decor17,4041,812,86,85],
  [decor05,3312,751,62,50],[decor01,2177,755,44,47],
  [decor19,4769,882,69,76],[decor20,4369,265,106,106],[decor21,4413,583,63,52],
  [decor24,5019,594,72,75],[decor22,4604,527,99,97],
  [decor19,7057,1047,69,76],[decor24,5823,975,72,75],
  [decor19,6177,1029,69,76],[decor05,7354,190,77,81],
];

function StoryBackground({ kind }) {
  const pieces = kind === 'our-ambition' ? ambitionBackground : impactBackground;
  return <div className="ftp-world-background" aria-hidden="true">{pieces.map(([src,x,y,w,h], i) =>
    <img key={i} src={src} alt="" style={worldPosition(x,y,w,h)} />
  )}</div>;
}

function StoryCluster({ images, progress, start, end }) {
  const reveal = ease(range(progress, start, end));
  return images.map((item) => <img key={item.src} className="ftp-world-cluster-image" src={item.src} alt="" style={{
    ...worldPosition(item.x, item.y, item.w, item.h), opacity: (item.opacity ?? 1) * reveal,
    transform: `translate(${item.fromX * (1 - reveal)}px, ${item.fromY * (1 - reveal)}px) rotate(${(item.rotate || 0) + (1 - reveal) * 18}deg) scale(${0.72 + reveal * 0.28})`,
  }} />);
}

function HorizontalStory({ data }) {
  const [ref, progress] = useScrollProgress();
  const stageRef = useRef(null);
  const [stageScale, setStageScale] = useState(1);
  const [introVisible, setIntroVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntroVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const measure = () => {
      if (!stageRef.current) return;
      setStageScale(Math.min(stageRef.current.clientWidth / 1920, stageRef.current.clientHeight / 1080));
    };
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    measure();
    return () => observer.disconnect();
  }, []);
  return (
    <section id={data.id} ref={ref} className="ftp-story-scroll" aria-label={typeof data.title === 'string' ? data.title : 'Environmental and Social Impact'}>
      <div ref={stageRef} className={`ftp-sticky-stage ftp-story-stage ${introVisible ? 'ftp-story-stage--visible' : ''}`}>
        <div className="ftp-story-viewport" style={{ transform: `translate(-50%, -50%) scale(${stageScale})` }}>
        <div className="ftp-story-track" style={{ transform: `translate3d(${-progress * 5760}px, 0, 0)` }}>
          <StoryBackground kind={data.id} />
          <div className="ftp-world-intro" style={worldPosition(80, 28, 1002, 737)}>
            <img src={data.portrait} alt="" />
            <h2>{data.title}</h2>
            <div className="ftp-copy-block" style={{ top: `${(data.introBodyTop / 737) * 100}%` }}>{data.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <img className="ftp-world-decoration" src={data.introDecoration.src} alt="" style={{ ...worldPosition(data.introDecoration.x, data.introDecoration.y, data.introDecoration.w, data.introDecoration.h), opacity: data.introDecoration.opacity }} />
          {data.extraDecoration && <img className="ftp-world-decoration" src={data.extraDecoration.src} alt="" style={{ ...worldPosition(data.extraDecoration.x, data.extraDecoration.y, data.extraDecoration.w, data.extraDecoration.h), transform: `rotate(${data.extraDecoration.rotate || 0}deg)` }} />}
          {data.stats.map((item, index) => {
            // Begin each card only once its entire Figma-sized box fits inside the viewport.
            const cardStarts = [0.07, 0.12, 0.18];
            const cardIn = ease(range(progress, cardStarts[index], cardStarts[index] + 0.047));
            return <article className="ftp-world-stat" key={item.number} style={{ ...worldPosition(item.x, item.y, 449, 168), opacity: cardIn, transform: `translateX(${(1 - cardIn) * 130}px)` }}><strong>{item.number}</strong><h3>{item.title}</h3><p>{item.body}</p></article>;
          })}
          <StoryCluster images={data.clusters[0]} progress={progress} start={0.23} end={0.48} />
          {data.stories.map((story) => <article className="ftp-world-story" key={story.x} style={worldPosition(story.x, story.y, story.w, story.h)}>
            <img src={story.image} alt="" style={{ left: `${(story.imageX / story.w) * 100}%`, top: `${(story.imageY / story.h) * 100}%`, width: `${(640 / story.w) * 100}%`, height: `${(360 / story.h) * 100}%` }} />
            <div style={{ left: `${(story.textX / story.w) * 100}%`, top: `${(story.textY / story.h) * 100}%`, width: `${((story.w - story.textX - 12) / story.w) * 100}%`, '--story-copy-width': `${story.textW}px` }}><h2>{story.title}</h2><div className="ftp-copy-block">{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
          </article>)}
          <StoryCluster images={data.clusters[1]} progress={progress} start={0.73} end={0.96} />
        </div>
        </div>
        <div className="ftp-story-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </section>
  );
}

function DesigningWithLess() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} className={`ftp-designing ${visible ? 'ftp-designing--visible' : ''}`} aria-labelledby="designing-title"><img src={designingBackground} alt="" /><div className="ftp-designing__copy"><h2 id="designing-title">DESIGNING WITH LESS</h2><p>더 적은 자원으로, 더 오래 사용할 수 있도록<br />딥티크는 제품의 소재와 패키지, 사용 이후의 과정까지 고려하며<br />창의성과 품질을 지킨 채 지속 가능한 방식을 만들어갑니다.</p></div></section>;
}

function RenewalReveal() {
  const [ref, progress] = useScrollProgress();
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Keep ALL Con6 geometry (including font sizes and whitespace) on the same
  // 1920 x 1080 Figma coordinate system, even on shorter desktop viewports.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setScale(Math.max(stage.clientWidth / 1920, stage.clientHeight / 1080));
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    measure();
    return () => observer.disconnect();
  }, []);

  const separate = ease(range(progress, 0.06, 0.36));
  // Finish moving the typography completely before the photo starts growing.
  const textOut = ease(range(progress, 0.40, 0.51));
  const expand = ease(range(progress, 0.54, 0.88));
  const imageIn = ease(range(progress, 0.23, 0.36));
  const finalIn = ease(range(progress, 0.90, 0.98));

  return (
    <section ref={ref} className="ftp-renewal-scroll" aria-label="What We Keep, What We Renew">
      <div ref={stageRef} className="ftp-sticky-stage ftp-renewal-stage">
        <div className="ftp-renewal-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <div className="ftp-renewal-intro" style={{ opacity: 1 - textOut }}>
            <p className="ftp-renewal-side ftp-renewal-side--left">For The<br />Planet</p>
            <h2 className="ftp-renewal-heading">
              {/* At Con6-2 the 49px gap opens between two 96px text lines. */}
              <span className="ftp-renewal-heading__top" style={{ transform: `translateY(${-7 * separate}px)` }}>What We Keep,</span>
              <span className="ftp-renewal-heading__bottom" style={{ transform: `translateY(${49 * separate}px)` }}>What We Renew.</span>
            </h2>
            <p className="ftp-renewal-side ftp-renewal-side--right">Eco-designing<br />our creations</p>
          </div>
          {/* Con6-2 crops the centre of the same image that fills Con6-3. */}
          <div className="ftp-renewal-image" style={{
            opacity: imageIn * (0.5 + 0.5 * expand),
            clipPath: `inset(${50 * (1 - expand)}% ${47.2917 * (1 - expand)}% ${45.463 * (1 - expand)}% ${47.3958 * (1 - expand)}%)`,
          }}>
            <img src={closingBackground} alt="딥티크의 지속 가능한 소재와 캔들" />
            <div className="ftp-renewal-image__shade" style={{ opacity: expand }} />
          </div>
          <div className="ftp-renewal-final" style={{ opacity: finalIn, transform: `translateY(${(1 - finalIn) * 28}px)` }}>
            <h2>What We Keep,<br />What We Renew</h2>
            <p>자연에서 받은 영감은 지키고,<br />환경에 남기는 흔적은 줄여갑니다.<br />딥디크는 더 오래 쓰고, 더 책임 있게 만들며,<br />다음 세대를 위한 새로운 방식을 계속 고민합니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ForThePlanet() {
  return <main className="for-the-planet"><h1 className="sr-only">For the Planet, 지속 가능한 미래를 위한 딥티크의 약속</h1><ArchScene variant="coast" first /><HorizontalStory data={ambition} /><DesigningWithLess /><ArchScene variant="forest" /><HorizontalStory data={impact} /><RenewalReveal /></main>;
}
