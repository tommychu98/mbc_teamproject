import { Decorations } from './MobileAmbition';
import MobileStorySlider from './MobileStorySlider';
import foliage from './assets/mobile/5f6dc.png';
import leaf31 from './assets/mobile/a58c3.png';
import leaf34 from './assets/mobile/da159.png';
import leaf37 from './assets/mobile/f51db.png';
import leaf63 from './assets/mobile/ef7b5.png';
import './mobile-impact.css';

const asset = name => `/ForThePlanet/${name}.png`;
const position = (x, y, w, h) => ({ left: `${x / 4.3}%`, top: `${y / 4.3}cqw`, width: `${w / 4.3}%`, height: `${h / 4.3}cqw` });
const commonDecor = [
  [asset('95dd9'), 23.33, 250.56, 28.756, 54.387, 28.83],
  [asset('09970'), 366.91, 486.32, 52.781, 34.115, -125.96],
  [asset('4b050'), 349, 180, 41, 36],
  [asset('4cd74'), 15.9, 537.64, 53.061, 55.904, 69.66, -1],
  [asset('aa36e'), 154.91, 55.69, 52, 47, -20.74],
];
const introDecor = [
  [asset('fbca1'), 0, 611, 354.535, 324, 0, 1, .2], ...commonDecor,
  [asset('09970'), 311.55, 579.12, 37.282, 24.097, -147.58],
];
const cardsDecor = [
  [foliage, 271, 203, 305, 305, 0, 1, .2], ...commonDecor,
  [asset('95dd9'), 90.33, 78.56, 28.756, 54.387, 151.17, -1],
  [asset('09970'), 311.55, 579.12, 37.282, 24.097, -147.58],
  [asset('9ea37'), 324.15, 845.31, 25.848, 18.203, 136.59],
  [asset('1cc56'), 66.87, 830.3, 21.893, 17.104, 177.45, -1],
];
const originDecor = [
  [foliage, -150, 208, 300, 300, 0, 1, .2],
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
const communityDecor = [
  [foliage, 248, 208, 228, 228, 0, 1, .2], ...commonDecor,
  [asset('e2d7e'), 341, 691, 19, 20],
  [leaf31, 305, 856, 30, 31, 0, -1],
  [leaf34, 72.46, 606.66, 22, 17, -23.29],
  [leaf37, 279.2, 524.88, 23.864, 18.143, -123.28, -1],
  [leaf63, 368, 860, 18, 19, 180, -1],
];
const cardCopy = [
  <>지속 가능한 공급망 유지를 위해 지보단 재단과<br />10년간 협력해왔습니다.</>,
  <>2014년부터 딥티크의 지원으로<br />모헬리 섬에 5만 그루 이상의 나무를 심었습니다.</>,
  <>아이티 여성 100명 이상이 퇴비 만들기, 식물 관리와 보호,<br />수확물 일부의 판매·마케팅 교육을 받았습니다.</>,
];

export default function MobileImpact({ data }) {
  return <MobileStorySlider className="ftp-mobile-impact" label="Our Environmental and Social Impact, 아래로 스크롤하여 다음 내용 보기">
    <article className="ftp-mobile-ambition__panel ftp-mobile-ambition__intro">
      <Decorations items={introDecor} />
      <div className="ftp-mobile-ambition__intro-content">
        <img className="ftp-mobile-ambition__portrait" src={data.portrait} alt="자연 소재와 딥티크 제품" />
        <h2>{data.title}</h2>
        <div className="ftp-mobile-ambition__copy">
          <p>딥티크는 지구의 생태계를 보호해야 할 책임을 중요하게 생각하며, 사회와 환경에 미치는 영향을 줄이기 위한 다양한 방안을 지속적으로 모색하고<br />있습니다.</p>
          <p>특히 공급업체와의 협력에서 투명성을 중요한<br />기준으로 삼아 탄소 배출을 줄이고 생물다양성을<br />보호하기 위해 노력합니다. 이를 통해 사회와<br />환경에 미치는 영향을 최소화하고,<br />보다 지속가능한 방식으로 발전해 나가는 것을<br />목표로 하고 있습니다.</p>
        </div>
      </div>
    </article>
    <article className="ftp-mobile-ambition__panel ftp-mobile-impact__milestones" aria-label="환경과 지역사회를 위한 성과">
      <Decorations items={cardsDecor} />
      <div className="ftp-mobile-ambition__cards">{data.stats.map((item, index) =>
        <div className="ftp-mobile-ambition__card" key={item.number}>
          <h3>{item.number}</h3><p className="ftp-mobile-ambition__card-title">{item.title}</p><p>{cardCopy[index]}</p>
        </div>)}</div>
      <div className="ftp-mobile-ambition__collage ftp-mobile-impact__harvest" aria-hidden="true">
        <img src={asset('2786b')} alt="" style={{ ...position(44.41, 15.41, 222.505, 222.505), transform: 'rotate(8.62deg)' }} />
        <img src={asset('cd92d')} alt="" style={{ ...position(237.5, 57.69, 170.238, 170.239), transform: 'rotate(-12.38deg)' }} />
        <img src={asset('97c36')} alt="" style={position(163.28, 186.85, 104.196, 130.246)} />
      </div>
    </article>
    <article className="ftp-mobile-ambition__panel ftp-mobile-impact__origin">
      <Decorations items={originDecor} />
      <div className="ftp-mobile-ambition__story">
        <img className="ftp-mobile-ambition__story-image" src={data.stories[0].image} alt="나무와 천연 원료를 함께 배치한 딥티크 캔들" />
        <h2>{data.stories[0].title}</h2>
        <div className="ftp-mobile-ambition__copy">
          <p>딥티크는 투명성을 중요한 가치로 여기며, 제품의 구성 성분과 원료의 원산지,<br />공급업체 정보를 고객에게 제공합니다.</p>
          <p>보다 정확한 추적을 위해 블록체인 기반<br />플랫폼을 도입해 주요 원료의 상세 정보를 확인할 수 있도록 하고 있으며, 앞으로는<br />제품 패키지의 QR 코드를 통해 더욱 쉽게 확인할 수 있습니다.</p>
          <p>향수 원액부터 향수, 화장품, 홈 제품에<br />사용되는 주요 성분까지 투명하게 공개하고 있습니다.</p>
        </div>
      </div>
    </article>
    <article className="ftp-mobile-ambition__panel ftp-mobile-impact__community">
      <Decorations items={communityDecor} />
      <div className="ftp-mobile-ambition__story">
        <img className="ftp-mobile-ambition__story-image" src={data.stories[1].image} alt="원료를 수확하는 지역 주민과 자연 풍경" />
        <h2>{data.stories[1].title}</h2>
        <div className="ftp-mobile-ambition__copy">
          <p>천연 원료 조달의 투명성을 높이기 위해<br />공급업체의 모범 사례를 공유하고 지원합니다.<br />또한 오랜 파트너십을 통해 지역 사회의 자립과<br />지속 가능한 발전을 함께 만들어가고 있습니다.</p>
          <p>삼림 벌채와 농업 확장으로 어려움을 겪는<br />지역에서는 생태계 회복을 위한 다양한 활동을<br />이어갑니다.<br />과일나무 재배, 친환경 스토브 설치, 훼손된<br />토지 복원과 나무 심기 등을 통해 자연을<br />보호하고 지역 주민들에게 새로운 기회를<br />제공하고 있습니다.</p>
        </div>
      </div>
      <div className="ftp-mobile-ambition__collage ftp-mobile-impact__products" aria-hidden="true">
        <img src={asset('f86d1')} alt="" style={position(142, 0, 139.002, 139.002)} />
        <div className="ftp-mobile-ambition__crop ftp-mobile-impact__product-crop" style={position(142, 79.58, 248.563, 142.258)}><img src={asset('16a3b')} alt="" /></div>
        <img src={asset('cadcc')} alt="" style={position(286.51, 27.42, 123.488, 123.488)} />
      </div>
    </article>
  </MobileStorySlider>;
}
