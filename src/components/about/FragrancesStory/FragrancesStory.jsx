import './style.css';
import { heroLayers } from './heroLayers';
import Con1 from './Con1';

export default function FragrancesStory() {
  return (
    <section className="fragrances-story" aria-labelledby="fragrances-story-title">
      <h1 id="fragrances-story-title" className="sr-only">Fragrances Story — Fleur de Peau</h1>
      <div className="fragrances-story__scene" role="img" aria-label="Fleur de Peau 향수 이야기. 나무 책상 위 펼쳐진 사랑 이야기 책과 깃펜을 쥔 손, 꽃, 향수, 촛불, 저울과 오래된 편지들.">
        {heroLayers.map(({ name, src, x, y, width, height, imageWidth = width, imageHeight = height, rotation = 0, flipY = false, crop }) => (
          <div
            className={`fragrances-story__layer fragrances-story__layer--${name}`}
            key={name}
            style={{ left: `${x / 1920 * 100}%`, top: `${y / 1080 * 100}%`, width: `${width / 1920 * 100}%`, height: `${height / 1080 * 100}%` }}
          >
            <div className="fragrances-story__object" style={{ width: `${imageWidth / width * 100}%`, height: `${imageHeight / height * 100}%`, transform: `rotate(${rotation}deg)${flipY ? ' scaleY(-1)' : ''}` }}>
              <img className="fragrances-story__image" src={src} alt="" aria-hidden="true" draggable="false" width={imageWidth} height={imageHeight} fetchPriority={name === 'main-book' ? 'high' : 'auto'} style={crop} />
            </div>
          </div>
        ))}
      </div>
      <Con1 />
    </section>
  );
}
