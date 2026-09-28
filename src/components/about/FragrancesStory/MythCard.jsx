import artwork from './assets/con2-card-artwork.png';

export default function MythCard({ card }) {
  return (
    <article className={`fragrances-con2__card fragrances-con2__card--${card.id}`}>
      <div className="fragrances-con2__card-artwork">
        <img className="fragrances-con2__card-image" src={artwork} alt="" width="1021.666" height="360" style={{ left: card.cropLeft }} draggable="false" />
      </div>
      <div className="fragrances-con2__card-content">
        <div className="fragrances-con2__card-heading">
          <p className="fragrances-con2__card-number">{card.number}</p>
          <h3 className="fragrances-con2__card-title">{card.title}</h3>
        </div>
        <p className="fragrances-con2__card-description">
          {card.description.map((line) => <span key={line}>{line}</span>)}
        </p>
      </div>
    </article>
  );
}
