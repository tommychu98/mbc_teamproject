import closingImage from './assets/mobile/020ef.png';
import './mobile-renewal.css';

export default function MobileRenewal({ separate, textOut, expand, imageIn, finalIn }) {
  return <div className="ftp-mobile-renewal" style={{ '--renewal-expand': expand }}>
      <div className="ftp-mobile-renewal__card" style={{ opacity: 1 - textOut }}>
        <p>For The<br />Planet</p>
        <h2>
          <span>What We Keep,</span>
          <span aria-hidden="true" style={{ height: 49 * separate }} />
          <span>What We Renew.</span>
        </h2>
        <p>Eco-designing<br />our creations</p>
      </div>
    <div className="ftp-mobile-renewal__closing" style={{ opacity: imageIn * (0.5 + 0.5 * expand) }}>
      <img className="ftp-mobile-renewal__background" src="/ForThePlanet/25fb5.png" alt="" />
      <img className="ftp-mobile-renewal__background" src={closingImage} alt="자연 소재와 어우러진 딥티크 캔들" style={{ opacity: expand }} />
    </div>
      <div className="ftp-mobile-renewal__copy" style={{ opacity: finalIn, transform: `translateY(${(1 - finalIn) * 28}px)` }}>
        <h2>What We Keep, What We Renew</h2>
        <p>자연에서 받은 영감은 지키고,<br />환경에 남기는 흔적은 줄여갑니다.<br />딥디크는 더 오래 쓰고, 더 책임 있게 만들며, 다음 세대를 위한 새로운 방식을 계속 고민합니다.</p>
      </div>
  </div>;
}
