import { Heart, Plus, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { useCartStore } from '../../../../../store/useCartStore';
import { useWishlistStore } from '../../../../../store/useWishlistStore';
import './ProductCard.css';

const EMPTY_WISHLIST = [];

const formatPrice = (product) => {
  if (typeof product.price !== 'number') return product.price;
  if (product.currency === 'KRW') return `${product.price.toLocaleString('ko-KR')}원`;
  return `US $${product.price.toLocaleString('en-US')}`;
};

export default function ProductCard({ product, onRemove, variant = 'default' }) {
  const { user, isAuthenticated } = useAuthStore();
  const ids = useWishlistStore((state) => state.byUser[user?.id] ?? EMPTY_WISHLIST);
  const toggle = useWishlistStore((state) => state.toggle);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const location = useLocation();
  const liked = ids.includes(product.id);
  const isCatalog = variant === 'catalog';

  const handleLike = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: location.pathname } }); return; }
    toggle(user.id, product.id);
  };

  const handleImageError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return;
    event.currentTarget.dataset.fallbackApplied = 'true';
    event.currentTarget.src = '/images/placeholders/product-fallback.svg';
  };

  return (
    <article className={`product-card ${isCatalog ? 'product-card--catalog' : ''}`}>
      <div className="product-card__media">
        <Link className="product-card__image-link" to={`/products/${product.id}`}>
          <img
            className="product-card__image product-card__image--primary"
            src={product.image}
            alt={`${product.name} ${product.subtitle}`}
            loading="lazy"
            onError={handleImageError}
          />
          {product.hoverImage && product.hoverImage !== product.image && <img
            className="product-card__image product-card__image--hover"
            src={product.hoverImage}
            alt=""
            loading="eager"
            aria-hidden="true"
            onError={handleImageError}
          />}
        </Link>
        {!isCatalog && product.badge && <span className="product-card__badge">{product.badge}</span>}
        <button className={`product-card__like ${liked ? 'product-card__like--active' : ''}`} type="button" aria-label={liked ? `${product.name} 좋아요 취소` : `${product.name} 좋아요`} aria-pressed={liked} onClick={handleLike}><Heart fill={liked ? 'currentColor' : 'none'} /></button>
        {isCatalog && <button className="product-card__quick-add" type="button" aria-label={`${product.name} 장바구니 담기`} onClick={() => addItem(product)}><Plus /></button>}
        {onRemove && <button className="product-card__remove" type="button" onClick={() => onRemove(product.id)}>기록 삭제</button>}
      </div>
      <div className="product-card__body">
        <Link to={`/products/${product.id}`}><h3>{product.name}</h3>{!isCatalog && <p>{product.subtitle}</p>}<span className="product-card__price">{formatPrice(product)}</span></Link>
        {!isCatalog && <button type="button" aria-label={`${product.name} 장바구니 담기`} onClick={() => addItem(product)}><ShoppingBag /></button>}
      </div>
    </article>
  );
}
