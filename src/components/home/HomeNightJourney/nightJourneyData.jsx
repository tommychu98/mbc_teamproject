import fragrances from './assets/window-fragrances.png';
import candles from './assets/window-candles.png';
import body from './assets/window-body.png';
import decor from './assets/window-decor.png';
import element56 from './assets/element-56.png';
import element52 from './assets/element-52.png';
import element45 from './assets/element-45.png';
import element57 from './assets/element-57.png';
import element28 from './assets/element-28.png';
import element07 from './assets/element-07.png';
import element20 from './assets/element-20.png';
import element29 from './assets/element-29.png';
import element59 from './assets/element-59.png';
import element08 from './assets/element-08.png';
import element05 from './assets/element-05.png';
import element25 from './assets/element-25.png';
import element04 from './assets/element-04.png';
import element47 from './assets/element-47.png';
import element31 from './assets/element-31.png';
import element11 from './assets/element-11.png';
import element61 from './assets/element-61.png';
import element50 from './assets/element-50.png';
import element03 from './assets/element-03.png';
import element02 from './assets/element-02.png';
import element37 from './assets/element-37.png';
import element18 from './assets/element-18.png';
import element42 from './assets/element-42.png';

// Coordinates are the original 1920 × 1080 Figma slots. The outer rectangle
// matches the rotated layer bounds; the image keeps its original unrotated size.
const flowerAssets = new Set([element20, element29, element59, element50, element42]);
const leafAssets = new Set([element08, element03]);
const botanicalAssets = new Set([element56, element52, element45, element57, element28, element07]);
const particle = (src, x, y, width, height, rotation = 0, opacity = 0.6, imageWidth = width, imageHeight = height) => ({
    src, x, y, width, height, rotation, opacity, imageWidth, imageHeight,
    motionType: flowerAssets.has(src) ? 'flower' : leafAssets.has(src) ? 'leaf' : botanicalAssets.has(src) ? 'botanical' : 'petal',
});

export const nightJourneyPanels = [
    {
        id: '2863:8195',
        name: 'Con6',
        particles: [
            particle(element56, 1127, 260, 118.609, 102.765, 6.51, 1, 109, 91),
            particle(element52, 1213, 350, 109.328, 91.626, 25.23, 1, 94, 57),
            particle(element45, 1290, 406, 183.08, 196.208, -18.76, 1, 139, 160),
            particle(element57, 1465, 558, 136, 181, 0, 1),
            particle(element28, 1601, 649, 156.035, 148.46, 142.16, 1, 130, 87),
            particle(element07, 1733, 589, 131.69, 134.063, 43.28, 1, 66, 122),
            particle(element20, 1565, 92, 125.115, 127.592, -54.16, 0.6, 96, 85),
            particle(element29, 766, 246, 64.096, 66.253, 88.99, 0.6, 65.155, 62.958),
            particle(element59, 1059, 374, 98.13, 98.35, 46.79, 0.6, 72, 67),
            particle(element08, 354, 228, 60.819, 63.674, 92.71, 0.6, 61, 58),
            particle(element08, 1475, 882, 72.73, 70.503, -13.33, 0.6, 61, 58),
            particle(element08, 1769, 283, 80.605, 81.724, -119.7, 0.6, 61, 58),
            particle(element05, 1444, 396, 67.501, 65.255, -153.52, 0.6, 52, 47),
            particle(element05, 872, 352, 65.376, 62.497, -20.97, 0.6, 52, 47),
            particle(element25, 1134, 565, 68.839, 91.222, -102.17, 0.6, 81.944, 52.754),
            particle(element04, 1304, 568, 78.106, 86.573, -68.52, 0.6, 71, 56),
            particle(element05, 120, 929, 52, 47),
        ],
    },
    {
        id: '2863:8227',
        name: 'Con7-1',
        category: {
            number: 'CATEGORY 01', title: 'FRAGRANCES',
            description: <>Eaux de parfum , Eaux de toilette ,<br /> Exclusive Perfumes</>,
            image: fragrances, alt: 'Orphéon fragrance', href: '/shop?category=fragrances',
        },
        particles: [
            particle(element61, 207, 84, 50, 37),
            particle(element02, 698, 289, 62.136, 60.639, -52.06, 0.6, 39.433, 48.045),
            particle(element29, 500, 870, 54, 52),
            particle(element50, 1748, -19, 69, 68),
            particle(element37, 0, 528, 92.422, 86.669, -31.94, 0.6, 74, 56),
            particle(element08, 1391, 197, 55, 52, 0, 0.7),
            particle(element31, 1278, 1047, 63, 65, 0, 0.7),
            particle(element20, 816, 338, 96, 85),
            particle(element18, 1487, 745, 57.05, 63.423, -58.83, 0.6, 53.289, 34.443),
            particle(element59, 960, 724, 84, 78),
            particle(element03, 105, 985, 112, 157),
            particle(element42, 1693, 423, 54.558, 53.621, 164.12, 0.6, 44.46, 43.099),
        ],
    },
    {
        id: '2863:8216',
        name: 'Con7-2',
        category: {
            number: 'CATEGORY 02', title: 'CANDELS & HOME',
            description: <>Scented Candles , Room Sprays ,<br />All Diffusers</>,
            image: candles, alt: 'Roses candle', href: '/shop?category=candles-home',
        },
        particles: [
            particle(element47, 1202, 442, 63, 35),
            particle(element20, 463, 804, 105.727, 110.416, -64.36, 0.6, 86, 76),
            particle(element31, 1503, 914, 84.143, 83.059, 67.53, 0.6, 63, 65),
            particle(element59, 951, 576, 49, 46, 0, 0.7),
            particle(element11, 111, 222, 78.401, 80.429, -38.67, 0.6, 50, 63),
            particle(element61, 1587, 185, 50, 37),
            particle(element50, 1754, 374, 69, 68),
            particle(element03, 790, -73, 134.639, 146.697, -30.63, 0.6, 85.503, 119.857),
        ],
    },
    {
        id: '2863:8251',
        name: 'Con7-3',
        category: {
            number: 'CATEGORY 03', title: 'BATH & BODY',
            description: <>Body Care , Hand Care ,<br /><span className="night-journey__serif">Refillable </span>C<span className="night-journey__serif">are</span></>,
            image: body, alt: 'Lemon scented body care', href: '/shop?category=bath-body',
        },
        particles: [
            particle(element61, 1631, 210, 50, 37),
            particle(element42, 772, 629, 54.558, 53.621, 164.12, 0.6, 44.46, 43.099),
            particle(element50, 50, 683, 93.652, 94.004, 120.59, 0.6, 69, 68),
            particle(element47, 1185, 411, 71.185, 66.386, -38.04, 0.6, 63, 35),
            particle(element08, 352, 104, 55, 52, 0, 0.7),
            particle(element29, 1316, 903, 54, 52),
            particle(element42, 450, 316, 43.855, 45.193, 90.98, 0.6, 44.46, 43.099),
        ],
    },
    {
        id: '2863:8242',
        name: 'Con7-4',
        category: {
            number: 'CATEGORY 04', title: 'HOME DECOR',
            description: <>Candle Holder &amp; Lids , <span className="night-journey__serif">Stands</span><br /><span className="night-journey__serif">Others</span></>,
            image: decor, alt: 'Baies candle holder', href: '/shop?category=home-decor',
        },
        particles: [
            particle(element61, 951, 500, 61.384, 55.765, -152.8, 0.6, 50, 37),
            particle(element50, 1462, 896, 69, 68),
            particle(element59, 46, 370, 84, 78),
            particle(element47, 532, 744, 67.768, 70.495, 48.95, 0.6, 63, 35),
            particle(element61, 1672, 562, 48.066, 57.507, 104.1, 0.6, 50, 37),
        ],
    },
];
