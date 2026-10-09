import { useEffect, useRef } from 'react';
import useStoryTypographyMotion from './useStoryTypographyMotion';
import useCon7DancersEntrance from './useCon7DancersEntrance';
import useCon7MusicalNotesMotion from './useCon7MusicalNotesMotion';
import useCon7SmokeMotion from './useCon7SmokeMotion';
import useContinuousArtwork from './useContinuousArtwork';
import StoryImage from './StoryImage';
import mobilefurniture from './assets/mobile-con7-bottom-furniture.png';
import musicians from './assets/con7-musicians.png';
import dancers from './assets/mobile-con7-dancers.png';
import desktopDancers from './assets/con7-desktop-dancers.png';
import desktopTable from './assets/con7-desktop-table.png';
import musicalNoteSingle from './assets/con7-musical-note-single.png';
import musicalNoteDouble from './assets/con7-musical-note-double.png';
import chandelier from './assets/con7-chandelier.png';
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
  useCon7DancersEntrance(sceneRef);
  useCon7MusicalNotesMotion(sceneRef);
  useCon7SmokeMotion(sceneRef);
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
        <div className="fragrances-con7__musical-note fragrances-con7__musical-note--second" aria-hidden="true">
          <img src={musicalNoteSingle} alt="" width="1189" height="1323" draggable="false" />
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
        <StoryImage mobileSrc={dancers} className="fragrances-con7__dancers" src={desktopDancers} alt="파리 재즈 클럽에서 서로 마주 보며 춤추는 세 쌍의 남녀" width="1022" height="1207" draggable="false" />
        <StoryImage mobileSrc={mobilefurniture} className="fragrances-con7__furniture" src={desktopTable} alt="" width="844" height="888" draggable="false" />
        <svg className="fragrances-con7__smoke" viewBox="0 0 128 340" width="128" height="340" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="fragrances-con7-smoke-fade" x1="0" y1="340" x2="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#a89f93" stopOpacity="0.36" />
              <stop offset="0.15" stopColor="#a89f93" stopOpacity="0.58" />
              <stop offset="0.68" stopColor="#a89f93" stopOpacity="0.5" />
              <stop offset="0.78" stopColor="#a89f93" stopOpacity="0.32" />
              <stop offset="0.94" stopColor="#a89f93" stopOpacity="0.06" />
              <stop offset="1" stopColor="#a89f93" stopOpacity="0" />
            </linearGradient>
            <filter id="fragrances-con7-smoke-soften" x="-20%" y="-5%" width="140%" height="110%">
              <feGaussianBlur stdDeviation="0.75" />
            </filter>
          </defs>
          {/* One filled ribbon: the emitter stays fixed while its curls rise. */}
          <path className="fragrances-con7__smoke-plume" fill="url(#fragrances-con7-smoke-fade)" filter="url(#fragrances-con7-smoke-soften)" />
        </svg>
        <div className="fragrances-con7__chandelier" aria-hidden="true">
          <img className="fragrances-con7__chandelier-mount" src={chandelier} alt="" width="970" height="647" draggable="false" />
          <img className="fragrances-con7__chandelier-swing" src={chandelier} alt="" width="970" height="647" draggable="false" />
        </div>
        {/* BG_Plant is an empty frame in Figma 3869:11342. */}
        <div className="fragrances-con7__plant" aria-hidden="true" />
        <div className="fragrances-con7__musical-note fragrances-con7__musical-note--third" aria-hidden="true">
          <img src={musicalNoteDouble} alt="" width="1243" height="1266" draggable="false" />
        </div>
        <div className="fragrances-con7__musical-note fragrances-con7__musical-note--first" aria-hidden="true">
          <img src={musicalNoteSingle} alt="" width="1189" height="1323" draggable="false" />
        </div>
      </div>
    </section>
  );
}
