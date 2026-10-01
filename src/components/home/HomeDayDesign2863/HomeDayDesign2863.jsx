import back from './assets/back.png';
import woman from './assets/woman.png';
import floralOverlay from './assets/image-366.png';
import leftFloral from './assets/left.png';
import rightFloral from './assets/right.png';
import foregroundLeaf from './assets/leaf.png';
import topLemon from './assets/top-lemon.png';
import bird from './assets/bird.png';
import cups from './assets/cups.png';
import morningDivider from './assets/divider-left.svg';
import sensorialDivider from './assets/divider-right.svg';
import buttonArrow from './assets/button-arrow.svg';
import buttonArrowHover from './assets/button-arrow-hover.svg';
import './HomeDayDesign2863.css';

export default function HomeDayDesign2863() {
    return (
        <section className="home-day-design" aria-labelledby="home-day-design-title">
            <div className="home-day-design__image home-day-design__back"><img src={back} alt="" /></div>
            <div className="home-day-design__image home-day-design__woman"><img src={woman} alt="" /></div>
            <div className="home-day-design__rotated home-day-design__floral-overlay"><img src={floralOverlay} alt="" /></div>
            <div className="home-day-design__rotated home-day-design__left-floral"><img src={leftFloral} alt="" /></div>
            <div className="home-day-design__rotated home-day-design__right-floral"><img src={rightFloral} alt="" /></div>
            <div className="home-day-design__rotated home-day-design__foreground-leaf"><img src={foregroundLeaf} alt="" /></div>
            <div className="home-day-design__image home-day-design__top-lemon"><img src={topLemon} alt="" /></div>
            <div className="home-day-design__image home-day-design__bird"><img src={bird} alt="" /></div>
            <div className="home-day-design__image home-day-design__cups"><img src={cups} alt="" /></div>

            <div className="home-day-design__morning">
                <h3 className="home-day-design__section-heading home-day-design__morning-heading">
                    Embrace the day.<br />Explore the<br />morning ritual.
                </h3>
                <img className="home-day-design__divider home-day-design__morning-divider" src={morningDivider} alt="" />
                <div className="home-day-design__body home-day-design__morning-body">
                    <p>아침의 첫 빛과 함께, 나를 돌보는 시간이 시작됩니다.</p>
                    <p>피부를 깨끗이 씻고 수분을 채우며 감각을 깨우는 여섯 단계의 케어.<br />몸과 마음에 부드러운 활력을 더하며 하루를 시작해 보세요.</p>
                </div>
            </div>

            <div className="home-day-design__sensorial">
                <h3 className="home-day-design__section-heading home-day-design__sensorial-heading">
                    A sensorial start<br />of the day
                </h3>
                <img className="home-day-design__divider home-day-design__sensorial-divider" src={sensorialDivider} alt="" />
                <div className="home-day-design__body home-day-design__sensorial-body">
                    <p>Le Matin 캔들이 케어의 시작을 알리고, 그 순간의 분위기를 완성합니다.</p>
                    <p>클렌징 젤부터 인비고레이팅 스크럽, 모이스처라이징 로션과 퍼펙팅 새틴 오일, 그리고 립 왁스까지.</p>
                    <p>하나하나의 케어가 피부에 생기와 활력을 더하고, 한층 환하게 깨워줍니다.<br />몸과 감각도 서서히 깨어나며 새로운 하루를 맞이합니다.</p>
                </div>
            </div>

            <h2 className="home-day-design__title" id="home-day-design-title">Les Rituels<br />de Soin</h2>
            <p className="home-day-design__brand">Diptyque</p>
            <button className="home-day-design__button" type="button">
                <span>New Collection</span>
                <img className="home-day-design__button-arrow" src={buttonArrow} alt="" />
                <img className="home-day-design__button-arrow home-day-design__button-arrow--hover" src={buttonArrowHover} alt="" />
            </button>
        </section>
    );
}
