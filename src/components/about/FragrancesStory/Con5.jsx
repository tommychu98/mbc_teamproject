import StoryImage from './StoryImage';
import mobileCard0 from './assets/mobile-con5-boutique.png';
import mobileCard1 from './assets/mobile-con5-velvet-woods.png';
import mobileCard2 from './assets/mobile-con5-afterglow.png';
const mobileCards = [mobileCard0, mobileCard1, mobileCard2];
import useMobileCards from './useMobileCards';
import useCon2Swipe from './useCon2Swipe';
import useCon5Typography from './useCon5Typography';
import activeDot from './assets/mobile-con5-dot-active.svg';
import inactiveDot from './assets/mobile-con5-dot-inactive.svg';
import { useRef } from 'react';
import useCon5Pin from './useCon5Pin';
import boutique from './assets/con5-boutique.png';
import velvetWoods from './assets/con5-velvet-woods.png';
import afterglow from './assets/con5-afterglow.png';
import './Con5.css';

const cards = [
  {
    number: 'I',
    title: 'THE BOUTIQUE',
    image: boutique,
    alt: '덩굴이 드리워진 34번가 부티크의 입구',
    lines: ['34번가의 문이 열리고', '공간을 천천히 채우는', '첫날의 기억'],
  },
  {
    number: 'II',
    title: 'VELVET WOODS',
    image: velvetWoods,
    alt: '바닐라 꽃과 바닐라빈, 우드',
    lines: ['바닐라와 앰버 우드가', '부드럽게 어우러진', '고혹적인 향취'],
  },
  {
    number: 'III',
    title: 'THE AFTERGLOW',
    image: afterglow,
    alt: '34 Boulevard Saint-Germain 책과 불씨가 남은 향 그릇',
    lines: ['고요해진 공간에', '따스한 우디 노트로', '오래 남는 여운'],
  },
];

export default function Con5() {
  const sectionRef = useRef(null);
  useCon5Pin(sectionRef);
  const { railRef } = useMobileCards();
  const { copyRef, active } = useCon5Typography(railRef, cards);
  const nextCard = useCon2Swipe(railRef);
  return (
    <section ref={sectionRef} className="fragrances-con5" aria-labelledby="fragrances-con5-title">
      <div className="fragrances-con5__scene">
        <h2 className="fragrances-con5__title" id="fragrances-con5-title"><span className="fragrances-story__desktop-copy">A BOUTIQUE CAPTURED IN SCENT</span><span className="fragrances-story__mobile-copy">A BOUTIQUE<br />CAPTURED IN SCENT</span></h2>
        <div ref={railRef} className="fragrances-con5__cards">
          {cards.map(({ number, title, image, alt, lines }, index) => (
            <article className="fragrances-con5__card" key={number}>
              <div className="fragrances-con5__card-artwork">
                <div className="fragrances-con5__ink-original">
                  <StoryImage mobileSrc={mobileCards[index]} className="fragrances-con5__card-image" src={image} alt={alt} width="340" height="360" draggable="false" />
                </div>
              </div>
              <div className="fragrances-con5__card-content">
                <h3 className="fragrances-con5__card-heading">
                  <span>{number}</span>
                  <span>{title}</span>
                </h3>
                <p className="fragrances-con5__card-description">
                  {lines.map((line) => <span key={line}>{line}</span>)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div ref={copyRef} className="fragrances-con5__mobile-typography fragrances-con5__card-content" aria-live="polite" aria-atomic="true">
          <h3 className="fragrances-con5__card-heading">
            <span data-copy-part>{cards[0].number}</span>
            <span data-copy-part>{cards[0].title}</span>
          </h3>
          <p className="fragrances-con5__card-description" data-copy-part>
            {cards[0].lines.map((line) => <span key={line}>{line}</span>)}
          </p>
        </div>
        <div className="fragrances-con5__dots" role="group" aria-label="향 이야기 카드 선택">
          {cards.map((card, index) => (
            <button key={card.number} type="button" aria-label={`${index + 1}번 카드: ${card.title}`} aria-pressed={active === index + 1} onClick={() => {
              const rail = railRef.current;
              if (!rail || !window.matchMedia('(width < 768px)').matches) return;
              const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
              rail.scrollTo({ left: index * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            }}>
              <img src={active === index + 1 ? activeDot : inactiveDot} alt="" width="10" height="10" />
            </button>
          ))}
        </div>
        <button type="button" className="fragrances-story__pagination fragrances-con5__pagination" onClick={nextCard} aria-label={`향 이야기 ${active}/3. 다음 카드 보기`} aria-live="polite" aria-atomic="true">{active}/3</button>
      </div>
    </section>
  );
}
