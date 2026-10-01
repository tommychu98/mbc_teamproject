import { useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { useCartStore } from '../../../../../store/useCartStore';
import { useWishlistStore } from '../../../../../store/useWishlistStore';
import { formatPrice } from '../../../../../utils/formatPrice';
import './ProductCard.css';
import heartIcon from './assets/heart.svg';
import heartActiveIcon from './assets/heart-active.svg';

const EMPTY_WISHLIST = [];

export default function ProductCard({ product, onRemove, variant = 'default' }) {
  const [hoverImageFailed, setHoverImageFailed] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const ids = useWishlistStore((state) => state.byUser[user?.id] ?? EMPTY_WISHLIST);
  const toggle = useWishlistStore((state) => state.toggle);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const location = useLocation();
  const liked = ids.includes(product.id);
  const isCatalog = variant === 'catalog';
  const productHref = `/products/${product.id}`;
  const hasHoverImage = Boolean(
    !hoverImageFailed
    && product.hoverImage
    && product.hoverImage !== product.image,
  );

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
    <article className={`product-card ${isCatalog ? 'product-card--catalog' : ''} ${hasHoverImage ? 'product-card--has-hover' : ''}`}>
      <div className="product-card__media">
        <Link className="product-card__image-link" to={productHref}>
          <img
            className="product-card__image product-card__image--primary"
            src={product.image}
            alt={`${product.name} ${product.subtitle}`}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
          {hasHoverImage && <img
            className="product-card__image product-card__image--hover"
            src={product.hoverImage}
            alt=""
            loading="lazy"
            decoding="async"
            aria-hidden="true"
            onError={() => setHoverImageFailed(true)}
          />}
        </Link>
        {!isCatalog && product.badge && <span className="product-card__badge">{product.badge}</span>}
        <button className={`product-card__like ${liked ? 'product-card__like--active' : ''}`} type="button" aria-label={liked ? `${product.name} 좋아요 취소` : `${product.name} 좋아요`} aria-pressed={liked} onClick={handleLike}><img src={liked ? heartActiveIcon : heartIcon} alt="" /></button>
        {isCatalog && <button className="product-card__quick-add" type="button" aria-label={`${product.name} 장바구니 담기`} onClick={() => addItem(product)}><Plus /></button>}
        {onRemove && <button className="product-card__remove" type="button" onClick={() => onRemove(product.id)}>기록 삭제</button>}
      </div>
      <div className="product-card__body">
        <Link to={productHref}><h3>{product.name}</h3>{product.subtitle && <p>{product.subtitle}</p>}<span className="product-card__price">{formatPrice(product.price, product.currency)}</span></Link>
        {!isCatalog && <button type="button" aria-label={`${product.name} 장바구니 담기`} onClick={() => addItem(product)}><ShoppingBag /></button>}
      </div>
    </article>
  );
}
