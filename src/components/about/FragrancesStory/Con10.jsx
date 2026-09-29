import StoryImage from './StoryImage';
import mobileBackground from './assets/mobile-ending-background.png';
import { useRef } from 'react';
import useCon10Motion from './useCon10Motion';
import background from './assets/background.png';
import stationery from './assets/con10-stationery.png';
import books from './assets/books-piled-up.png';
import papers from './assets/con10-papers.png';
import whiteFlower from './assets/con10-white-flower.png';
import letters from './assets/con10-letters.png';
import perfumeDrawing from './assets/con10-perfume-drawing.png';
import mainBook from './assets/con10-main-book.png';
import iris from './assets/flower-iris.png';
import './Con10.css';

// Figma 2892:4793: back-to-front layer order, unrotated sizes and exact transforms.
// Image exposure/saturation adjustments are baked into the Figma-provided PNGs.
const layers = [
  {
    name: 'background', src: background,
    x: -57, y: 0, width: 1977, height: 1172,
    imageWidth: 1977, imageHeight: 1172,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'stationery', src: stationery,
    x: 1415.468994140625, y: 72, width: 982.572509765625, height: 1047.8681640625,
    imageWidth: 803.4044799804688, imageHeight: 890.4230346679688,
    transform: [[0.974547266960144,-0.22418206930160522,199.61688232421875],[0.22418206930160522,0.974547266960144,0]],
  },
  {
    name: 'books', src: books,
    x: 1827.83203125, y: 752.8671875, width: 410.2281188964844, height: 750.5120849609375,
    imageWidth: 410.2281188964844, imageHeight: 750.5120849609375,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'papers', src: papers,
    x: 1092, y: 747.80859375, width: 565.07891845703125, height: 696.09716796875,
    imageWidth: 565.07891845703125, imageHeight: 696.09716796875,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'white-flower', src: whiteFlower,
    x: 1462.1953125, y: 886.3309936523438, width: 311.46405029296875, height: 286.35595703125,
    imageWidth: 251.17762756347656, imageHeight: 191.84019470214844,
    transform: [[0.8862835764884949,0.46314293146133423,0],[-0.46314293146133423,0.8862835764884949,116.33114624023438]],
  },
  {
    name: 'letters', src: letters,
    x: -526, y: 399.849609375, width: 744.25439453125, height: 680.1531982421875,
    imageWidth: 744.25439453125, imageHeight: 680.1531982421875,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'perfume-drawing', src: perfumeDrawing,
    x: -400.0390625, y: 233.9998779296875, width: 926.4935913085938, height: 699.995361328125,
    imageWidth: 907.5436401367188, imageHeight: 674.264404296875,
    transform: [[0.9995892643928528,0.028657495975494385,0],[-0.028657495975494385,0.9995892643928528,26.0079288482666]],
  },
  {
    name: 'main-book', src: mainBook,
    x: 293.3177185058594, y: 35, width: 1333.736083984375, height: 1010.3219604492188,
    imageWidth: 1207.9998779296875, imageHeight: 805,
    transform: [[0.9834883213043213,-0.18097177147865295,145.682281494140625],[0.18097177147865295,0.9834883213043213,0]],
  },
  {
    name: 'iris', src: iris,
    x: 489, y: 67, width: 389.6882629394531, height: 376.838134765625,
    imageWidth: 314.4361572265625, imageHeight: 331.1614990234375,
    transform: [[0.20950521528720856,-0.9778076410293579,323.812255859375],[0.9778076410293579,0.20950521528720856,0]],
  },
];

export default function Con10() {
  const sceneRef = useRef(null);
  useCon10Motion(sceneRef);
  return (
    <section className="fragrances-con10" aria-label="Orphéon 이야기의 마지막 장">
      <div ref={sceneRef} className="fragrances-con10__scene" role="img" aria-label="나무 책상 위 Orphéon의 춤추는 연인과 향 이야기가 담긴 펼쳐진 책. 아이리스 꽃, 향수, 편지와 문구류가 책을 둘러싸고 있습니다.">
        {layers.map(({ name, src, x, y, width, height, imageWidth, imageHeight, transform }) => (
          <div
            key={name}
            className={`fragrances-con10__layer fragrances-con10__layer--${name}`}
            style={{ left: `${x / 1920 * 100}%`, top: `${y / 1080 * 100}%`, width: `${width / 1920 * 100}%`, height: `${height / 1080 * 100}%` }}
          >
            <div
              className="fragrances-con10__object"
              style={{
                left: `${transform[0][2] / width * 100}%`,
                top: `${transform[1][2] / height * 100}%`,
                width: `${imageWidth / width * 100}%`,
                height: `${imageHeight / height * 100}%`,
                transform: `matrix(${transform[0][0]}, ${transform[1][0]}, ${transform[0][1]}, ${transform[1][1]}, 0, 0)`,
              }}
            >
              <StoryImage mobileSrc={name === 'background' ? mobileBackground : src} className="fragrances-con10__image" src={src} alt="" aria-hidden="true" width={imageWidth} height={imageHeight} draggable="false" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
