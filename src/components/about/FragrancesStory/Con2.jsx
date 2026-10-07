import useMobileCards from './useMobileCards';
import useCon2Swipe from './useCon2Swipe';
import useCon2Pin from './useCon2Pin';
import { useRef } from 'react';
import background from './assets/con2-background.png';
import MythCard from './MythCard';
import { mythCards } from './con2Data';
import './Con2.css';

export default function Con2() {
  const { railRef, active } = useMobileCards();
  const nextCard = useCon2Swipe(railRef);
  const sectionRef = useRef(null);
  useCon2Pin(sectionRef);

  return (
    <section ref={sectionRef} className="fragrances-con2" aria-labelledby="fragrances-con2-title">
      <div className="fragrances-con2__scene">
        <div className="fragrances-con2__content">
          <img className="fragrances-con2__background" src={background} alt="" width="1920" height="1080" draggable="false" />
          <h2 className="fragrances-con2__title" id="fragrances-con2-title">A SCENT BORN FROM A MYTH</h2>
          <div ref={railRef} className="fragrances-con2__cards">
            {mythCards.map((card) => <MythCard key={card.id} card={card} />)}
          </div>
        </div>
        <button type="button" className="fragrances-story__pagination fragrances-con2__pagination" onClick={nextCard} aria-label={`향 이야기 ${active}/3. 다음 카드 보기`} aria-live="polite" aria-atomic="true">{active}/3</button>
      </div>
    </section>
  );
}
