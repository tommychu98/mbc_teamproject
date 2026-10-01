import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../product-line/fragrances/ProductGrid';
import { getProducts } from '../../../services/productService';
import './GiftSets.css';

export default function GiftSets() {
  const [sort, setSort] = useState('recommended');
  const products = useMemo(() => {
    const items = getProducts().filter((product) => /세트|\bsets?\b/i.test(product.name));
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
    return items;
  }, [sort]);

  return (
    <main className="gift-sets-shop">
      <div className="gift-sets-shop__container">
        <nav className="gift-sets-shop__breadcrumb" aria-label="현재 위치">
          <Link to="/shop">Shop</Link><span aria-hidden="true">/</span>
          <Link to="/shop/gifts">Gifts</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Gift Sets</span>
        </nav>
        <header className="gift-sets-shop__header">
          <p>The Art of Gifting</p>
          <h1>Gift Sets</h1>
          <p>소중한 순간을 위한 딥티크의 기프트 세트를 만나보세요.</p>
        </header>
        <div className="gift-sets-shop__toolbar">
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
