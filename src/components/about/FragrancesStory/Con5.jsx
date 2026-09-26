import background from './assets/con5-background.png';
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
  return (
    <section className="fragrances-con5" aria-labelledby="fragrances-con5-title">
      <div className="fragrances-con5__scene">
        <img className="fragrances-con5__background" src={background} alt="" width="1920" height="1080" draggable="false" />
        <h2 className="fragrances-con5__title" id="fragrances-con5-title">A BOUTIQUE CAPTURED IN SCENT</h2>
        <div className="fragrances-con5__cards">
          {cards.map(({ number, title, image, alt, lines }) => (
            <article className="fragrances-con5__card" key={number}>
              <img className="fragrances-con5__card-image" src={image} alt={alt} width="340" height="360" draggable="false" />
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
      </div>
    </section>
  );
}
