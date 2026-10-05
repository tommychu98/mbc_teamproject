import { FRAGRANCE_PRODUCTS } from './fragranceProducts';
import { CANDLE_HOME_PRODUCTS } from './candleHomeProducts';
import { BATH_BODY_PRODUCTS } from './bathBodyProducts';
import { HOME_FRAGRANCE_PRODUCTS } from './homeFragranceProducts';
import { HOME_DECOR_PRODUCTS } from './homeDecorProducts';
import { EXCLUSIVE_PRODUCTS } from './exclusiveProducts';
import { getProductEnglishName } from './productEnglishNames';
import { getProductDescription } from './productDescriptions';
import { LES_RITUELS_DE_SOIN_PRODUCTS } from './lesRituelsDeSoinProducts';
import { BEST_SELLER_ADDITIONAL_PRODUCTS } from './bestSellers';

export const PRODUCTS = [...FRAGRANCE_PRODUCTS, ...CANDLE_HOME_PRODUCTS, ...HOME_FRAGRANCE_PRODUCTS, ...BATH_BODY_PRODUCTS, ...HOME_DECOR_PRODUCTS, ...EXCLUSIVE_PRODUCTS, ...LES_RITUELS_DE_SOIN_PRODUCTS, ...BEST_SELLER_ADDITIONAL_PRODUCTS].map((product) => ({
  ...product,
  englishName: product.englishName || getProductEnglishName(product),
  description: product.description || getProductDescription(product),
}));

export const PRODUCT_SOURCES = [
  'https://us.diptyqueparis.com/en-us/collections/all-fragrances',
  'https://us.diptyqueparis.com/en-us/collections/body-care',
  'https://us.diptyqueparis.com/en-us',
];
