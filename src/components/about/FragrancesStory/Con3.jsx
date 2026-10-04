import { useRef } from 'react';
import useCon3NoteInteraction from './useCon3NoteInteraction';
import useCon3BottleEntrance from './useCon3BottleEntrance';
import StoryImage from './StoryImage';
import mobilebackground from './assets/mobile-notes-background.png';
import mobiletable from './assets/mobile-notes-table.png';
import background from './assets/con3-background.png';
import table from './assets/con3-table.png';
import ingredients from './assets/con3-ingredients.png';
import mainPerfume from './assets/con3-main-perfume.png';
import './Con3.css';

const notes = [
  { id: 'bergamot', label: 'TOP NOTE', name: 'BERGAMOT' },
  { id: 'iris', label: 'MIDDLE NOTE', name: 'IRIS' },
  { id: 'ambrettes', label: 'BASE NOTE', name: 'AMBRETTES' },
];

export default function Con3() {
  const sceneRef = useRef(null);
  useCon3NoteInteraction(sceneRef);
  useCon3BottleEntrance(sceneRef);

  return (
    <section className="fragrances-con3" aria-label="Fleur de Peau 향 노트">
      <div ref={sceneRef} className="fragrances-con3__scene">
        <StoryImage mobileSrc={mobilebackground} className="fragrances-con3__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <div className="fragrances-con3__table">
          <StoryImage mobileSrc={mobiletable} className="fragrances-con3__table-image" src={table} alt="" width="1122" height="1402" draggable="false" />
        </div>
        <StoryImage mobileSrc={ingredients} className="fragrances-con3__perfume" src={ingredients} alt="베르가못, 아이리스와 암브레트로 구성된 Fleur de Peau 향 재료" width="1131" height="600" draggable="false" />
        <div className="fragrances-con3__ingredient-targets">
          {notes.map(({ id, label, name }) => (
            <button key={id} type="button" className={`fragrances-con3__ingredient fragrances-con3__ingredient--${id}`} data-ingredient={id} aria-pressed="false" aria-label={`${name}: ${label} 강조`} aria-controls={`fragrances-con3-note-${id}`} />
          ))}
        </div>
        <div className="fragrances-con3__main-perfume">
          <div className="fragrances-con3__main-perfume-artwork">
            <img className="fragrances-con3__main-perfume-image" src={mainPerfume} alt="Fleur de Peau 오 드 퍼퓸" width="1722" height="913" draggable="false" />
          </div>
        </div>
        <dl className="fragrances-con3__notes">
          {notes.map(({ id, label, name }) => (
            <div className="fragrances-con3__note" key={label} id={`fragrances-con3-note-${id}`}>
              <dt className="fragrances-con3__note-label"><span data-light-text={label} className="fragrances-story__desktop-copy">{label}</span><span data-light-text={label === 'TOP NOTE' ? 'FIRST NOTE' : label} className="fragrances-story__mobile-copy">{label === 'TOP NOTE' ? 'FIRST NOTE' : label}</span></dt>
              <dd className="fragrances-con3__note-name"><span data-light-text={name} className="fragrances-con3__note-name-copy">{name}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
