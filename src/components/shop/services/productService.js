import { PRODUCTS } from '../data/products';
import { AUTUMN_SCENTS_PRODUCTS } from '../data/products/autumnScents';

export const getProducts = ({ line, category, query } = {}) => PRODUCTS.filter((product) => {
  const matchesLine = !line || product.line === line;
  const matchesCategory = !category || product.category === category || product.categorySlug === category;
  const keyword = query?.trim().toLowerCase();
  const matchesQuery = !keyword || `${product.name} ${product.subtitle} ${product.color}`.toLowerCase().includes(keyword);
  return matchesLine && matchesCategory && matchesQuery;
});

export const getProductById = (id) => PRODUCTS.find((product) => product.id === id) || AUTUMN_SCENTS_PRODUCTS.find((product) => product.id === id);
