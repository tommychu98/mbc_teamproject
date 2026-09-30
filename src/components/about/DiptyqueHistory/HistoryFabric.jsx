import './HistoryFabric.css';

const asset = (name) => `/images/history/fabric/${name}`;

function ImageAsset({ className, name }) {
  return (
    <div className={className} aria-hidden="true">
      <img src={asset(name)} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

export default function HistoryFabric() {
  return (
    <section className="history-fabric" aria-labelledby="history-fabric-title">
      <img
        className="history-fabric__background"
        src={asset('history-fabric-background.png')}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <header className="history-fabric__hero">
        <h2 id="history-fabric-title">FABRIC</h2>
        <p>
          It began with a pattern.
          <br />
          Before scent, there was texture.
        </p>
      </header>

      <ImageAsset
        className="history-fabric__asset history-fabric__floating-object-01"
        name="floating-decorative-object-01.png"
      />

      <div className="history-fabric__story-canvas">
        <ImageAsset
          className="history-fabric__canvas-centered history-fabric__canvas-fabric-01"
          name="story-decorative-fabric-01.png"
        />
        <ImageAsset
          className="history-fabric__canvas-centered history-fabric__canvas-fabric-02"
          name="story-decorative-fabric-01.png"
        />
        <ImageAsset
          className="history-fabric__canvas-asset history-fabric__pattern-top"
          name="story-pattern-layer-top.png"
        />
        <ImageAsset
          className="history-fabric__canvas-asset history-fabric__pattern-bottom"
          name="story-pattern-layer-top.png"
        />
        <ImageAsset
          className="history-fabric__canvas-asset history-fabric__canvas-detail-01"
          name="story-decorative-detail-01.png"
        />
        <ImageAsset
          className="history-fabric__canvas-centered history-fabric__canvas-collage-01"
          name="story-decorative-collage-01.png"
        />
        <ImageAsset
          className="history-fabric__canvas-asset history-fabric__founders-visual"
          name="story-founders-visual.png"
        />
        <ImageAsset
          className="history-fabric__canvas-asset history-fabric__bottom-collage"
          name="story-bottom-collage.png"
        />

        <article className="history-fabric__story history-fabric__story--one">
          <h3>
            A Language
            <br />
            Born from
            <br />
            Fabric
          </h3>
          <div className="history-fabric__story-copy">
            <p>
              딥디크의 첫 번째 언어는 향이 아니라
              <br />
              패턴과 직물이었습니다.
              <br />
              형태와 색, 반복되는 리듬 속에서
              <br />
              브랜드의 감각이 처음 모습을 드러냈습니다.
            </p>
            <p>
              서로 다른 예술적 배경을 가진 세 창립자는
              <br />
              하나의 공간에서 감각을 공유했습니다.
              <br />
              각자의 시선은 패브릭과 드로잉을 통해
              <br />
              하나의 새로운 세계로 연결되었습니다.
            </p>
          </div>
        </article>

        <article className="history-fabric__story history-fabric__story--two">
          <h3>
            Three Visions
            <br />
            One World
          </h3>
          <div className="history-fabric__story-copy">
            <p>
              세 사람은 같은 것을 보면서도 서로
              <br />
              다른 방식으로 해석했습니다.
              <br />
              그 차이는 오히려 딥디크만의 독특한 균형과
              <br />
              리듬을 만들어냈습니다.
            </p>
            <p>
              패브릭 위에는 자연과 기하학,
              <br />
              여행에서 얻은 인상들이 함께 등장했습니다.
              <br />
              작은 표면 안에 이미 딥디크가 바라보는
              <br />
              넓은 세계가 담겨 있었습니다.
            </p>
          </div>
        </article>

        <ImageAsset
          className="history-fabric__canvas-asset history-fabric__canvas-detail-02"
          name="story-decorative-detail-02.png"
        />
        <ImageAsset
          className="history-fabric__object-accent"
          name="story-object-accent.png"
        />
      </div>

      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-object-02"
        name="floating-decorative-object-02.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-fabric-01"
        name="floating-decorative-fabric-01.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-object-03"
        name="floating-decorative-object-03.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-object-05"
        name="floating-decorative-object-05.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-object-06"
        name="floating-decorative-object-06.png"
      />
      <ImageAsset
        className="history-fabric__asset history-fabric__floating-object-07"
        name="floating-decorative-object-07.png"
      />
      <ImageAsset
        className="history-fabric__asset history-fabric__floating-accent-01"
        name="floating-small-accent-01.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-object-08"
        name="floating-decorative-object-08.png"
      />
      <ImageAsset
        className="history-fabric__asset history-fabric__floating-botanical-01"
        name="floating-botanical-01.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-collage-01"
        name="floating-fabric-collage-01.png"
      />
      <ImageAsset
        className="history-fabric__asset history-fabric__floating-collage-02"
        name="floating-fabric-collage-02.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-accent-02"
        name="floating-small-accent-02.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-accent-03"
        name="floating-small-accent-03.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__pick-up-fabric"
        name="fabric-pick-up.png"
      />
      <ImageAsset
        className="history-fabric__centered-asset history-fabric__floating-object-04"
        name="floating-decorative-object-04.png"
      />
    </section>
  );
}
