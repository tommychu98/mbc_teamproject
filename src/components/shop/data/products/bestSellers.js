import ranking from './bestSellers.source.json';

// Shinsegae V popular order (sort_type=120), captured 2026-10-02.
export const BEST_SELLER_SOURCE = 'https://www.shinsegaev.com/dispctg/initBrandGoodsCtg.siv?disp_ctg_no=010000039942&lnb_disp_ctg_no=010000039942&page_gubun=normal&outlet_page=';
export const BEST_SELLER_DATE = '2026.10.02';
export const BEST_SELLER_NAMES = ranking.map((product) => product.name);

const hairMist = ranking.find((product) => product.goodsNo === '2311005174');
export const BEST_SELLER_ADDITIONAL_PRODUCTS = [{
  id: 'shinsegae-hair-mist-2311005174',
  name: hairMist.name,
  englishName: 'FLEUR DE PEAU HAIR MIST',
  price: 103550,
  currency: 'KRW',
  image: hairMist.image,
  hoverImage: '',
  category: '헤어 미스트',
  categorySlug: 'hair-mists',
  catalogCategory: 'fragrances',
  line: 'fragrances',
  subtitle: 'Hair Mist',
  description: '머스크의 부드러운 향을 모발 위에서 즐기는 플레르 드 뽀 헤어미스트입니다. 움직임을 따라 은은하게 펼쳐지는 향이 일상에 섬세한 여운을 더합니다.',
  badge: '',
  color: '',
}];
