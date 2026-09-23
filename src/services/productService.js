import { PRODUCTS } from '../data/products';

export const getProducts = ({ line, category, query } = {}) => PRODUCTS.filter((product) => {
  const matchesLine = !line || product.line === line;
  const matchesCategory = !category || product.category === category || product.categorySlug === category;
  const keyword = query?.trim().toLowerCase();
  const matchesQuery = !keyword || `${product.name} ${product.subtitle} ${product.color}`.toLowerCase().includes(keyword);
  return matchesLine && matchesCategory && matchesQuery;
});

export const getProductById = (id) => PRODUCTS.find((product) => product.id === id);
