import mobileBook from './assets/mobile-ending-closed-book.png';
import StoryImage from './StoryImage';
import mobileBackground from './assets/mobile-ending-background.png';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import background from './assets/background.png';
import stationery from './assets/con10-stationery.png';
import books from './assets/books-piled-up.png';
import papers from './assets/con10-papers.png';
import whiteFlower from './assets/con10-white-flower.png';
import perfumeDrawing from './assets/con10-perfume-drawing.png';
import mainBook from './assets/con13-main-book.png';
import iris from './assets/flower-iris.png';
import './Con13.css';

gsap.registerPlugin(ScrollTrigger);

// Figma 2892:5515: exact layer geometry and back-to-front order.
// Figma image adjustments are baked into the local PNGs.
const layers = [
  {
    name: 'background', src: background,
    x: -57, y: 0, width: 1977, height: 1172,
    imageWidth: 1977, imageHeight: 1172,
    transform: [[1, 0, 0], [0, 1, 0]],
  },
  {
    name: 'stationery', src: stationery,
    x: 1409.468994140625, y: 114, width: 982.572509765625, height: 1047.8681640625,
    imageWidth: 803.4044799804688, imageHeight: 890.4230346679688,
    transform: [[0.974547266960144, -0.22418206930160522, 199.61688232421875], [0.22418206930160522, 0.974547266960144, 0]],
  },
  {
    name: 'books', src: books,
    x: 1821.83203125, y: 794.8671875, width: 410.2281188964844, height: 750.5120849609375,
    imageWidth: 410.2281188964844, imageHeight: 750.5120849609375,
    transform: [[1, 0, 0], [0, 1, 0]],
  },
  {
    name: 'papers', src: papers,
    x: 1086, y: 789.80859375, width: 565.07891845703125, height: 696.09716796875,
    imageWidth: 565.07891845703125, imageHeight: 696.09716796875,
    transform: [[1, 0, 0], [0, 1, 0]],
  },
  {
    name: 'white-flower', src: whiteFlower,
    x: 1456.1953125, y: 928.330078125, width: 311.46405029296875, height: 286.35595703125,
    imageWidth: 251.17762756347656, imageHeight: 191.84019470214844,
    transform: [[0.8862835764884949, 0.46314293146133423, 0], [-0.46314293146133423, 0.8862835764884949, 116.33114624023438]],
  },
  {
    name: 'perfume-drawing', src: perfumeDrawing,
    x: -538.0390625, y: 280.9998779296875, width: 926.4935913085938, height: 699.995361328125,
    imageWidth: 907.5436401367188, imageHeight: 674.264404296875,
    transform: [[0.9995892643928528, 0.028657495975494385, 0], [-0.028657495975494385, 0.9995892643928528, 26.0079288482666]],
  },
  {
    name: 'main-book', src: mainBook,
    x: 271.99859619140625, y: -158, width: 1319.692626953125, height: 1373.341552734375,
    imageWidth: 1184.8763427734375, imageHeight: 1245.912353515625,
    transform: [[0.9934282898902893, -0.1144566684961319, 142.6029815673828], [0.1144566684961319, 0.9934282898902893, 0]],
  },
  {
    name: 'iris', src: iris,
    x: 682.0015869140625, y: -37, width: 500.0927734375, height: 483.6020202636719,
    imageWidth: 403.5206298828125, imageHeight: 424.9844970703125,
    transform: [[0.20950521528720856, -0.9778076410293579, 415.5531005859375], [0.9778076410293579, 0.20950521528720856, 0]],
  },
];

export default function Con13() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = gsap.matchMedia(root);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const selectLayer = (name) => root.querySelector(`.fragrances-con13__layer--${name}`);
      const bookData = layers.find(({ name }) => name === 'main-book');
      const book = selectLayer(bookData.name);
      const flowerData = ['iris'].map((name) => layers.find((layer) => layer.name === name));
      const flowers = flowerData.map(({ name }) => selectLayer(name));

      // Animate outer wrappers only; the original inner matrices/crops stay intact.
      // Percentage offsets scale with the existing Figma layer dimensions.
      gsap.timeline({
        scrollTrigger: {
          id: 'fragrances-con13-ending',
          trigger: root,
          start: 'center 85%',
          end: 'bottom top',
          toggleActions: 'play complete none none',
          once: true,
        },
      })
        // Keep the book visible so it reads as a continuation of Con12.
        .fromTo(book,
          { opacity: 0.85, yPercent: 4 / bookData.height * 100 },
          { opacity: 1, yPercent: 0, duration: 1, ease: 'power3.out' })
        .set(book, { clearProps: 'transform,opacity' })
        .fromTo(flowers, {
          yPercent: (index) => -60 / flowerData[index].height * 100,
        }, {
          yPercent: 0,
          duration: 1, stagger: 0.15, ease: 'power2.out',
        }, '+=0.4')
        // Keep the existing fade timing independent of the slightly faster fall.
        .fromTo(flowers, { opacity: 0 }, {
          opacity: 1, duration: 1.19, stagger: 0.15, ease: 'power2.out',
        }, '<')
        // One small breath of lateral motion; no repeat, bounce or upward travel.
        // Percentages keep the 6px / 4px drift proportional to the artboard.
        .fromTo(flowers, {
          xPercent: (index) => (index === 0 ? -3 : 4) / flowerData[index].width * 100,
          rotation: (index) => index === 0 ? -1.5 : 1,
        }, {
          duration: 1, stagger: 0.15, ease: 'none',
          keyframes: [
            { xPercent: (index) => -6 / flowerData[index].width * 100, rotation: -1.8, duration: 0.28, ease: 'sine.inOut' },
            { xPercent: (index) => 4 / flowerData[index].width * 100, rotation: 0.65, duration: 0.44, ease: 'sine.inOut' },
            { xPercent: 0, rotation: 0, duration: 0.28, ease: 'sine.inOut' },
          ],
        }, '<')
        // Leave the ending scene at its original CSS pose, with no exit or depth.
        // Preserve the original ending time after excluding the static white flower.
        .set(flowers, { clearProps: 'transform,opacity' }, 3.45);
    });

    // Restore the static scene on reduced-motion changes and clean up only Con13.
    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} className="fragrances-con13" aria-label="Scent Stories — Diptyque Paris">
      <div className="fragrances-con13__scene">
        {layers.map(({ name, src, x, y, width, height, imageWidth, imageHeight, transform }, order) => (
          <div
            key={name}
            className={`fragrances-con13__layer fragrances-con13__layer--${name}`}
            style={{ left: `${x / 1920 * 100}%`, top: `${y / 1080 * 100}%`, width: `${width / 1920 * 100}%`, height: `${height / 1080 * 100}%`, zIndex: order }}
          >
            <div
              className="fragrances-con13__object"
              style={{
                left: `${transform[0][2] / width * 100}%`,
                top: `${transform[1][2] / height * 100}%`,
                width: `${imageWidth / width * 100}%`,
                height: `${imageHeight / height * 100}%`,
                transform: `matrix(${transform[0][0]}, ${transform[1][0]}, ${transform[0][1]}, ${transform[1][1]}, 0, 0)`,
              }}
            >
              <StoryImage mobileSrc={name === 'main-book' ? mobileBook : name === 'background' ? mobileBackground : src} className="fragrances-con13__image" src={src} alt={name === 'main-book' ? 'Scent Stories — Diptyque Paris 문구가 새겨진 닫힌 책.' : ''} width={imageWidth} height={imageHeight} draggable="false" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
