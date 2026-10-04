import { useRef } from 'react';
import useScentLighting from './useScentLighting';
import './HistoryScent.css';

const ASSET_ROOT = '/images/history/scent';

function ScentAsset({ className, name }) {
  return (
    <div className={`history-scent__asset ${className}`} aria-hidden="true">
      <img
        src={`${ASSET_ROOT}/${name}`}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function HistoryScent() {
  const scrollRef = useRef(null);
  const sceneRef = useRef(null);
  useScentLighting(scrollRef, sceneRef);

  return (
    <div ref={scrollRef} className="history-scent-scroll">
      <div className="history-scent-viewport">
    <section ref={sceneRef} className="history-scent" aria-labelledby="history-scent-title">
      <ScentAsset
        className="history-scent__background-long"
        name="background-long-composite.png"
      />
      <ScentAsset
        className="history-scent__background-hero"
        name="background-hero-scene.png"
      />
      <ScentAsset
        className="history-scent__background-candle"
        name="background-candle-scene.png"
      />

      <ScentAsset
        className="history-scent__decorative-visual-01"
        name="story-01-decorative-visual-01.png"
      />
      <ScentAsset
        className="history-scent__atmosphere-visual"
        name="story-01-atmosphere-visual.png"
      />
      <ScentAsset
        className="history-scent__decorative-object-01"
        name="story-01-decorative-object-01.png"
      />
      <ScentAsset
        className="history-scent__decorative-object-02"
        name="story-01-decorative-object-02.png"
      />

      <ScentAsset
        className="history-scent__story-02-feature"
        name="story-02-feature-visual.png"
      />
      <ScentAsset
        className="history-scent__fireworks"
        name="scent-transition-fireworks.png"
      />

      <ScentAsset
        className="history-scent__decorative-object-03"
        name="story-01-decorative-object-03.png"
      />
      <ScentAsset
        className="history-scent__feature-collage"
        name="story-01-feature-collage.png"
      />
      <div className="history-scent__asset history-scent__candle-object" aria-hidden="true">
        <img src={`${ASSET_ROOT}/story-01-candle-object-02.png`} alt="" loading="eager" decoding="async" />
        <span className="history-scent__flame"><span /></span>
      </div>

      <article className="history-scent__story history-scent__story--one">
        <h3>THE CANDLE</h3>
        <div className="history-scent__story-body">
          <p>
            1963년, 첫 향초는 딥디크의 세계에
            <br />
            새로운 감각을 더했습니다.
          </p>
          <p>
            향이 더해지면서 딥디크의 세계는
            <br />
            시각과 촉각을 넘어
            <br />
            후각으로 확장되었습니다.
          </p>
          <p>
            불을 밝히는 순간,
            <br />
            형태를 넘어 공간 전체의 분위기를
            <br />
            변화시키기 시작했습니다.
          </p>
        </div>
      </article>

      <article className="history-scent__story history-scent__story--two">
        <h3>
          FROM SPACE
          <br />
          TO SKIN
        </h3>
        <div className="history-scent__story-body">
          <p>
            캔들이 공간을 채웠다면,
            <br />
            퍼퓸은 개인의 주변을 채웠습니다.
          </p>
          <p>
            패턴과 오브제가 눈으로 볼 수 있는
            <br />
            세계를 만들었다면,
            <br />
            향은 그 세계에 보이지 않는
            <br />
            깊이와 분위기를 더했습니다.
          </p>
          <p>
            시간이 흐르며 향은
            <br />
            딥디크를 대표하는 가장 중요한
            <br />
            언어 중 하나가 되었습니다.
          </p>
        </div>
      </article>

      <header className="history-scent__hero">
        <h2 id="history-scent-title">SCENT</h2>
        <p>
          Then, scent changed everything.
          <br />
          The invisible became a new material.
        </p>
      </header>
        <div className="history-scent-lighting" aria-hidden="true">
          <div className="history-scent-lighting__shade" />
          <div className="history-scent-lighting__glow" />
          <div className="history-scent-lighting__haze" />
          <div className="history-scent-lighting__vignette" />
        </div>
    </section>
      </div>
    </div>
  );
}
