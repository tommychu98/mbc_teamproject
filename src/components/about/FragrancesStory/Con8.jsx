import background from './assets/con2-background.png';
import jazzNight from './assets/con8-jazz-night.png';
import essence from './assets/con8-essence.png';
import nightEcho from './assets/con8-night-echo.png';
import instrument from './assets/con8-instrument.png';
import './Con8.css';

const cards = [
  {
    number: 'I',
    title: 'JAZZ NIGHT',
    image: jazzNight,
    alt: '재즈 클럽 입구의 악기와 칵테일 테이블',
    lines: ['파리의 어느 재즈 클럽', '음악과 사람들 사이', '무르익는 밤'],
  },
  {
    number: 'II',
    title: 'THE ESSENCE',
    image: essence,
    alt: '주니퍼 열매와 시더 우드, 통카빈',
    lines: ['주니퍼와 시더, 통카가', '깊고 풍성하게 어우러진', '우디 향의 조화'],
  },
  {
    number: 'III',
    title: 'NIGHT ECHO',
    image: nightEcho,
    alt: '술잔과 오르페옹 카드가 놓인 나무 테이블',
    lines: ['음악이 멎은 자리', '고요 속에 오래 남은', '밤의 잔향'],
  },
];

export default function Con8() {
  return (
    <section className="fragrances-con8" aria-labelledby="fragrances-con8-title">
      <div className="fragrances-con8__scene">
        <img className="fragrances-con8__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <h2 className="fragrances-con8__title" id="fragrances-con8-title">A MEMORY OF PARIS AFTER DARK</h2>
        <div className="fragrances-con8__cards">
          {cards.map(({ number, title, image, alt, lines }) => (
            <article className="fragrances-con8__card" key={number}>
              <img className="fragrances-con8__card-image" src={image} alt={alt} width="340" height="360" draggable="false" />
              <div className="fragrances-con8__card-content">
                <h3 className="fragrances-con8__card-heading">
                  <span>{number}</span>
                  <span>{title}</span>
                </h3>
                <p className="fragrances-con8__card-description">
                  {lines.map((line) => <span key={line}>{line}</span>)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="fragrances-con8__instrument" aria-hidden="true">
          <img className="fragrances-con8__instrument-image" src={instrument} alt="" width="683.474" height="455.649" draggable="false" />
        </div>
      </div>
    </section>
  );
}
