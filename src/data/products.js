import { FRAGRANCE_PRODUCTS } from './fragranceProducts';

const OTHER_PRODUCTS = [
  { id: 'leau-papier', name: "L'Eau Papier", subtitle: 'Eau de toilette', price: 185, line: 'fragrances', category: 'eaux-de-toilette', catalogCategory: 'exclusive', image: '/images/products/leau-papier.webp', badge: 'New', color: 'White musks' },
  { id: 'tam-dao', name: 'Tam Dao', subtitle: 'Eau de parfum', price: 230, line: 'fragrances', category: 'exclusive-perfumes', catalogCategory: 'exclusive', image: '/images/products/tam-dao.webp', badge: '', color: 'Sandalwood' },
  { id: 'baies', name: 'Baies', subtitle: 'Classic candle', price: 78, line: 'candles-home', category: 'scented-candles', catalogCategory: 'candles-home', image: '/images/products/baies.webp', badge: 'Iconic', color: 'Berries & rose' },
  { id: 'room-spray', name: 'Baies Room Spray', subtitle: 'Room spray', price: 82, line: 'candles-home', category: 'room-sprays', catalogCategory: 'home-decor', image: '/images/products/room-spray.webp', badge: '', color: 'Fresh berries' },
  { id: 'hand-wash', name: 'Do Son Hand Cream', subtitle: 'Hand care', price: 50, line: 'bath-body', category: 'hand-care', catalogCategory: 'bath-body', image: '/images/products/hand-wash.webp', badge: 'Best-seller', color: 'Tuberose' },
  { id: 'body-lotion', name: 'Comforting Body Lotion', subtitle: 'Body care', price: 98, line: 'bath-body', category: 'body-care', catalogCategory: 'bath-body', image: '/images/products/body-lotion.jpg', badge: 'New', color: 'Neroli' },
  { id: 'tempo', name: 'Tempo', subtitle: 'Eau de parfum', price: 230, line: 'fragrances', category: 'exclusive-perfumes', catalogCategory: 'exclusive', image: '/images/products/orpheon.jpg', badge: '', color: 'Patchouli' },
  { id: 'eau-duelle', name: 'Eau Duelle', subtitle: 'Eau de parfum', price: 230, line: 'fragrances', category: 'exclusive-perfumes', catalogCategory: 'exclusive', image: '/images/products/leau-papier.webp', badge: 'Iconic', color: 'Vanilla & spices' },
  { id: 'feu-de-bois', name: 'Feu de Bois', subtitle: 'Classic candle', price: 78, line: 'candles-home', category: 'scented-candles', catalogCategory: 'candles-home', image: '/images/products/baies.webp', badge: 'Best-seller', color: 'Smoky woods' },
  { id: 'figuier-candle', name: 'Figuier', subtitle: 'Classic candle', price: 78, line: 'candles-home', category: 'scented-candles', catalogCategory: 'candles-home', image: '/images/products/baies.webp', badge: '', color: 'Fig tree' },
  { id: 'tubereuse-room-spray', name: 'Tubéreuse Room Spray', subtitle: 'Room spray', price: 82, line: 'candles-home', category: 'room-sprays', catalogCategory: 'candles-home', image: '/images/products/room-spray.webp', badge: 'New', color: 'Tuberose' },
  { id: 'ambre-hourglass', name: 'Ambre Hourglass Diffuser', subtitle: 'Home fragrance', price: 210, line: 'candles-home', category: 'diffusers', catalogCategory: 'home-decor', image: '/images/products/room-spray.webp', badge: '', color: 'Amber & spices' },
  { id: 'velvet-hand-lotion', name: 'Velvet Hand Lotion', subtitle: 'Hand care', price: 72, line: 'bath-body', category: 'hand-care', catalogCategory: 'bath-body', image: '/images/products/hand-wash.webp', badge: '', color: 'Immortelle floral water' },
  { id: 'revitalizing-shower-gel', name: 'Revitalizing Shower Gel', subtitle: 'Body care', price: 58, line: 'bath-body', category: 'body-care', catalogCategory: 'bath-body', image: '/images/products/body-lotion.jpg', badge: 'New', color: 'Bergamot' },
  { id: 'oval-candle-lid', name: 'Oval Candle Lid', subtitle: 'Candle accessory', price: 48, line: 'home-decor', category: 'candle-holders-lids', catalogCategory: 'home-decor', image: '/images/products/baies.webp', badge: '', color: 'Black metal' },
  { id: 'medicis-candle-stand', name: 'Médicis Candle Stand', subtitle: 'Decorative object', price: 145, line: 'home-decor', category: 'stands', catalogCategory: 'home-decor', image: '/images/products/baies.webp', badge: 'New', color: 'Antique brass' },
];

export const PRODUCTS = [...FRAGRANCE_PRODUCTS, ...OTHER_PRODUCTS];

export const PRODUCT_SOURCES = [
  'https://us.diptyqueparis.com/en-us/collections/all-fragrances',
  'https://us.diptyqueparis.com/en-us/collections/body-care',
  'https://us.diptyqueparis.com/en-us',
];
