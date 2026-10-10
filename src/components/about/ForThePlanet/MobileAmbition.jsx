import fern from './assets/mobile/e641d.png';
import MobileStorySlider from './MobileStorySlider';
import foliage from './assets/mobile/5f6dc.png';
import leaf34 from './assets/mobile/da159.png';
import leaf37 from './assets/mobile/f51db.png';
import leaf63 from './assets/mobile/ef7b5.png';
import leaf31 from './assets/mobile/a58c3.png';
import './mobile-ambition.css';

const asset = (name) => `/ForThePlanet/${name}.png`;
const fixedBackgrounds = new Set([fern, foliage, asset('ea8c4'), asset('fbca1')]);
const position = (x, y, w, h) => ({ left: `${x / 4.3}%`, top: `${y / 4.3}cqw`, width: `${w / 4.3}%`, height: `${h / 4.3}cqw` });

// Coordinates describe the original image, centred inside its rotated bounds.
export function Decorations({ items }) {
  return <div className="ftp-mobile-ambition__decorations" aria-hidden="true">
    {items.map(([src, x, y, w, h, rotate = 0, flip = 1, opacity = .3], index) =>
      <img key={index} src={src} alt=""
        className={fixedBackgrounds.has(src) ? 'ftp-mobile-decoration--fixed' : 'ftp-mobile-decoration--falling'}
        style={{
          ...position(x, y, w, h), opacity,
          transform: `rotate(${rotate}deg) scaleY(${flip})`,
          "--drift-opacity": opacity,
          "--drift-duration": `${10.7 + (index % 5) * 3}s`,
          "--drift-delay": `${-index * 3.7}s`,
          "--drift-sway": `${(index % 2 ? -1 : 1) * (8 + (index % 4) * 3)}px`,
        }} />)}
  </div>;
}

const introDecor = [
  [fern, 0, 610, 355, 324, 0, 1, .2],
  [asset('95dd9'), 23.33, 250.56, 28.756, 54.387, 28.83],
  [asset('09970'), 366.91, 486.32, 52.781, 34.115, -125.96],
  [asset('4b050'), 349, 180, 41, 36],
  [asset('4cd74'), 15.9, 537.64, 53.061, 55.904, 69.66, -1],
  [asset('aa36e'), 154.91, 55.69, 52, 47, -20.74],
];
const cardsDecor = [
  [asset('95dd9'), 90.33, 78.56, 28.756, 54.387, 151.17, -1],
  [asset('9ea37'), 324.15, 845.31, 25.848, 18.203, 136.59],
  [asset('1cc56'), 66.87, 830.3, 21.893, 17.104, 177.45, -1],
  [asset('09970'), 311.05, 585, 37.282, 24.097, -147.58],
];
const balanceDecor = [
  [asset('95dd9'), 39.33, 255.56, 28.756, 54.387, 28.83],
  [asset('09970'), 338.91, 438.32, 52.781, 34.115, -125.96],
  [asset('4b050'), 295, 173, 41, 36],
  [asset('98e2c'), 257.12, 627.31, 40, 45, 33.66],
  [asset('aa36e'), 69.64, 360.69, 52, 47, -20.74],
  [asset('4cd74'), 26.9, 556.64, 53.061, 55.904, 69.66, -1],
  [asset('4b050'), 277, 292, 41, 36],
  [leaf31, 348, 726, 30, 31],
  [asset('95dd9'), 53.46, 783.73, 21.474, 40.614, 28.83],
  [asset('aa36e'), 211.64, 507.69, 52, 47, -20.74],
  [asset('9ea37'), 288.72, 850.39, 25.848, 18.203, 43.41, -1],
  [asset('1cc56'), 212.37, 772.48, 21.893, 17.104, 177.45, -1],
];
const designDecor = [
  [foliage, 248, 37, 228, 228, 0, 1, .2],
  [leaf34, 72.46, 606.66, 22, 17, -23.29],
  [leaf37, 279.2, 524.88, 23.864, 18.143, -123.28, -1],
  [leaf63, 368, 860, 18, 19, 180, -1],
];

export default function MobileAmbition({ data }) {
  return <MobileStorySlider label="Our ambition, 아래로 스크롤하여 다음 내용 보기">
    <article className="ftp-mobile-ambition__panel ftp-mobile-ambition__intro">
      <Decorations items={introDecor} />
      <div className="ftp-mobile-ambition__intro-content">
        <img className="ftp-mobile-ambition__portrait" src={data.portrait} alt="자연의 소재와 함께 놓인 딥티크 향수" />
        <h2>{data.title}</h2>
        <div className="ftp-mobile-ambition__copy">{data.intro.map(text => <p key={text}>{text}</p>)}</div>
      </div>
    </article>
    <article className="ftp-mobile-ambition__panel ftp-mobile-ambition__milestones" aria-label="지속가능성을 위한 목표">
      <Decorations items={cardsDecor} />
      <div className="ftp-mobile-ambition__cards">{data.stats.map((item, index) =>
        <div className="ftp-mobile-ambition__card" key={item.number}>
          <h3>{item.number}</h3><p className="ftp-mobile-ambition__card-title">{item.title}</p>
          <p>{index === 0 ? <>지속 가능한 공급망 유지를 위해 지보단 재단과<br />10년간 협력해왔습니다.</> : item.body}</p>
        </div>)}</div>
      <div className="ftp-mobile-ambition__collage ftp-mobile-ambition__collage--products" aria-hidden="true">
        <img src={asset('c4a07')} alt="" style={position(29, 169.65, 237.09, 133.561)} />
        <img src={asset('58a08')} alt="" style={{ ...position(205.93, 99.03, 218.072, 218.072), opacity: .86 }} />
        <div className="ftp-mobile-ambition__crop ftp-mobile-ambition__crop--candle" style={position(134.21, 0, 180.99, 162.323)}><img src={asset('61e53')} alt="" /></div>
      </div>
    </article>
    <article className="ftp-mobile-ambition__panel ftp-mobile-ambition__balance">
      <Decorations items={balanceDecor} />
      <div className="ftp-mobile-ambition__story">
        <img className="ftp-mobile-ambition__story-image" src={data.stories[0].image} alt="수련이 떠 있는 연못 풍경" />
        <h2>Striking a sustainable balance</h2>
        <div className="ftp-mobile-ambition__copy"><p>딥티크에게 자연은 소중한 자원이자 영감의 원천입니다.<br />우리는 환경에 미치는 영향을 더 깊이<br />이해하고 줄이기 위해 배출량을 측정하며, 지속 가능한 미래를 위한 실질적인 감축 계획을 이어가고 있습니다.</p></div>
      </div>
      <div className="ftp-mobile-ambition__collage ftp-mobile-ambition__collage--balance" aria-hidden="true">
        <img src={asset('5e0fa')} alt="" style={position(145.78, 122.12, 191.876, 191.876)} />
        <img src={asset('d8288')} alt="" style={{ ...position(198.14, 0, 216.289, 216.289), opacity: .8 }} />
        <div className="ftp-mobile-ambition__crop ftp-mobile-ambition__crop--painting" style={position(49, 49.13, 177.016, 205.556)}><img src={asset('2736c')} alt="" /></div>
      </div>
    </article>
    <article className="ftp-mobile-ambition__panel ftp-mobile-ambition__design">
      <Decorations items={designDecor} />
      <div className="ftp-mobile-ambition__story">
        <img className="ftp-mobile-ambition__story-image" src={data.stories[1].image} alt="딥티크의 제품과 친환경 포장 소재" />
        <h2>{data.stories[1].title}</h2>
        <div className="ftp-mobile-ambition__copy">
          <p>딥티크는 환경에 미치는 영향을 줄이면서도 브랜드가<br />지닌 창의성과 품질을 유지하기 위해 운영과 생산<br />방식을 지속적으로 개선하고 있습니다.<br />제품을 만드는 전 과정에서 보다 책임 있는 선택을<br />고민하며, 환경 부담을 줄일 수 있는 방향을<br />모색하고 있습니다.</p>
          <p>또한 딥티크는 오랫동안 높은 품질의 제품을 만드는<br />것을 중요하게 여겨왔습니다.<br />이러한 기준을 유지하면서도 자원의 사용과 생산 과정 전반을 세심하게 살피고, 보다 지속가능한 방식으로 제품을 개발하기 위한 노력을 이어가고 있습니다.</p>
        </div>
      </div>
    </article>
  </MobileStorySlider>;
}
