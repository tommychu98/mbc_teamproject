import { FRAGRANCE_PRODUCTS } from './fragranceProducts';
import { CANDLE_HOME_PRODUCTS } from './candleHomeProducts';
import { BATH_BODY_PRODUCTS } from './bathBodyProducts';
import { HOME_DECOR_PRODUCTS } from './homeDecorProducts';

const OTHER_PRODUCTS = [
  { id: 'leau-papier', name: "L'Eau Papier", subtitle: 'Eau de toilette', price: 185, line: 'fragrances', category: 'eaux-de-toilette', catalogCategory: 'exclusive', image: '/images/products/leau-papier.webp', badge: 'New', color: 'White musks' },
  { id: 'tam-dao', name: 'Tam Dao', subtitle: 'Eau de parfum', price: 230, line: 'fragrances', category: 'exclusive-perfumes', catalogCategory: 'exclusive', image: '/images/products/tam-dao.webp', badge: '', color: 'Sandalwood' },
  { id: 'tempo', name: 'Tempo', subtitle: 'Eau de parfum', price: 230, line: 'fragrances', category: 'exclusive-perfumes', catalogCategory: 'exclusive', image: '/images/products/orpheon.jpg', badge: '', color: 'Patchouli' },
  { id: 'eau-duelle', name: 'Eau Duelle', subtitle: 'Eau de parfum', price: 230, line: 'fragrances', category: 'exclusive-perfumes', catalogCategory: 'exclusive', image: '/images/products/leau-papier.webp', badge: 'Iconic', color: 'Vanilla & spices' },
];

export const PRODUCTS = [...FRAGRANCE_PRODUCTS, ...CANDLE_HOME_PRODUCTS, ...BATH_BODY_PRODUCTS, ...HOME_DECOR_PRODUCTS, ...OTHER_PRODUCTS];

export const PRODUCT_SOURCES = [
  'https://us.diptyqueparis.com/en-us/collections/all-fragrances',
  'https://us.diptyqueparis.com/en-us/collections/body-care',
  'https://us.diptyqueparis.com/en-us',
];
