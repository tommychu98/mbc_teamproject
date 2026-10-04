import './HistoryObjectsMobile.css';
import HistoryObjectsMobileStory from './HistoryObjectsMobileStory';

const asset = (name) => `/images/history/objects/mobile/${name}`;
const unit = (px) => `${px / 4.3}cqw`;
const layers = [
  ['60c51.png', -153.0025, -45, 736.205, 1308.809],
  ['60c51.png', -153.0025, 0, 736.205, 1308.809],
  ['ab7a3.png', -176, 341, 373, 279],
  ['64446.png', 165, 642, 372, 279],
  ['e0759.png', 292, 181, 349, 349],
];

export default function HistoryObjectsMobile() {
  return <div className="history-objects-mobile-flow"><section className="history-objects-mobile" data-history-mobile-page aria-labelledby="history-objects-mobile-title">
    <div className="history-objects-mobile__stage">
      {layers.slice(2).map(([name, x, y, w, h], index) =>
        <img key={index} className="history-objects-mobile__image" src={asset(name)} alt="" aria-hidden="true"
          style={{ left: unit(x), top: unit(y - 52), width: unit(w), height: unit(h) }} />)}
      <div className="history-objects-mobile__copy">
        <h2 id="history-objects-mobile-title">OBJECTS</h2>
        <img className="history-objects-mobile__divider" src={asset('39d90.svg')} alt="" />
        <p>The shop became a world.<br />A collection became a language,</p>
      </div>
    </div>
  </section><HistoryObjectsMobileStory /></div>;
}
