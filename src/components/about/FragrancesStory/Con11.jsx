import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import background from './assets/background.png';
import stationery from './assets/con10-stationery.png';
import books from './assets/books-piled-up.png';
import papers from './assets/con10-papers.png';
import whiteFlower from './assets/con10-white-flower.png';
import letters from './assets/con10-letters.png';
import perfumeDrawing from './assets/con10-perfume-drawing.png';
import mainBook from './assets/con11-main-book.png';
import iris from './assets/flower-iris.png';
import './Con11.css';

gsap.registerPlugin(ScrollTrigger);

// Figma 3449:5913: exact frame positions, image transforms and back-to-front order.
// Figma image adjustments are already baked into the local PNGs.
const layers = [
  {
    name: 'background', src: background, order: 0,
    x: -57, y: 0, width: 1977, height: 1172,
    imageWidth: 1977, imageHeight: 1172,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'stationery', src: stationery, order: 1,
    x: 1415.468994140625, y: 72, width: 982.572509765625, height: 1047.8681640625,
    imageWidth: 803.4044799804688, imageHeight: 890.4230346679688,
    transform: [[0.974547266960144,-0.22418206930160522,199.61688232421875],[0.22418206930160522,0.974547266960144,0]],
  },
  {
    name: 'books', src: books, order: 2,
    x: 1827.83203125, y: 752.8671875, width: 410.2281188964844, height: 750.5120849609375,
    imageWidth: 410.2281188964844, imageHeight: 750.5120849609375,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'papers', src: papers, order: 3,
    x: 1092, y: 747.80859375, width: 565.07891845703125, height: 696.09716796875,
    imageWidth: 565.07891845703125, imageHeight: 696.09716796875,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'white-flower', src: whiteFlower, order: 4,
    x: 1462.1953125, y: 886.3309936523438, width: 311.46405029296875, height: 286.35595703125,
    imageWidth: 251.17762756347656, imageHeight: 191.84019470214844,
    transform: [[0.8862835764884949,0.46314293146133423,0],[-0.46314293146133423,0.8862835764884949,116.33114624023438]],
  },
  {
    name: 'letters', src: letters, order: 5,
    x: -526, y: 399.849609375, width: 744.25439453125, height: 680.1531982421875,
    imageWidth: 744.25439453125, imageHeight: 680.1531982421875,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'perfume-drawing', src: perfumeDrawing, order: 6,
    x: -400.0390625, y: 233.9998779296875, width: 926.4935913085938, height: 699.995361328125,
    imageWidth: 907.5436401367188, imageHeight: 674.264404296875,
    transform: [[0.9995892643928528,0.028657495975494385,0],[-0.028657495975494385,0.9995892643928528,26.0079288482666]],
  },
  {
    name: 'main-book', src: mainBook, order: 7,
    x: 293.0013122558594, y: 35, width: 1333.736083984375, height: 1010.3219604492188,
    imageWidth: 1302, imageHeight: 930,
    transform: [[1,0,27.68359375],[0,1,88]],
  },
  {
    name: 'iris', src: iris, order: 9,
    x: 489, y: 67, width: 389.6882629394531, height: 376.838134765625,
    imageWidth: 314.4361572265625, imageHeight: 331.1614990234375,
    transform: [[0.20950521528720856,-0.9778076410293579,333.812255859375],[0.9778076410293579,0.20950521528720856,38]],
  },
];

export default function Con11() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia(root);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const first = root.querySelectorAll('.fragrances-con11__passage--first > span');
      const second = root.querySelectorAll('.fragrances-con11__passage--second > span');
      const lines = [...first, ...second];

      // Reveal the existing lines in place; CSS retains all typography and matrices.
      gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' });
      gsap.timeline({
        defaults: { clipPath: 'inset(0 0% 0 0)', ease: 'power1.inOut' },
        scrollTrigger: {
          id: 'fragrances-con11-typography',
          trigger: root,
          start: 'center 85%',
          end: 'bottom top',
          // Fast scrolling still leaves both passages fully written on return.
          toggleActions: 'play complete none none',
          once: true,
        },
      })
        .to(first[0], { duration: 0.8 }, 0.12)
        .to(first[1], { duration: 0.8 }, '-=0.15')
        .to(second[0], { duration: 0.9 }, '+=0.4')
        .to(second[1], { duration: 0.9 }, '-=0.15')
        .set(lines, { clearProps: 'clipPath' });
    });

    // Revert only Con11's animations and trigger, also on reduced-motion changes.
    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} className="fragrances-con11" aria-label="Orphéon — 우리의 이야기가 시작되는 페이지">
      <div className="fragrances-con11__scene">
        {layers.map(({ name, src, order, x, y, width, height, imageWidth, imageHeight, transform }) => (
          <div
            key={name}
            className={`fragrances-con11__layer fragrances-con11__layer--${name}`}
            style={{ left: `${x / 1920 * 100}%`, top: `${y / 1080 * 100}%`, width: `${width / 1920 * 100}%`, height: `${height / 1080 * 100}%`, zIndex: order }}
          >
            <div
              className="fragrances-con11__object"
              style={{
                left: `${transform[0][2] / width * 100}%`,
                top: `${transform[1][2] / height * 100}%`,
                width: `${imageWidth / width * 100}%`,
                height: `${imageHeight / height * 100}%`,
                transform: `matrix(${transform[0][0]}, ${transform[1][0]}, ${transform[0][1]}, ${transform[1][1]}, 0, 0)`,
              }}
            >
              <img className="fragrances-con11__image" src={src} alt={name === 'main-book' ? '춤추는 연인과 파리의 풍경이 담긴 책의 한 페이지가 펼쳐져 있습니다.' : ''} width={imageWidth} height={imageHeight} draggable="false" />
            </div>
          </div>
        ))}
        <div className="fragrances-con11__text">
          <p className="fragrances-con11__passage fragrances-con11__passage--first">
            <span>{'Our tales begin '}</span>
            <span>right here,</span>
          </p>
          <p className="fragrances-con11__passage fragrances-con11__passage--second">
            <span>and the pages are</span>
            <span>ours to write.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
