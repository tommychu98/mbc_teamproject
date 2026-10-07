import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductGrid from './product-line/fragrances/ProductGrid';
import './Shop.css';
import CatalogPagination from './CatalogPagination';
import useCatalogPageSize from './useCatalogPageSize';

export default function CollectionCatalog({ title, products, note, ranked = false }) {
  const [sort, setSort] = useState('recommended');
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = useCatalogPageSize();
  const categories = [...new Set(products.map((product) => product.category))];
  const visible = products.filter((product) => !category || product.category === category);
  if (sort === 'price-asc') visible.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') visible.sort((a, b) => b.price - a.price);
  if (sort === 'new') visible.sort((a, b) => Number(/new/i.test(b.badge)) - Number(/new/i.test(a.badge)));

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageProducts = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return <main className="shop-page shop-page--catalog">
    <div className="shop-page__container">
      <header className="shop-page__catalog-header">
        <div className="shop-page__heading-row"><h1 className="shop-page__catalog-title">{title}</h1></div>
      </header>
      <section className="shop-page__catalog" aria-label={`${title} 상품 목록`}>
        <div className="shop-page__toolbar">
          <p className="shop-page__result-count" aria-live="polite">{ranked && 'TOP 20 · '}총 <strong>{visible.length}</strong>개의 상품이 있습니다.</p>
          <button className="shop-page__filter-button" type="button" aria-label="상품 필터 열기" aria-expanded={filterOpen} aria-controls="collection-filter" onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal aria-hidden="true" /></button>
          <div className="shop-page__sort" aria-label="상품 정렬">
            {[...(!ranked ? [['new', '신상품']] : []), ['recommended', ranked ? '순위순' : '추천순'], ['price-desc', '높은가격'], ['price-asc', '낮은가격']].map(([value, label]) => <button key={value} type="button" className={`shop-page__sort-button ${sort === value ? 'shop-page__sort-button--active' : ''}`} aria-pressed={sort === value} onClick={() => { setSort(value); setPage(1); }}>{label}</button>)}
          </div>
        </div>
        {filterOpen && <div id="collection-filter" className="shop-page__filter-panel">
          {['', ...categories].map((value) => <button key={value} type="button" className={`shop-page__filter-option ${category === value ? 'shop-page__filter-option--active' : ''}`} aria-pressed={category === value} onClick={() => { setCategory(value); setPage(1); }}>{value || '전체'}</button>)}
        </div>}
        <ProductGrid products={pageProducts} variant="catalog" />
        {visible.length > 0 && <CatalogPagination page={currentPage} pageCount={pageCount} onChange={setPage} />}
        {note && <p className="collection-catalog__note">{note}</p>}
      </section>
    </div>
  </main>;
}
