import { useRef } from 'react';
import useCon6NoteInteraction from './useCon6NoteInteraction';
import useCon6BottleEntrance from './useCon6BottleEntrance';
import StoryImage from './StoryImage';
import mobilebackground from './assets/mobile-notes-background.png';
import mobiletable from './assets/mobile-notes-table.png';
import background from './assets/con3-background.png';
import table from './assets/con3-table.png';
import perfume from './assets/con6-perfume.png';
import ingredients from './assets/con6-ingredients.png';
import mainPerfume from './assets/con6-main-perfume.png';
import './Con6.css';

const notes = [
  { id: 'juniper', label: 'TOP NOTE', name: 'JUNIPER BERRY' },
  { id: 'tuberose', label: 'MIDDLE NOTE', name: 'TUBEROSE' },
  { id: 'sandalwood', label: 'BASE NOTE', name: 'SANDALWOOD' },
];

export default function Con6() {
  const sceneRef = useRef(null);
  useCon6NoteInteraction(sceneRef);
  useCon6BottleEntrance(sceneRef);
  return (
    <section className="fragrances-con6" aria-label="The 34 향 노트">
      <div ref={sceneRef} className="fragrances-con6__scene">
        <StoryImage mobileSrc={mobilebackground} className="fragrances-con6__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <div className="fragrances-con6__table">
          <StoryImage mobileSrc={mobiletable} className="fragrances-con6__table-image" src={table} alt="" width="1122" height="1402" draggable="false" />
        </div>
        <StoryImage mobileSrc={perfume} className="fragrances-con6__perfume" src={ingredients} alt="주니퍼 베리, 튜베로즈와 샌들우드로 구성된 The 34 향 재료" width="1131" height="601" draggable="false" />
        <div className="fragrances-con6__ingredient-targets">
          {notes.map(({ id, label, name }) => (
            <button key={id} type="button" className={`fragrances-con6__ingredient fragrances-con6__ingredient--${id}`} data-ingredient={id} aria-pressed="false" aria-label={`${name}: ${label} 강조`} aria-controls={`fragrances-con6-note-${id}`} />
          ))}
        </div>
        <div className="fragrances-con6__main-perfume">
          <div className="fragrances-con6__main-perfume-artwork">
            <img className="fragrances-con6__main-perfume-image" src={mainPerfume} alt="The 34 오 드 퍼퓸" width="1721" height="914" draggable="false" />
          </div>
        </div>
        <dl className="fragrances-con6__notes">
          {notes.map(({ id, label, name }) => (
            <div className="fragrances-con6__note" key={label} id={`fragrances-con6-note-${id}`}>
              <dt className="fragrances-con6__note-label"><span className="fragrances-story__desktop-copy">{label}</span><span className="fragrances-story__mobile-copy">{label === 'TOP NOTE' ? 'FIRST NOTE' : label}</span></dt>
              <dd className="fragrances-con6__note-name"><span className="fragrances-story__desktop-copy">{name}</span><span className="fragrances-story__mobile-copy">{name === 'JUNIPER BERRY' ? <>JUNIPER<br />BERRY</> : name === 'SANDALWOOD' ? <>SANDAL<br />WOOD</> : name}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
