import { useState } from 'react';
import ProductGrid from '../product-line/fragrances/ProductGrid';
import { getSearchProducts } from '../shopProducts';
import { DISPLAY_NAMES } from '../data/products/fragranceDisplayNames';
import floral from './assets/floral.png';
import searchIcon from './assets/search.svg';
import divider from './assets/divider.svg';
import './Search.css';

const ICON_NAMES = ['오 드 퍼퓸 플레르 드 뽀 75ml', '오 드 퍼퓸 오르페옹 75ml', '오 드 뚜왈렛 롬브르 단 로 100ml', '오 드 뚜왈렛 오 데 썽 50ml'];
function searchProduct(product) {
  const scent = product.name.replace(/^오 드 (퍼퓸|뚜왈렛)\s*/, '').replace(/\s*\d+(?:\.\d+)?\s*ml\s*$/i, '');
  const english = DISPLAY_NAMES[scent];
  const size = product.name.match(/\d+(?:\.\d+)?\s*ml/i)?.[0] || '';
  return { ...product,
    displayName: english ? `${english.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())} ${size}` : product.englishName || product.name,
    displaySubtitle: product.name.startsWith('오 드 퍼퓸') ? 'Eau de parfum' : product.name.startsWith('오 드 뚜왈렛') ? 'Eau de toilette' : product.subtitle,
  };
}
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const allProducts = getSearchProducts().map(searchProduct);
  const keyword = query.trim().toLocaleLowerCase();
  const products = keyword ? allProducts.filter((product) => `${product.name} ${product.displayName} ${product.displaySubtitle} ${product.category}`.toLocaleLowerCase().includes(keyword)) : ICON_NAMES.map((name) => allProducts.find((product) => product.name === name)).filter(Boolean);
  return <main className="search-page">
    <img className="search-page__floral" src={floral} alt="" aria-hidden="true" />
    <div className="search-page__content">
      <header className="search-page__heading"><p>Find Your Scent</p><h1><span className="search-page__desktop-title">SEARCH</span><span className="search-page__mobile-title">Search</span></h1></header>
      <label className="search-page__field"><span className="sr-only">상품 검색</span><img src={searchIcon} alt="" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="향수, 캔들, 바디 케어 검색" /></label>
      <div className="search-page__divider"><img src={divider} alt="" /></div>
      <p className="search-page__count" aria-live="polite">{keyword ? `검색 결과 ${products.length}개` : 'Discover Our Icons'}</p>
      <ProductGrid products={products} />
    </div>
  </main>;
}
