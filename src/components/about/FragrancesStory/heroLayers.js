// Figma 2778:2093, 1920 × 1080. Array order is back to front.
// Keep source image crops and rotated bounding boxes separate.
const images = import.meta.glob('./assets/*.png', { eager: true, query: '?url', import: 'default' });

export const heroLayers = [
  {
    "name": "background",
    "x": -57,
    "y": 0,
    "width": 1977,
    "height": 1172
  },
  {
    "name": "flower-at-corner",
    "x": -223,
    "y": -279,
    "width": 814.286,
    "height": 726.958,
    "imageWidth": 721.496,
    "imageHeight": 614.785,
    "rotation": -9.64
  },
  {
    "name": "small-flower",
    "x": 1430,
    "y": 246.15,
    "width": 236.011,
    "height": 245.061,
    "imageWidth": 194.759,
    "imageHeight": 148.75,
    "rotation": -52.99
  },
  {
    "name": "stationery",
    "x": 1392,
    "y": 58,
    "width": 596.044,
    "height": 635.654,
    "imageWidth": 487.358,
    "imageHeight": 540.145,
    "rotation": 12.95
  },
  {
    "name": "books-piled-up",
    "x": 1671,
    "y": 567,
    "width": 249,
    "height": 455,
    "crop": {
      "left": "-57.37%",
      "width": "157.37%"
    }
  },
  {
    "name": "bowl",
    "x": 868,
    "y": 58,
    "width": 146,
    "height": 147,
    "crop": {
      "width": "266.41%"
    }
  },
  {
    "name": "ink",
    "x": 1392,
    "y": 145,
    "width": 108,
    "height": 120,
    "crop": {
      "height": "812.7%",
      "left": "-753.69%",
      "top": "-126.19%",
      "width": "1361.96%"
    }
  },
  {
    "name": "hidden-books",
    "x": 997,
    "y": -158,
    "width": 864,
    "height": 289
  },
  {
    "name": "flower-iris",
    "x": 1703,
    "y": 794,
    "width": 266.431,
    "height": 264.669,
    "imageWidth": 184.401,
    "imageHeight": 194.21,
    "rotation": -127.7
  },
  {
    "name": "letter",
    "x": -34,
    "y": 466,
    "width": 436,
    "height": 398
  },
  {
    "name": "smaller-pen",
    "x": 56.7,
    "y": 721.04,
    "width": 224.632,
    "height": 232.527,
    "imageWidth": 180.914,
    "imageHeight": 165.332,
    "rotation": 65.99
  },
  {
    "name": "lighter-ink",
    "x": 1227,
    "y": 36,
    "width": 201.874,
    "height": 218.336,
    "imageWidth": 168,
    "imageHeight": 189,
    "rotation": 11.34,
    "crop": {
      "height": "669.28%",
      "left": "-527.94%",
      "top": "-60.78%",
      "width": "1129.41%"
    }
  },
  {
    "name": "book-and-perfume",
    "x": 49,
    "y": 376,
    "width": 542.454,
    "height": 409.842,
    "imageWidth": 531.359,
    "imageHeight": 394.776,
    "rotation": -1.64
  },
  {
    "name": "pile-of-papers",
    "x": 1299,
    "y": 561,
    "width": 343,
    "height": 422
  },
  {
    "name": "candle",
    "x": 402,
    "y": 131,
    "width": 206.391,
    "height": 223.477,
    "imageWidth": 181.718,
    "imageHeight": 201.553,
    "rotation": -7.47
  },
  {
    "name": "scale",
    "x": 478.82,
    "y": -104.05,
    "width": 420.183,
    "height": 348.684,
    "imageWidth": 369.07,
    "imageHeight": 274.645,
    "rotation": -167.37,
    "flipY": true
  },
  {
    "name": "perfume-still",
    "x": 936,
    "y": 0,
    "width": 392,
    "height": 340
  },
  {
    "name": "main-book",
    "x": 313,
    "y": 266,
    "width": 1110,
    "height": 797
  },
  {
    "name": "hand",
    "x": 1036,
    "y": 475,
    "width": 812.858,
    "height": 693.301,
    "imageWidth": 711.648,
    "imageHeight": 555.677,
    "rotation": 12.18
  }
].map((layer) => ({
  ...layer,
  src: images[`./assets/${layer.name === 'lighter-ink' ? 'ink' : layer.name}.png`],
}));

