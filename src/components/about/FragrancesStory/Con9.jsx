import { useRef, useSyncExternalStore } from 'react';
import Con9Mobile from './Con9Mobile';
import useCon9NoteInteraction from './useCon9NoteInteraction';
import useCon9BottleEntrance from './useCon9BottleEntrance';
import StoryImage from './StoryImage';
import mobilebackground from './assets/mobile-notes-background.png';
import mobiletable from './assets/mobile-notes-table.png';
import background from './assets/con3-background.png';
import table from './assets/con3-table.png';
import ingredients from './assets/con9-ingredients.png';
import mainPerfume from './assets/con9-main-perfume.png';
import './Con9.css';

const notes = [
  { id: 'galbanum', label: 'TOP NOTE', name: 'GALBANUM' },
  { id: 'jasmine', label: 'MIDDLE NOTE', name: 'JASMINE' },
  { id: 'tonka', label: 'BASE NOTE', name: 'TONKA BEAN' },
];

function Con9Desktop() {
  const sceneRef = useRef(null);
  useCon9NoteInteraction(sceneRef);
  useCon9BottleEntrance(sceneRef);
  return (
    <>
      <div ref={sceneRef} className="fragrances-con9__scene">
        <h2 className="fragrances-con9__title fragrances-story__mobile-copy">NOTES</h2>
        <StoryImage mobileSrc={mobilebackground} className="fragrances-con9__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <div className="fragrances-con9__table">
          <StoryImage mobileSrc={mobiletable} className="fragrances-con9__table-image" src={table} alt="" width="1122" height="1402" draggable="false" />
        </div>
        <dl className="fragrances-con9__notes">
          {notes.map(({ id, label, name }) => (
            <div className="fragrances-con9__note" key={label} id={`fragrances-con9-note-${id}`}>
              <dt className="fragrances-con9__note-label"><span className="fragrances-story__desktop-copy">{label}</span><span className="fragrances-story__mobile-copy">{label === 'TOP NOTE' ? 'FIRST NOTE' : label}</span></dt>
              <dd className="fragrances-con9__note-name"><span className="fragrances-story__desktop-copy">{name}</span><span className="fragrances-story__mobile-copy">{name === 'TONKA BEAN' ? <>TONKA<br />BEAN</> : name}</span></dd>
            </div>
          ))}
        </dl>
        <div className="fragrances-con9__perfume">
          <StoryImage mobileSrc={ingredients} className="fragrances-con9__perfume-image" src={ingredients} alt="갈바넘, 자스민과 통카빈으로 구성된 Orphéon 향 재료" width="1721" height="914" draggable="false" />
        </div>
        <div className="fragrances-con9__ingredient-targets">
          {notes.map(({ id, label, name }) => (
            <button key={id} type="button" className={`fragrances-con9__ingredient fragrances-con9__ingredient--${id}`} data-ingredient={id} aria-pressed="false" aria-label={`${name}: ${label} 강조`} aria-controls={`fragrances-con9-note-${id}`} />
          ))}
        </div>
        <div className="fragrances-con9__main-perfume">
          <img className="fragrances-con9__main-perfume-image" src={mainPerfume} alt="Orphéon 오 드 퍼퓸" width="1263" height="1246" draggable="false" />
        </div>
      </div>
    </>
  );
}

function subscribeMobile(callback) {
  const media = window.matchMedia('(width < 768px)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const isMobile = () => window.matchMedia('(width < 768px)').matches;

export default function Con9() {
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, () => false);
  // Keep this React-owned sibling stable while BookSequence is inside a pin spacer.
  // Breakpoint changes replace only the scene, never the section beside that pin.
  return (
    <section className="fragrances-con9" aria-label="Orphéon 향 노트">
      {mobile ? <Con9Mobile /> : <Con9Desktop />}
    </section>
  );
}
