import './HistoryMaisonMobile.css';

const pieces = [
  ['dce24', 'one'],
  ['18393', 'two'],
  ['95dea', 'three'],
  ['07bbd', 'four'],
  ['11ddc', 'five'],
];

export default function HistoryMaisonMobile() {
  return <section className="history-maison-mobile" aria-labelledby="history-maison-mobile-title">
    <div className="history-maison-mobile__stage">
      <article className="history-maison-mobile__copy">
        <h2 id="history-maison-mobile-title">MAISON</h2>
        <span aria-hidden="true" />
        <p>One language, many forms.<br />What began as a pattern became a language.</p>
      </article>
      <div className="history-maison-mobile__collage" aria-hidden="true">
        {pieces.map(([name, slot]) => <div key={name} className={`history-maison-mobile__piece history-maison-mobile__piece--${slot}`}>
          <img src={`/images/history/maison/mobile-${name}.png`} alt="" />
        </div>)}
      </div>
    </div>
  </section>;
}
