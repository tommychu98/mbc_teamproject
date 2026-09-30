import './HistoryMaison.css';

const ASSET_ROOT = '/images/history/maison';

function MaisonImage({ className, name }) {
  return (
    <div className={`history-maison__image ${className}`} aria-hidden="true">
      <img
        src={`${ASSET_ROOT}/${name}`}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function MaisonNestedImage({ className, innerClassName, name }) {
  return (
    <div className={`history-maison__image history-maison__nested ${className}`} aria-hidden="true">
      <div className={innerClassName}>
        <img
          src={`${ASSET_ROOT}/${name}`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

export default function HistoryMaison() {
  return (
    <section className="history-maison" aria-labelledby="history-maison-title">
      <div className="history-maison__main">
        <header className="history-maison__hero">
          <h2 id="history-maison-title">MAISON</h2>
          <p>
            One language, many forms.
            <br />
            What began as a pattern became a language.
          </p>
        </header>

        <article className="history-maison__story history-maison__story--one">
          <h3>
            WORD
            <br />
            &amp; IMAGE
          </h3>
          <div className="history-maison__story-body">
            <p>
              자유롭게 움직이는 글자와
              <br />
              섬세한 일러스트는 하나의
              <br />
              향과 함께 완성됩니다.
            </p>
            <p>
              텍스트와 이미지는 서로를
              <br />
              설명하기보다 하나의 분위기를
              <br />
              함께 만들어냅니다.
            </p>
          </div>
        </article>

        <article className="history-maison__story history-maison__story--two">
          <h3>THE MAISON TODAY</h3>
          <div className="history-maison__story-body">
            <p>
              오늘날 딥디크의 세계는
              <br />
              처음보다 훨씬 넓어졌습니다.
            </p>
            <p>
              하지만 자연과 예술, 여행과 발견
              <br />
              에서 영감을 얻는 태도는 여전히
              <br />
              그 중심에 남아 있습니다.
            </p>
          </div>
        </article>

        <MaisonImage className="history-maison__floating-01" name="floating-collage-image-01.png" />
        <MaisonImage className="history-maison__floating-02" name="floating-collage-image-01.png" />
        <MaisonImage className="history-maison__floating-03" name="floating-collage-image-03.png" />
        <MaisonNestedImage className="history-maison__floating-04" innerClassName="history-maison__floating-04-inner" name="floating-collage-image-03.png" />
        <MaisonNestedImage className="history-maison__floating-05" innerClassName="history-maison__floating-05-inner" name="floating-collage-image-05.png" />
        <MaisonNestedImage className="history-maison__floating-06" innerClassName="history-maison__floating-06-inner" name="floating-collage-image-06.png" />
        <MaisonImage className="history-maison__floating-07" name="floating-collage-image-07.png" />
        <MaisonNestedImage className="history-maison__floating-08" innerClassName="history-maison__floating-08-inner" name="floating-collage-image-08.png" />
        <MaisonImage className="history-maison__floating-09" name="floating-collage-image-09.png" />
        <MaisonImage className="history-maison__floating-10" name="floating-collage-image-06.png" />

        <MaisonImage className="history-maison__story-02-visual-01" name="story-02-visual-01.png" />
        <MaisonImage className="history-maison__story-02-visual-02 history-maison__cover" name="story-02-visual-02.png" />
        <MaisonNestedImage className="history-maison__story-02-visual-03" innerClassName="history-maison__story-02-visual-03-inner history-maison__cover" name="story-02-visual-03.png" />
        <MaisonNestedImage className="history-maison__story-02-visual-04" innerClassName="history-maison__story-02-visual-04-inner history-maison__cover" name="story-02-visual-04.png" />
        <MaisonImage className="history-maison__story-02-visual-05 history-maison__cover" name="story-02-visual-03.png" />
        <MaisonNestedImage className="history-maison__story-02-visual-06" innerClassName="history-maison__story-02-visual-06-inner history-maison__cover" name="story-02-visual-06.png" />
        <MaisonImage className="history-maison__story-02-visual-07 history-maison__cover" name="story-02-visual-07.png" />
        <MaisonImage className="history-maison__story-02-visual-08 history-maison__cover" name="story-02-visual-08.png" />
      </div>

      <div className="history-maison__outro">
        <article className="history-maison__story history-maison__story--three">
          <h3>
            FROM
            <br />
            PARIS,
            <br />
            OUTWARD
          </h3>
          <div className="history-maison__story-body">
            <p>
              파리의 작은 공간에서 시작된 감각은
              <br />
              시간이 흐르며 더 넓은 세계로 이어졌습니다.
            </p>
            <p>
              딥디크의 역사는 완성된
              <br />
              이야기가 아니라 계속
              <br />
              만들어지는 과정에 가깝습니다.
            </p>
            <p>
              처음의 시선은 남아 있고,
              <br />
              그것을 표현하는 형태만
              <br />
              계속 새로워지고 있습니다.
            </p>
          </div>
        </article>

        <MaisonImage className="history-maison__story-03-background" name="story-03-background.png" />
        <div className="history-maison__story-03-foreground" aria-hidden="true" />
        <MaisonImage className="history-maison__story-03-feature history-maison__cover" name="story-03-feature-visual.png" />
        <MaisonImage className="history-maison__story-03-accent-02 history-maison__cover" name="story-03-small-accent-02.png" />
        <MaisonImage className="history-maison__story-03-visual-01 history-maison__cover" name="story-03-visual-01.png" />
        <MaisonNestedImage className="history-maison__story-03-visual-02" innerClassName="history-maison__story-03-visual-02-inner history-maison__cover" name="story-03-visual-02.png" />
        <MaisonNestedImage className="history-maison__story-03-visual-03" innerClassName="history-maison__story-03-visual-03-inner history-maison__cover" name="story-03-visual-03.png" />
        <MaisonImage className="history-maison__story-03-visual-04 history-maison__cover" name="story-03-visual-03.png" />
        <MaisonImage className="history-maison__story-03-accent-01 history-maison__cover" name="story-03-small-accent-01.png" />
      </div>
    </section>
  );
}
