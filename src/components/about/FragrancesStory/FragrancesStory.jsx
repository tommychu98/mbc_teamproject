import { useRef } from 'react';
import useHeroMotion from './useHeroMotion';
import './style.css';
import { heroLayers } from './heroLayers';
import Con1 from './Con1';
import Con2 from './Con2';
import Con3 from './Con3';
import Con4 from './Con4';
import Con5 from './Con5';
import Con6 from './Con6';
import Con7 from './Con7';
import Con8 from './Con8';
import Con9 from './Con9';
import Con10 from './Con10';
import Con11 from './Con11';
import Con12 from './Con12';
import Con13 from './Con13';
import Footer from './Footer';
import StoryTopButton from './StoryTopButton';
import StoryImage from './StoryImage';
import mobileHand from './assets/mobile-hero-hand.png';
import './mobile.css';

export default function FragrancesStory() {
  const heroRef = useRef(null);
  useHeroMotion(heroRef);

  return (
    <section className="fragrances-story" aria-labelledby="fragrances-story-title">
      <h1 id="fragrances-story-title" className="sr-only">Fragrances Story — Fleur de Peau</h1>
      <div ref={heroRef} className="fragrances-story__scene" role="img" aria-label="Fleur de Peau 향수 이야기. 나무 책상 위 펼쳐진 사랑 이야기 책과 깃펜을 쥔 손, 꽃, 향수, 촛불, 저울과 오래된 편지들.">
        {heroLayers.map(({ name, src, x, y, width, height, imageWidth = width, imageHeight = height, rotation = 0, flipY = false, crop }) => (
          <div
            className={`fragrances-story__layer fragrances-story__layer--${name}`}
            key={name}
            style={{ left: `${x / 1920 * 100}%`, top: `${y / 1080 * 100}%`, width: `${width / 1920 * 100}%`, height: `${height / 1080 * 100}%` }}
          >
            <div className="fragrances-story__object" style={{ width: `${imageWidth / width * 100}%`, height: `${imageHeight / height * 100}%`, transform: `rotate(${rotation}deg)${flipY ? ' scaleY(-1)' : ''}` }}>
              <StoryImage mobileSrc={name === 'hand' ? mobileHand : src} className="fragrances-story__image" src={src} alt="" aria-hidden="true" draggable="false" width={imageWidth} height={imageHeight} loading="eager" fetchPriority={['background', 'flower-at-corner', 'hidden-books', 'scale'].includes(name) ? 'high' : 'auto'} style={crop} />
            </div>
          </div>
        ))}
      </div>
      <Con1 />
      <Con2 />
      <Con3 />
      <Con4 />
      <Con5 />
      <Con6 />
      <Con7 />
      <Con8 />
      <Con9 />
      <Con10 />
      <Con11 />
      <Con12 />
      <Con13 />
      <Footer />
      <StoryTopButton />
    </section>
  );
}
