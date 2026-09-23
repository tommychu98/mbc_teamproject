import { useState } from 'react';
import { Search } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import { getProducts } from '../../services/productService';
import './SearchPage.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const products = getProducts({ query });
  return <main className="search-page container section"><p className="eyebrow">Find your scent</p><h1 className="page-title">Search</h1><label className="search-page__field"><span className="sr-only">상품 검색</span><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="향수, 캔들, 바디 케어 검색" /></label><p className="search-page__count">{products.length} products</p><ProductGrid products={products} /></main>;
}
