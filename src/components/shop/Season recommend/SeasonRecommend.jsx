import CollectionCatalog from '../CollectionCatalog';
import { AUTUMN_SCENTS_PRODUCTS } from '../data/products/autumnScents';
import { resolveShopProduct } from '../shopProducts';

export default function SeasonRecommend() {
  return <CollectionCatalog title="Season recommend" products={AUTUMN_SCENTS_PRODUCTS.map(resolveShopProduct)} note="동일 상품은 사이트에 등록된 원화 판매가를 적용했습니다. ‘원화 환산가’ 상품은 국내 공식 가격이 확인되지 않아 일본 판매가를 환산했습니다(2026.10.02, 1엔 = 8.618779원, 100원 단위 반올림)." />;
}
