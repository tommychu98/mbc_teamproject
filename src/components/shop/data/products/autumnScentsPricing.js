import { CANDLE_HOME_PRODUCTS } from './candleHomeProducts';
import { HOME_FRAGRANCE_PRODUCTS } from './homeFragranceProducts';

// Exact product/form matches: never substitute refills, smaller candles or sets.
const EXISTING_NAMES = {
  '34 boulevard Saint Germain - Room Spray': '룸스프레이 34번가 생제르망',
  '34 boulevard Saint Germain - Hourglass Diffuser': '아워글라스 디퓨저 34번가 생제르망',
  'Ambre (Amber) - Room Spray': '룸스프레이 앰버 150ml',
  '34 boulevard Saint Germain - Medium Candle': '미디움 캔들 34번가 생제르망',
  'Temple des Mousses (Moss Temple) - Signature Candle': '프리미엄 캔들 떵플르 데 무스',
  'La Vallée du Temps (Valley of Time) - Signature Candle': '프리미엄 캔들 라 발레 듀 떵',
  'Terres Blondes (Golden Lands) - Signature Candle': '프리미엄 캔들 떼르 블롱드',
  'Santal (Sandalwood) - Classic Candle': '클래식 캔들 상탈',
  'Ambre (Amber) - Classic Candle': '클래식 캔들 앰버',
  'Vanille (Vanilla) - Classic Candle': '클래식 캔들 바닐라',
  'Oranger (Orange Tree) - Classic Candle': '클래식 캔들 오랑줴',
  'Narguilé - Classic Candle': '클래식 캔들 나르길레',
  'Feu de Bois (Wood Fire) - Very Large Candle': '베리 라지 캔들 퍼 드 부아',
  'Oud - Classic Candle': '클래식 캔들 오우드',
  'Ambre (Amber) - Medium Candle': '미디움 캔들 앰버',
  'Feu de Bois (Wood Fire) - Classic Candle': '클래식 캔들 퍼드부아',
  'Ambre (Amber) - Very Large Candle': '베리 라지 캔들 앰버',
  'Patchouli - Classic Candle': '클래식 캔들 파출리',
  'Noisetier (Hazel Tree) - Classic Candle': '클래식 캔들 누아제티에',
  'Ambre (Amber) - Large Candle': '라지 캔들 앰버',
  'Pomander - Classic Candle': '클래식 캔들 포맨더',
};

const existingProducts = [...CANDLE_HOME_PRODUCTS, ...HOME_FRAGRANCE_PRODUCTS];

const KOREAN_NAMES = {
  ...EXISTING_NAMES,
  'Ribbed candle holder - For classic candles': '클래식 캔들용 리브드 캔들 홀더',
  'Torsade candle holder - For classic candles': '클래식 캔들용 토르사드 캔들 홀더',
  '34 boulevard Saint Germain - Large Candle': '라지 캔들 34번가 생제르망',
  'Feu de Bois (Wood Fire) - Large Candle': '라지 캔들 퍼 드 부아',
  'Black Pillar candle holder - For classic candles': '클래식 캔들용 블랙 필라 캔들 홀더',
  'Black Column candle holder - For classic candles': '클래식 캔들용 블랙 컬럼 캔들 홀더',
  '34 boulevard Saint Germain - Very Large Candle': '베리 라지 캔들 34번가 생제르망',
  'Electric Diffuser - For the home': '가정용 전기 디퓨저',
  'Feu de Bois (Wood Fire) - Medium Candle': '미디움 캔들 퍼 드 부아',
  'Thé (Tea) - Classic Candle': '클래식 캔들 떼',
  'Ribbed Candle Holder with Oval Tray - For classic candles': '클래식 캔들용 타원 트레이 리브드 캔들 홀더',
  'Mousses (Moss) - Classic Candle': '클래식 캔들 무스',
  'Chêne (Oak Tree) - Classic Candle': '클래식 캔들 쉔',
  'Benjoin (Benzoin) - Classic Candle': '클래식 캔들 벤조인',
  'Cannelle (Cinnamon) - Classic Candle': '클래식 캔들 카넬',
  'Coing (Quince) - Classic Candle': '클래식 캔들 쿠앵',
  'Citrouille (Pumpkin) - Classic candle': '클래식 캔들 시트루이',
  'Mousses (Moss) and Noisetier (Hazel Tree) - Duo Set': '무스 & 누아제티에 캔들 듀오 세트',
  'Pumpkin Lid - For classic candle': '클래식 캔들용 호박 모양 리드',
};

export function applyAutumnPricing(product) {
  const existing = existingProducts.find((item) => item.name === EXISTING_NAMES[product.englishName]);
  const localizedProduct = {
    ...product,
    name: KOREAN_NAMES[product.englishName] || product.name,
    line: 'Autumn Scents',
    subtitle: 'Autumn Scents',
  };
  if (!existing) return { ...localizedProduct, priceBasis: 'converted', subtitle: 'Autumn Scents · 원화 환산가' };
  return {
    ...localizedProduct,
    name: existing.name,
    price: existing.price,
    currency: existing.currency,
    priceBasis: 'existing-catalog',
    priceSourceProductId: existing.id,
  };
}
