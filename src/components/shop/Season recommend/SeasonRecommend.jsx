import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../product-line/fragrances/ProductGrid';
import { getProducts } from '../../../services/productService';
import './SeasonRecommend.css';

export default function SeasonRecommend() {
  const [sort, setSort] = useState('recommended');
  const products = useMemo(() => {
    const items = getProducts().filter((product) => product.badge === 'New');
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
    return items;
  }, [sort]);

  return (
    <main className="season-recommend-shop">
      <div className="season-recommend-shop__container">
        <nav className="season-recommend-shop__breadcrumb" aria-label="현재 위치">
          <Link to="/shop">Shop</Link><span aria-hidden="true">/</span>
          <Link to="/shop/new-season">New / Season</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Season recommend</span>
        </nav>
        <header className="season-recommend-shop__header">
          <p>Season Selection</p>
          <h1>Season recommend</h1>
          <p>계절의 분위기를 담은 향기로운 셀렉션을 만나보세요.</p>
        </header>
        <div className="season-recommend-shop__toolbar">
          <p aria-live="polite">총 {products.length}개의 상품</p>
          <label>정렬
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="recommended">추천순</option>
              <option value="price-asc">낮은 가격순</option>
              <option value="price-desc">높은 가격순</option>
            </select>
          </label>
        </div>
        <ProductGrid products={products} variant="catalog" />
      </div>
    </main>
  );
}
