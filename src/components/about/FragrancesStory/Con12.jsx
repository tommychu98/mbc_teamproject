import background from './assets/background.png';
import stationery from './assets/con10-stationery.png';
import books from './assets/books-piled-up.png';
import papers from './assets/con10-papers.png';
import perfumeDrawing from './assets/con10-perfume-drawing.png';
import mainBook from './assets/con12-main-book.png';
import hands from './assets/con12-hands.png';
import whiteFlower from './assets/con10-white-flower.png';
import './Con12.css';

// Figma 2892:5486: image adjustments are baked into the local PNGs.
// Layers follow the latest Figma back-to-front order, with the flower below the book.
const layers = [
  {
    name: 'background', src: background,
    x: -57, y: 0, width: 1977, height: 1172,
    imageWidth: 1977, imageHeight: 1172,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'stationery', src: stationery,
    x: 1409.468994140625, y: 114, width: 982.572509765625, height: 1047.8681640625,
    imageWidth: 803.4044799804688, imageHeight: 890.4230346679688,
    transform: [[0.974547266960144,-0.22418206930160522,199.61688232421875],[0.22418206930160522,0.974547266960144,0]],
  },
  {
    name: 'books', src: books,
    x: 1821.83203125, y: 794.8671875, width: 410.2281188964844, height: 750.5120849609375,
    imageWidth: 410.2281188964844, imageHeight: 750.5120849609375,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'papers', src: papers,
    x: 1086, y: 789.80859375, width: 565.07891845703125, height: 696.09716796875,
    imageWidth: 565.07891845703125, imageHeight: 696.09716796875,
    transform: [[1,0,0],[0,1,0]],
  },
  {
    name: 'perfume-drawing', src: perfumeDrawing,
    x: -538.0390625, y: 280.9998779296875, width: 926.4935913085938, height: 699.995361328125,
    imageWidth: 907.5436401367188, imageHeight: 674.264404296875,
    transform: [[0.9995892643928528,0.028657495975494385,0],[-0.028657495975494385,0.9995892643928528,26.0079288482666]],
  },
  {
    name: 'white-flower', src: whiteFlower,
    x: 1456.1953125, y: 928.3300170898438, width: 311.46405029296875, height: 286.35595703125,
    imageWidth: 251.17762756347656, imageHeight: 191.84019470214844,
    transform: [[0.8862835764884949,0.46314293146133423,0],[-0.46314293146133423,0.8862835764884949,116.33114624023438]],
  },
  {
    name: 'main-book', src: mainBook,
    x: 299.99859619140625, y: -156.462890625, width: 1319.692626953125, height: 1373.341552734375,
    imageWidth: 1184.8763427734375, imageHeight: 1245.912353515625,
    transform: [[0.9934282898902893,-0.1144566684961319,142.6029815673828],[0.1144566684961319,0.9934282898902893,0]],
  },
  {
    name: 'hands', src: hands,
    x: 80, y: 301, width: 1881, height: 1254,
    imageWidth: 1881, imageHeight: 1254,
    transform: [[1,0,0],[0,1,0]],
  },

];

export default function Con12() {
  return (
    <section className="fragrances-con12" aria-label="Scent Stories — Diptyque Paris">
      <div className="fragrances-con12__scene">
        {layers.map(({ name, src, x, y, width, height, imageWidth, imageHeight, transform }, order) => (
          <div
            key={name}
            className={`fragrances-con12__layer fragrances-con12__layer--${name}`}
            style={{ left: `${x / 1920 * 100}%`, top: `${y / 1080 * 100}%`, width: `${width / 1920 * 100}%`, height: `${height / 1080 * 100}%`, zIndex: order }}
          >
            <div
              className="fragrances-con12__object"
              style={{
                left: `${transform[0][2] / width * 100}%`,
                top: `${transform[1][2] / height * 100}%`,
                width: `${imageWidth / width * 100}%`,
                height: `${imageHeight / height * 100}%`,
                transform: `matrix(${transform[0][0]}, ${transform[1][0]}, ${transform[0][1]}, ${transform[1][1]}, 0, 0)`,
              }}
            >
              <img className="fragrances-con12__image" src={src} alt={name === 'main-book' ? 'Scent Stories — Diptyque Paris 문구가 새겨진 닫힌 책.' : ''} width={imageWidth} height={imageHeight} draggable="false" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
