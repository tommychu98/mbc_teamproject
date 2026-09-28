import background from './assets/con3-background.png';
import table from './assets/con3-table.png';
import perfume from './assets/con9-perfume.png';
import './Con9.css';

const notes = [
  { label: 'TOP NOTE', name: 'GALBANUM' },
  { label: 'MIDDLE NOTE', name: 'JASMINE' },
  { label: 'BASE NOTE', name: 'TONKA BEAN' },
];

export default function Con9() {
  return (
    <section className="fragrances-con9" aria-label="Orphéon 향 노트">
      <div className="fragrances-con9__scene">
        <img className="fragrances-con9__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <div className="fragrances-con9__table">
          <img className="fragrances-con9__table-image" src={table} alt="" width="1122" height="1402" draggable="false" />
        </div>
        <dl className="fragrances-con9__notes">
          {notes.map(({ label, name }) => (
            <div className="fragrances-con9__note" key={label}>
              <dt className="fragrances-con9__note-label">{label}</dt>
              <dd className="fragrances-con9__note-name">{name}</dd>
            </div>
          ))}
        </dl>
        <div className="fragrances-con9__perfume">
          <img className="fragrances-con9__perfume-image" src={perfume} alt="갈바넘, 자스민과 통카빈에 둘러싸인 Orphéon 향수" width="1714" height="918" draggable="false" />
        </div>
      </div>
    </section>
  );
}
