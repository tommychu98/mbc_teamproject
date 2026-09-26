import background from './assets/con3-background.png';
import table from './assets/con3-table.png';
import perfume from './assets/con6-perfume.png';
import './Con6.css';

const notes = [
  { label: 'TOP NOTE', name: 'JUNIPER BERRY' },
  { label: 'MIDDLE NOTE', name: 'TUBEROSE' },
  { label: 'BASE NOTE', name: 'SANDALWOOD' },
];

export default function Con6() {
  return (
    <section className="fragrances-con6" aria-label="The 34 향 노트">
      <div className="fragrances-con6__scene">
        <img className="fragrances-con6__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <div className="fragrances-con6__table">
          <img className="fragrances-con6__table-image" src={table} alt="" width="1122" height="1402" draggable="false" />
        </div>
        <img className="fragrances-con6__perfume" src={perfume} alt="주니퍼 베리, 튜베로즈와 샌들우드에 둘러싸인 The 34 향수" width="1130" height="600" draggable="false" />
        <dl className="fragrances-con6__notes">
          {notes.map(({ label, name }) => (
            <div className="fragrances-con6__note" key={label}>
              <dt className="fragrances-con6__note-label">{label}</dt>
              <dd className="fragrances-con6__note-name">{name}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
