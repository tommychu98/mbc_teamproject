import CollectionCatalog from '../CollectionCatalog';
import { getProducts } from '../services/productService';

export default function GiftSets() {
  const products = getProducts().filter((product) => /세트|\bsets?\b/i.test(product.name));
  return <CollectionCatalog title="Gift Sets" products={products} />;
}
