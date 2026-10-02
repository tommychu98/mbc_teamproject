import { getProductById, getProducts } from './services/productService';
import { AUTUMN_SCENTS_PRODUCTS } from './data/products/autumnScents';

// Reuse the catalog identity for collection entries of the same product.
export function resolveShopProduct(product) {
  return product?.priceSourceProductId
    ? getProductById(product.priceSourceProductId) || product
    : product;
}

export function getSearchProducts() {
  const products = new Map(getProducts().map((product) => [product.id, product]));
  for (const entry of AUTUMN_SCENTS_PRODUCTS) {
    const product = resolveShopProduct(entry);
    if (!products.has(product.id)) products.set(product.id, product);
  }
  return [...products.values()];
}

export function normalizeCartItems(items) {
  const merged = new Map();
  for (const item of items) {
    const current = getProductById(item.id) || item;
    const product = resolveShopProduct(current);
    const normalized = product.id !== item.id ? { ...product, quantity: item.quantity } : item;
    const previous = merged.get(normalized.id);
    merged.set(normalized.id, previous
      ? { ...previous, quantity: previous.quantity + normalized.quantity }
      : normalized);
  }
  return [...merged.values()];
}
