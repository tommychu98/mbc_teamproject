import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductGrid from './ProductGrid';
import { getProducts } from '../../../../services/productService';
import './Fragrances.css';

const labels = { fragrances: 'Fragrances', 'candles-home': 'Candles & Home', 'bath-body': 'Bath & Body', 'home-decor': 'Home Décor', 'best-sellers': 'Best sellers', 'new-season': 'New / Season', gifts: 'Gifts', 'eaux-de-parfum': 'Eaux de parfum', 'eaux-de-toilette': 'Eaux de toilette', 'exclusive-perfumes': 'Exclusive perfumes', 'scented-candles': 'Scented candles', 'room-sprays': 'Room sprays', 'body-care': 'Body care', 'hand-care': 'Hand care' };
const allowed = { fragrances: ['eaux-de-parfum', 'eaux-de-toilette', 'exclusive-perfumes'], 'candles-home': ['scented-candles', 'room-sprays', 'diffusers'], 'bath-body': ['body-care', 'hand-care', 'refillable-care'], 'home-decor': ['candle-holders-lids', 'stands', 'others'] };

const CATEGORIES = [
  { value: 'fragrances', label: 'Fragrances' },
  { value: 'exclusive', label: 'Exclusive' },
  { value: 'candles-home', label: 'Candles & Home' },
  { value: 'bath-body', label: 'Bath & Body' },
  { value: 'home-decor', label: 'Home Décor' },
];

const SORT_OPTIONS = [
  { value: 'new', label: '신상품' },
  { value: 'recommended', label: '추천순' },
  { value: 'price-desc', label: '높은가격' },
  { value: 'price-asc', label: '낮은가격' },
];

const FRAGRANCE_FILTERS = [
  { value: 'all', label: '전체' },
  { value: '오 드 퍼퓸', label: '오 드 퍼퓸' },
  { value: '오 드 뚜왈렛', label: '오 드 뚜왈렛' },
];

const PAGE_SIZE = 16;

function CatalogShopPage({ initialCategory = 'all' }) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('recommended');
  const [fragranceFilter, setFragranceFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const products = useMemo(() => {
    const filtered = getProducts().filter((product) => {
      const matchesCategory = category === 'all' || product.catalogCategory === category;
      const matchesFragranceType = product.catalogCategory !== 'fragrances'
        || fragranceFilter === 'all'
        || product.category === fragranceFilter;
      return matchesCategory && matchesFragranceType;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'new') return Number(b.badge === 'New') - Number(a.badge === 'New');
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'price-asc') return a.price - b.price;
      return 0;
    });
  }, [category, fragranceFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectCategory = (value) => {
    const nextCategory = category === value ? 'all' : value;
    setCategory(nextCategory);
    if (nextCategory !== 'fragrances') setFragranceFilter('all');
    setIsFilterOpen(false);
    setPage(1);
  };

  const selectFragranceFilter = (value) => {
    setCategory('fragrances');
    setFragranceFilter(value);
    setPage(1);
  };

  return (
    <main className="shop-page shop-page--catalog">
      <div className="shop-page__container">
        <header className="shop-page__catalog-header">
          <div className="shop-page__heading-row">
            <h1 className="shop-page__catalog-title">SHOP</h1>
            <nav className="shop-page__breadcrumb" aria-label="현재 위치">
              <Link to="/">Home</Link><span aria-hidden="true">›</span><span>Shop</span>
            </nav>
          </div>
          <div className="shop-page__category-tabs" aria-label="상품 카테고리">
            {CATEGORIES.map((item) => (
              <button
                key={item.value}
                className={`shop-page__category-tab ${category === item.value ? 'shop-page__category-tab--active' : ''}`}
                type="button"
                aria-pressed={category === item.value}
                onClick={() => selectCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <section className="shop-page__catalog" aria-labelledby="catalog-result-count">
          <div className="shop-page__toolbar">
            <button
              className="shop-page__filter-button"
              type="button"
              aria-label="상품 필터 열기"
              aria-expanded={isFilterOpen}
              aria-controls="catalog-filter-panel"
              onClick={() => {
                if (category !== 'fragrances') setCategory('fragrances');
                setIsFilterOpen((current) => !current);
                setPage(1);
              }}
            >
              <SlidersHorizontal aria-hidden="true" />
            </button>
            <div className="shop-page__catalog-controls">
              <p id="catalog-result-count" className="shop-page__result-count" aria-live="polite">총 <strong>{products.length}</strong>개의 상품이 있습니다.</p>
              <div className="shop-page__sort" aria-label="상품 정렬">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`shop-page__sort-button ${sort === option.value ? 'shop-page__sort-button--active' : ''}`}
                    type="button"
                    aria-pressed={sort === option.value}
                    onClick={() => { setSort(option.value); setPage(1); }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isFilterOpen && <div id="catalog-filter-panel" className="shop-page__filter-panel">
            <span className="shop-page__filter-label">향수 타입</span>
            {FRAGRANCE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                className={fragranceFilter === filter.value ? 'shop-page__filter-option shop-page__filter-option--active' : 'shop-page__filter-option'}
                type="button"
                aria-pressed={fragranceFilter === filter.value}
                onClick={() => selectFragranceFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>}

          <ProductGrid products={visibleProducts} variant="catalog" />

          {products.length > 0 && <nav className="shop-page__pagination" aria-label="상품 목록 페이지">
            <button
              className="shop-page__page-button"
              type="button"
              aria-label="이전 페이지"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`shop-page__page-button ${page === pageNumber ? 'shop-page__page-button--active' : ''}`}
                type="button"
                aria-label={`${pageNumber}페이지`}
                aria-current={page === pageNumber ? 'page' : undefined}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              className="shop-page__page-button"
              type="button"
              aria-label="다음 페이지"
              disabled={page === pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </nav>}
        </section>
      </div>
    </main>
  );
}

export default function ShopPage() {
  const { lineSlug, categorySlug } = useParams();
  const location = useLocation();
  const isCatalogRoot = location.pathname === '/shop';
  const isFragrancesCatalog = lineSlug === 'fragrances' && !categorySlug;

  if (isCatalogRoot) return <CatalogShopPage />;
  if (isFragrancesCatalog) return <CatalogShopPage initialCategory="fragrances" />;

  const last = location.pathname.split('/').filter(Boolean).at(-1);
  if (lineSlug && !allowed[lineSlug]) return <Navigate to="/shop" replace />;
  if (categorySlug && !allowed[lineSlug]?.includes(categorySlug)) return <Navigate to="/shop" replace />;
  const line = ['fragrances', 'candles-home', 'bath-body', 'home-decor'].includes(lineSlug) ? lineSlug : undefined;
  let products = getProducts({ line, category: categorySlug });
  if (last === 'best-sellers') products = getProducts().filter((item) => item.badge === 'Best-seller');
  if (last === 'new-season' || location.pathname.includes('season-recommend')) products = getProducts().filter((item) => item.badge === 'New');
  if (last === 'gifts' || last === 'gift-sets') products = getProducts().slice(0, 6);
  const title = labels[categorySlug] || labels[lineSlug] || labels[last] || 'Shop';
  return <main className="shop-page container section"><header className="shop-page__header"><p className="eyebrow">The collection</p><h1 className="page-title">{title}</h1><p>예술적 감성과 장인 정신으로 완성된 메종의 향을 탐색해 보세요.</p></header><nav className="shop-page__filters" aria-label="상품 분류"><Link to="/shop/fragrances">Fragrances</Link><Link to="/shop/candles-home">Candles & Home</Link><Link to="/shop/bath-body">Bath & Body</Link><Link to="/shop/home-decor">Home Décor</Link></nav><ProductGrid products={products} /></main>;
}
