import { FRAGRANCE_PRODUCTS } from './fragranceProducts';
import { CANDLE_HOME_PRODUCTS } from './candleHomeProducts';
import { BATH_BODY_PRODUCTS } from './bathBodyProducts';
import { HOME_DECOR_PRODUCTS } from './homeDecorProducts';
import { EXCLUSIVE_PRODUCTS } from './exclusiveProducts';

export const PRODUCTS = [...FRAGRANCE_PRODUCTS, ...CANDLE_HOME_PRODUCTS, ...BATH_BODY_PRODUCTS, ...HOME_DECOR_PRODUCTS, ...EXCLUSIVE_PRODUCTS];

export const PRODUCT_SOURCES = [
  'https://us.diptyqueparis.com/en-us/collections/all-fragrances',
  'https://us.diptyqueparis.com/en-us/collections/body-care',
  'https://us.diptyqueparis.com/en-us',
];
