import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { useCartStore } from '../../../../../store/useCartStore';
import { useWishlistStore } from '../../../../../store/useWishlistStore';
import { formatPrice } from '../../../../../utils/formatPrice';
import './ProductCard.css';
import heartIcon from './assets/heart.svg';
import heartActiveIcon from './assets/heart-active.svg';
import cartOffIcon from './assets/cart-off.svg';
import cartOnIcon from './assets/cart-on.svg';
import rankTag from './assets/rank-tag.svg';

const EMPTY_WISHLIST = [];

export default function ProductCard({ product, onRemove, variant = 'default' }) {
  const [hoverImageFailed, setHoverImageFailed] = useState(false);
  const [likeMotionId, setLikeMotionId] = useState(0);
  const { user, isAuthenticated } = useAuthStore();
  const ids = useWishlistStore((state) => state.byUser[user?.id] ?? EMPTY_WISHLIST);
  const toggle = useWishlistStore((state) => state.toggle);
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const [addFeedbackId, setAddFeedbackId] = useState(0);
  const addedTimer = useRef(null);
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const handleAddToCart = () => {
    addItem(product);
    clearTimeout(addedTimer.current);
    setJustAdded(true);
    setAddFeedbackId((value) => value + 1);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1200);
  };
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
    setLikeMotionId((value) => value + 1);
  };

  const handleImageError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return;
    event.currentTarget.dataset.fallbackApplied = 'true';
    event.currentTarget.src = '/images/placeholders/product-fallback.svg';
  };

  return (
    <article className={`product-card ${isCatalog ? 'product-card--catalog' : ''} ${hasHoverImage ? 'product-card--has-hover' : ''}`}>
      {product.bestSellerRank && <span className="product-card__rank" aria-label={`베스트셀러 ${product.bestSellerRank}위`}><img src={rankTag} alt="" /><span aria-hidden="true">{product.bestSellerRank}</span></span>}
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
        <button className={`product-card__like ${liked ? 'product-card__like--active' : ''}`} type="button" aria-label={liked ? `${product.name} 좋아요 취소` : `${product.name} 좋아요`} aria-pressed={liked} onClick={handleLike}><span key={likeMotionId} className={`product-card__heart-icon ${likeMotionId ? (liked ? 'product-card__heart-icon--liked' : 'product-card__heart-icon--unliked') : ''}`}><img src={liked ? heartActiveIcon : heartIcon} alt="" /></span></button>
        <button className="product-card__quick-add" type="button" aria-label={`${product.name} ${justAdded ? '장바구니에 담김, 추가 담기' : '장바구니 담기'}`} onClick={handleAddToCart}>
          <span key={addFeedbackId} className={`product-card__cart-icon ${justAdded ? 'product-card__cart-icon--added' : ''}`}><img src={justAdded ? cartOnIcon : cartOffIcon} alt="" /></span>
          {justAdded && <span key={`notice-${addFeedbackId}`} className="product-card__cart-feedback" aria-hidden="true">장바구니에 담았어요</span>}
        </button>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{justAdded ? `${product.name} 장바구니에 담았어요. (${addFeedbackId}회)` : ''}</span>
        {onRemove && <button className="product-card__remove" type="button" onClick={() => onRemove(product.id)}>기록 삭제</button>}
      </div>
      <div className="product-card__body">
        <Link to={productHref}><h3>{product.displayName || product.name}</h3>{product.subtitle && <p>{product.displaySubtitle || product.subtitle}</p>}<span className="product-card__price">{formatPrice(product.price, product.currency)}</span></Link>
      </div>
    </article>
  );
}
