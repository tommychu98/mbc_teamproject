import useMobileCards from './useMobileCards';
import useCon2Swipe from './useCon2Swipe';
import useCon2Pin from './useCon2Pin';
import useCon2Typography from './useCon2Typography';
import { useRef } from 'react';
import MythCard from './MythCard';
import { mythCards } from './con2Data';
import activeDot from './assets/mobile-con2-dot-active.svg';
import inactiveDot from './assets/mobile-con2-dot-inactive.svg';
import './Con2.css';

export default function Con2() {
  const { railRef } = useMobileCards();
  const { copyRef, active } = useCon2Typography(railRef);
  const nextCard = useCon2Swipe(railRef);
  const sectionRef = useRef(null);
  useCon2Pin(sectionRef);

  return (
    <section ref={sectionRef} className="fragrances-con2" aria-labelledby="fragrances-con2-title">
      <div className="fragrances-con2__scene">
        <div className="fragrances-con2__content">
          <h2 className="fragrances-con2__title" id="fragrances-con2-title">A SCENT BORN FROM A MYTH</h2>
          <div ref={railRef} className="fragrances-con2__cards">
            {mythCards.map((card) => <MythCard key={card.id} card={card} />)}
          </div>
        </div>
        <div ref={copyRef} className="fragrances-con2__mobile-typography fragrances-con2__card-content" aria-live="polite" aria-atomic="true">
          <div className="fragrances-con2__card-heading">
            <p className="fragrances-con2__card-number" data-copy-part>{mythCards[0].number}</p>
            <h3 className="fragrances-con2__card-title" data-copy-part>{mythCards[0].title}</h3>
          </div>
          <p className="fragrances-con2__card-description" data-copy-part>
            {mythCards[0].description.map((line) => <span key={line}>{line}</span>)}
          </p>
        </div>
        <div className="fragrances-con2__dots" role="group" aria-label="향 이야기 카드 선택">
          {mythCards.map((card, index) => (
            <button key={card.id} type="button" aria-label={`${index + 1}번 카드: ${card.title}`} aria-pressed={active === index + 1} onClick={() => {
              const rail = railRef.current;
              if (!rail || !window.matchMedia('(width < 768px)').matches) return;
              const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
              rail.scrollTo({ left: index * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            }}>
              <img src={active === index + 1 ? activeDot : inactiveDot} alt="" width="10" height="10" />
            </button>
          ))}
        </div>
        <button type="button" className="fragrances-story__pagination fragrances-con2__pagination" onClick={nextCard} aria-label={`향 이야기 ${active}/3. 다음 카드 보기`} aria-live="polite" aria-atomic="true">{active}/3</button>
      </div>
    </section>
  );
}
