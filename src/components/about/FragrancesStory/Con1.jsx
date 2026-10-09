import { useEffect, useRef } from 'react';
import useCon1TypographyMotion from './useCon1TypographyMotion';
import useCon1CoupleEntrance from './useCon1CoupleEntrance';
import StoryImage from './StoryImage';
import mobilecouple from './assets/mobile-con1-couple.png';
import mobilepillar from './assets/mobile-con1-pillar.png';
import cloud from './assets/con1-cloud.png';
import pillar from './assets/con1-pillar.png';
import butterfly from './assets/con1-butterfly.png';
import desktopCouple from './assets/con1-desktop-couple.png';
import desktopButterfly from './assets/con1-desktop-butterfly.png';
import desktopButterflyLeft from './assets/con1-desktop-butterfly-left.png';
import './Con1.css';

export default function Con1() {
  const sceneRef = useRef(null);
  useCon1TypographyMotion(sceneRef);
  useCon1CoupleEntrance(sceneRef);

  useEffect(() => {
    const scene = sceneRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      scene.classList.toggle('fragrances-con1__scene--visible', entry.isIntersecting);
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="fragrances-con1" aria-labelledby="fragrances-con1-title">
      <div ref={sceneRef} className="fragrances-con1__scene">
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
            에로스는 피상적인 사랑에 염증을 느꼈습니다.<br /><span className="fragrances-story__mobile-copy">{' '}</span>
            프시케는 그의 겉모습 너머의 존재를 바라봅니다.
          </p>
        </div>
        <p className="fragrances-con1__text fragrances-con1__text--body1">
          그들의 이야기는 조용히 시작됩니다.<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          베르가못과 아이리스, 머스크가 첫 끌림의 달콤함을 담고,<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          프시케는 조금씩 에로스에게 가까이 이끌렸습니다.
        </p>
        <p className="fragrances-con1__text fragrances-con1__text--body2">
          향은 서로의 온기를 따라 깊어집니다<span className="fragrances-story__desktop-copy">,</span><span className="fragrances-story__mobile-copy">.</span><br className="fragrances-con1__paragraph-break" /><span className="fragrances-story__mobile-copy">{' '}</span>
          베르가못과 아이리스, 머스크가 어우러져,<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          찰나의 끌림이 마침내 영원이 됩니다.
        </p>

        <StoryImage mobileSrc={mobilepillar} className="fragrances-con1__pillar" src={pillar} alt="" width="1303" height="1955" draggable="false" />
        <div className="fragrances-con1__butterfly-top" aria-hidden="true">
          <img src={desktopButterfly} alt="" width="107" height="89" draggable="false" />
        </div>
        <div className="fragrances-con1__butterfly-right">
          <StoryImage mobileSrc={butterfly} className="fragrances-con1__butterfly fragrances-con1__butterfly--right" src={desktopButterfly} alt="" width="147" height="122" draggable="false" />
        </div>
        <div className="fragrances-con1__butterfly-left">
          <StoryImage mobileSrc={butterfly} className="fragrances-con1__butterfly fragrances-con1__butterfly--left" src={desktopButterflyLeft} alt="" width="112.78" height="93.683" draggable="false" />
        </div>
        <div className="fragrances-con1__couple">
          <StoryImage mobileSrc={mobilecouple} className="fragrances-con1__couple-image" src={desktopCouple} alt="서로 손을 맞잡고 가까이 마주한 에로스와 프시케" width="918" height="1551" draggable="false" />
        </div>
      </div>
    </section>
  );
}
