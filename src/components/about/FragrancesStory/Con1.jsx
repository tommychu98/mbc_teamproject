import cloud from './assets/con1-cloud.png';
import pillar from './assets/con1-pillar.png';
import butterfly from './assets/con1-butterfly.png';
import couple from './assets/con1-couple.png';
import './Con1.css';

export default function Con1() {
  return (
    <section className="fragrances-con1" aria-labelledby="fragrances-con1-title">
      <div className="fragrances-con1__scene">
        <img className="fragrances-con1__cloud fragrances-con1__cloud--left" src={cloud} alt="" width="929" height="464" draggable="false" />
        <img className="fragrances-con1__cloud fragrances-con1__cloud--small" src={cloud} alt="" width="465" height="232" draggable="false" />

        <h2 id="fragrances-con1-title" className="fragrances-con1__title">
          <span className="fragrances-con1__title-fleur">Fleur de </span>
          <span className="fragrances-con1__title-peau">{'      Peau'}</span>
        </h2>
        <p className="fragrances-con1__chapter">Chapter I</p>
        <div className="fragrances-con1__intro">
          <h3 className="fragrances-con1__subtitle">A LOVE BEYOND APPEARANCES</h3>
          <p className="fragrances-con1__text fragrances-con1__text--intro">
            에로스는 피상적인 사랑에 염증을 느꼈습니다.<br />
            프시케는 그의 겉모습 너머의 존재를 바라봅니다.
          </p>
        </div>
        <p className="fragrances-con1__text fragrances-con1__text--body1">
          그들의 이야기는 조용히 시작됩니다.<br />
          베르가못과 아이리스, 머스크가 첫 끌림의 달콤함을 담고,<br />
          프시케는 조금씩 에로스에게 가까이 이끌렸습니다.
        </p>
        <p className="fragrances-con1__text fragrances-con1__text--body2">
          향은 서로의 온기를 따라 깊어집니다,<br />
          베르가못과 아이리스, 머스크가 어우러져,<br />
          찰나의 끌림이 마침내 영원이 됩니다.
        </p>

        <img className="fragrances-con1__pillar" src={pillar} alt="" width="1303" height="1955" draggable="false" />
        <img className="fragrances-con1__butterfly fragrances-con1__butterfly--right" src={butterfly} alt="" width="147" height="122" draggable="false" />
        <div className="fragrances-con1__butterfly-left">
          <img className="fragrances-con1__butterfly fragrances-con1__butterfly--left" src={butterfly} alt="" width="112.78" height="93.683" draggable="false" />
        </div>
        <div className="fragrances-con1__couple">
          <img className="fragrances-con1__couple-image" src={couple} alt="서로 손을 맞잡고 가까이 마주한 에로스와 프시케" width="918" height="1551" draggable="false" />
        </div>
      </div>
    </section>
  );
}
