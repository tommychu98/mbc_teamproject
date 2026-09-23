import ProductCard from '../ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products, onRemove, variant = 'default' }) {
  const className = `product-grid ${variant === 'catalog' ? 'product-grid--catalog' : ''}`;

  return products.length ? (
    <div className={className}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRemove={onRemove}
          variant={variant}
        />
      ))}
    </div>
  ) : <div className="empty-state"><p>조건에 맞는 상품이 없습니다.</p></div>;
}
