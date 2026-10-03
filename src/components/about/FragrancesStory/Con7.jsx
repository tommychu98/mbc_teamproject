import { useEffect, useRef } from 'react';
import useStoryTypographyMotion from './useStoryTypographyMotion';
import useContinuousArtwork from './useContinuousArtwork';
import StoryImage from './StoryImage';
import mobilefurniture from './assets/mobile-chair.png';
import musicians from './assets/con7-musicians.png';
import dancers from './assets/con7-dancers.png';
import furniture from './assets/con7-furniture.png';
import chandelier from './assets/con7-chandelier.png';
import plant from './assets/con7-plant.png';
import './Con7.css';

// Isolate heads from the original artwork; instruments and the stage stay still.
const musicianParts = [
  { name: 'trumpet', points: '7% 2%, 16% 2%, 16% 14%, 13% 20%, 7% 15%', origin: '12% 18%' },
  { name: 'piano', points: '24% 29%, 34% 29%, 34% 39%, 30% 45%, 24% 39%', origin: '28% 42%' },
  { name: 'bass', points: '49% 16%, 57% 16%, 58% 26%, 54% 32%, 49% 27%', origin: '54% 30%' },
  { name: 'drums', points: '75% 33%, 83% 33%, 84% 42%, 80% 49%, 75% 43%', origin: '79% 46%' },
];
const musicianMountClip = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${musicianParts.map(({ points }) => `${points}, ${points.split(', ')[0]}, 0 0`).join(', ')})`;

export default function Con7() {
  const sceneRef = useRef(null);
  useStoryTypographyMotion(sceneRef, 'con7', 'title', 'title');
  useContinuousArtwork(sceneRef);

  useEffect(() => {
    const scene = sceneRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      scene.classList.toggle('fragrances-con7__scene--visible', entry.isIntersecting);
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="fragrances-con7" aria-labelledby="fragrances-con7-title">
      <div ref={sceneRef} className="fragrances-con7__scene">
        <div className="fragrances-con7__musicians" aria-hidden="true">
          <img className="fragrances-con7__musicians-still" style={{ clipPath: musicianMountClip }} src={musicians} alt="" width="787" height="452" draggable="false" />
          {musicianParts.map(({ name, points, origin }) => (
            <img key={name} className={`fragrances-con7__musician fragrances-con7__musician--${name}`} style={{ clipPath: `polygon(${points})`, transformOrigin: origin }} src={musicians} alt="" width="787" height="452" draggable="false" />
          ))}
        </div>
        <h2 className="fragrances-con7__title" id="fragrances-con7-title">Orphéon</h2>
        <p className="fragrances-con7__chapter">Chapter III</p>
        <div className="fragrances-con7__intro">
          <h3 className="fragrances-con7__subtitle">PARIS AS NIGHT FALLS</h3>
          <p className="fragrances-con7__text">
            파리 재즈 클럽의 기억에서 태어난 오르페옹은<br /><span className="fragrances-story__mobile-copy">{' '}</span>
            음악과 웃음, 사람들의 온기로 가득했던 밤을 담아내며, 화려했던 그 시절의 풍경과 설렘을 다시 불러옵니다.
          </p>
        </div>
        <p className="fragrances-con7__text fragrances-con7__text--body">
          주니퍼베리와 시더, 통카빈의 깊고 따스한 향은<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          음악이 멈춘 뒤에도 잔잔한 선율처럼 공간에 머물며,<br /><span className="fragrances-story__mobile-copy">{' '}</span>
          지나간 밤의 기억과 그날의 여운을 오래도록 남깁니다.
        </p>
        <img className="fragrances-con7__dancers" src={dancers} alt="파리 재즈 클럽에서 서로 마주 보며 춤추는 세 쌍의 남녀" width="966" height="1286" draggable="false" />
        <StoryImage mobileSrc={mobilefurniture} className="fragrances-con7__furniture" src={furniture} alt="" width="1255" height="1115" draggable="false" />
        <div className="fragrances-con7__chandelier" aria-hidden="true">
          <img className="fragrances-con7__chandelier-mount" src={chandelier} alt="" width="970" height="647" draggable="false" />
          <img className="fragrances-con7__chandelier-swing" src={chandelier} alt="" width="970" height="647" draggable="false" />
        </div>
        <div className="fragrances-con7__plant" aria-hidden="true">
          <img className="fragrances-con7__plant-image" src={plant} alt="" width="425" height="638" draggable="false" />
        </div>
      </div>
    </section>
  );
}
