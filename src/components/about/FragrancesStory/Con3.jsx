import background from './assets/con3-background.png';
import table from './assets/con3-table.png';
import perfume from './assets/con3-perfume.png';
import './Con3.css';

const notes = [
  { label: 'TOP NOTE', name: 'BERGAMOT' },
  { label: 'MIDDLE NOTE', name: 'IRIS' },
  { label: 'BASE NOTE', name: 'AMBRETTES' },
];

export default function Con3() {
  return (
    <section className="fragrances-con3" aria-label="Fleur de Peau 향 노트">
      <div className="fragrances-con3__scene">
        <img className="fragrances-con3__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <div className="fragrances-con3__table">
          <img className="fragrances-con3__table-image" src={table} alt="" width="1122" height="1402" draggable="false" />
        </div>
        <img className="fragrances-con3__perfume" src={perfume} alt="베르가못, 아이리스와 암브레트에 둘러싸인 Fleur de Peau 향수" width="1131" height="600" draggable="false" />
        <dl className="fragrances-con3__notes">
          {notes.map(({ label, name }) => (
            <div className="fragrances-con3__note" key={label}>
              <dt className="fragrances-con3__note-label">{label}</dt>
              <dd className="fragrances-con3__note-name">{name}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
