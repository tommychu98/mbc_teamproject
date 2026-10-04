import './HistoryScentMobile.css';

const u = px => `${px / 4.3}cqw`;

export default function HistoryScentSpaceMobile() {
  return <section className="history-scent-space-mobile" aria-labelledby="history-scent-space-mobile-title">
    <div className="history-scent-space-mobile__stage">
      <div className="history-scent-space-mobile__background" aria-hidden="true">
        <img src="/images/history/scent/mobile/7de45.png" alt="" />
      </div>
      <img className="history-scent-space-mobile__people" src="/images/history/scent/mobile/c6f90.png" alt="" />
      <article className="history-scent-space-mobile__copy">
        <h2 id="history-scent-space-mobile-title">FROM<br />SPACE<br />TO SKIN</h2>
        <p>캔들이 공간을 채웠다면,<br />퍼퓸은 개인의 주변을 채웠습니다.</p>
        <p>패턴과 오브제가 눈으로 볼 수<br />있는 세계를 만들었다면,<br />향은 그 세계에 보이지 않는<br />깊이와 분위기를 더했습니다.</p>
        <p>시간이 흐르며 향은<br />딥디크를 대표하는 가장 중요한<br />언어 중 하나가 되었습니다.</p>
      </article>
      <img className="history-scent-space-mobile__fireworks" src="/images/history/scent/mobile/3e5e0.png" alt="" aria-hidden="true" />
    </div>
  </section>;
}
