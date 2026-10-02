import CollectionCatalog from '../CollectionCatalog';
import { getProducts } from '../services/productService';

export default function LesRituelsDeSoin() {
  const products = getProducts().filter((product) => product.collection === 'les-rituels-de-soin');
  return <CollectionCatalog title="Les Rituels de Soin" products={products} note="국내 판매가 미확인 상품은 2026.10.02 기준 원화 환산가입니다." />;
}
