import { useRef } from 'react';
import background from './assets/con2-background.png';
import cloth from './assets/con2-cloth.png';
import MythCard from './MythCard';
import { mythCards } from './con2Data';
import './Con2.css';

export default function Con2() {
  const clothRef = useRef(null);

  return (
    <section className="fragrances-con2" aria-labelledby="fragrances-con2-title">
      <div className="fragrances-con2__scene">
        <div className="fragrances-con2__content">
          <img className="fragrances-con2__background" src={background} alt="" width="1920" height="1080" draggable="false" />
          <h2 className="fragrances-con2__title" id="fragrances-con2-title">A SCENT BORN FROM A MYTH</h2>
          <div className="fragrances-con2__cards">
            {mythCards.map((card) => <MythCard key={card.id} card={card} />)}
          </div>
        </div>
        {/* Outside the clipped content: continues over the end of Con1. */}
        <div className="fragrances-con2__cloth" ref={clothRef} aria-hidden="true">
          <div className="fragrances-con2__cloth-placement">
            <img className="fragrances-con2__cloth-image" src={cloth} alt="" width="492.656" height="738.984" draggable="false" />
          </div>
        </div>
      </div>
    </section>
  );
}
