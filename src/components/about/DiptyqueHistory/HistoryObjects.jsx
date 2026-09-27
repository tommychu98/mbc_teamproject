import './HistoryObjects.css';

const asset = (name) => `/images/history/objects/${name}`;

function ImageAsset({ className, name }) {
  return (
    <div className={className} aria-hidden="true">
      <img src={asset(name)} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

export default function HistoryObjects() {
  return (
    <section className="history-objects" aria-labelledby="history-objects-title">
      <header className="history-objects__hero">
        <h2 id="history-objects-title">OBJECTS</h2>
        <p>
          The shop became a world.
          <br />
          A collection became a language.
        </p>
      </header>

      <ImageAsset
        className="history-objects__asset history-objects__background-main"
        name="objects-background-main.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__background-lower"
        name="objects-background-lower.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__figure-visual"
        name="story-02-figure-visual.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__outro-background"
        name="objects-outro-background.png"
      />
      <div className="history-objects__copy-backplate" aria-hidden="true" />
      <ImageAsset
        className="history-objects__asset history-objects__story-02-decorative"
        name="story-02-decorative-visual.png"
      />

      <article className="history-objects__story history-objects__story--two">
        <h3>A SENSE OF DISCOVERY</h3>
        <div className="history-objects__story-body">
          <div>
            <p>
              무엇을 발견하게 될지 알 수 없는
              <br />
              경험 자체가 부티크의 매력이었습니다.
            </p>
            <p>
              딥디크는 물건을 판매하기보다 새로운
              <br />
              감각과 취향을 제안하기 시작했습니다.
            </p>
          </div>
          <p>
            아름답다고 느끼는 것이라면
            <br />
            무엇이든 딥디크의 세계 안으로
            <br />
            들어올 수 있었습니다.
          </p>
        </div>
      </article>

      <ImageAsset
        className="history-objects__asset history-objects__walking-figure"
        name="objects-walking-figure.png"
      />

      <div className="history-objects__mid-background" aria-hidden="true" />
      <ImageAsset
        className="history-objects__asset history-objects__wide-collage"
        name="story-01-wide-collage.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__feature-collage"
        name="objects-outro-feature-collage.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__decorative-object-02"
        name="floating-decorative-object-02.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-01"
        name="objects-shelf-object-01.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-02"
        name="objects-shelf-object-02.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__tall-object-01"
        name="objects-tall-object-01.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-background-01"
        name="objects-shelf-background-01.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-background-02"
        name="objects-shelf-background-02.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-03"
        name="objects-shelf-object-03.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-04"
        name="objects-shelf-object-04.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-05"
        name="objects-shelf-object-05.png"
      />
      <ImageAsset
        className="history-objects__centered-asset history-objects__shelf-object-06"
        name="objects-shelf-object-06.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-background-03"
        name="objects-shelf-background-03.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-08"
        name="objects-shelf-object-08.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-09"
        name="objects-shelf-object-09.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-10"
        name="objects-shelf-object-10.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-11"
        name="objects-shelf-object-11.png"
      />

      <div className="history-objects__collected-strip" aria-hidden="true">
        <img
          src={asset('story-01-collected-object-01.png')}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          src={asset('story-01-collected-object-02.png')}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          src={asset('story-01-collected-object-03.png')}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          src={asset('story-01-collected-object-04.png')}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <ImageAsset
        className="history-objects__asset history-objects__outro-decorative-object"
        name="objects-outro-decorative-object-01.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__framed-image-05"
        name="floating-framed-image-05.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__framed-image-01"
        name="floating-framed-image-01.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__framed-image-02"
        name="floating-framed-image-02.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__framed-image-03"
        name="floating-framed-image-03.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__framed-image-04"
        name="floating-framed-image-04.png"
      />

      <ImageAsset
        className="history-objects__asset history-objects__story-01-feature"
        name="story-01-feature-visual.png"
      />
      <h3 className="history-objects__story-01-title">
        FOUND
        <br />
        ELSEWHERE
      </h3>
      <div className="history-objects__story-01-body">
        <div>
          <p>
            생제르맹의 부티크는 점차 다양한
            <br />
            오브제들로 채워졌습니다.
          </p>
          <p>
            여행에서 발견한 물건들은 단순한
            <br />
            기념품으로 남지 않았습니다.
            <br />
            딥디크의 시선을 거치며 새로운
            <br />
            맥락과 의미를 가진 오브제로
            <br />
            다시 소개되었습니다.
          </p>
        </div>
        <p>
          보고, 만지고, 머무르며
          <br />
          새로운 취향을 발견하는 하나의
          <br />
          작은 세계에 가까웠습니다.
        </p>
      </div>

      <ImageAsset
        className="history-objects__asset history-objects__small-accent-02"
        name="floating-small-accent-02.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__detail-visual-01"
        name="objects-detail-visual-01.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__small-accent-01"
        name="floating-small-accent-01.png"
      />
      <ImageAsset
        className="history-objects__centered-asset history-objects__detail-visual-02"
        name="objects-detail-visual-02.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__detail-visual-03"
        name="objects-detail-visual-03.png"
      />
      <ImageAsset
        className="history-objects__asset history-objects__shelf-object-07"
        name="objects-shelf-object-07.png"
      />
    </section>
  );
}
