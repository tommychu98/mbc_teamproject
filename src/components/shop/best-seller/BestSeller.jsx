import CollectionCatalog from '../CollectionCatalog';
import { getProducts } from '../services/productService';
import { BEST_SELLER_NAMES, BEST_SELLER_DATE } from '../data/products/bestSellers';
import './BestSeller.css';

export default function BestSeller() {
  const catalog = getProducts();
  const products = BEST_SELLER_NAMES.map((name, index) => {
    const product = catalog.find((item) => item.name === name);
    return product ? { ...product, bestSellerRank: index + 1 } : null;
  }).filter(Boolean);

  return <CollectionCatalog
    title="Best Sellers"
    products={products}
    ranked
    note={`신세계V 인기상품순 TOP 20 · ${BEST_SELLER_DATE} 기준`}
  />;
}
