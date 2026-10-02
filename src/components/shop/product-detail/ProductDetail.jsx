import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCartStore } from '../../../store/useCartStore';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { useRecentlyViewedStore } from '../../../store/useRecentlyViewedStore';
import { formatPrice } from '../../../utils/formatPrice';
import minusIcon from './assets/minus.svg';
import plusIcon from './assets/plus.svg';
import heartIcon from './assets/heart.svg';
import './ProductDetail.css';
import { resolveShopProduct } from '../shopProducts';
const EMPTY_WISHLIST = [];
import { DISPLAY_NAMES } from '../data/products/fragranceDisplayNames';
const nameOf = (p) => p.name.replace(/^오 드 (퍼퓸|뚜왈렛)\s*/, '').replace(/\s*\d+(?:\.\d+)?\s*ml\s*$/i, '');
const sizeOf = (p) => p.name.match(/\d+(?:\.\d+)?\s*ml/i)?.[0] ?? '';
export default function ProductDetailPage() {
  const { productId } = useParams();
  const product = resolveShopProduct(getProductById(productId));
  return product ? <ProductDetailContent key={product.id} product={product} /> : <Navigate to="/not-found" replace />;
}
function ProductDetailContent({ product: initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const ids = useWishlistStore((s) => s.byUser[user?.id] ?? EMPTY_WISHLIST);
  const toggle = useWishlistStore((s) => s.toggle);
  const addRecently = useRecentlyViewedStore((s) => s.add);
  useEffect(() => { if (isAuthenticated) addRecently(user.id, product.id); }, [addRecently, isAuthenticated, product.id, user]);
  const liked = ids.includes(product.id);
  const handleLike = () => isAuthenticated ? toggle(user.id, product.id) : navigate('/login', { state: { from: `/products/${product.id}` } });
  const name = nameOf(product);
  const size = product.category === '오 드 퍼퓸' ? '75ml' : sizeOf(product);
  const variants = getProducts().filter((p) => p.catalogCategory === product.catalogCategory && p.category === product.category && nameOf(p) === name);
  const sizes = product.category === '오 드 퍼퓸'
    ? ['75ml']
    : [...new Set(variants.map(sizeOf).filter(Boolean))].sort((a, b) => parseFloat(a) - parseFloat(b));
  const type = product.category === '오 드 퍼퓸' ? 'EDP' : product.category === '오 드 뚜왈렛' ? 'EDT' : product.subtitle;
  const { price, currency } = product;
  const displayPrice = (amount) => currency === 'KRW' ? `₩ ${amount.toLocaleString('ko-KR')}` : formatPrice(amount, currency);
  const description = product.description;
  const handleImageError = (event) => { if (event.currentTarget.dataset.fallbackApplied) return; event.currentTarget.dataset.fallbackApplied = 'true'; event.currentTarget.src = '/images/placeholders/product-fallback.svg'; };
  return <main className={`product-detail${product.collection === 'les-rituels-de-soin' ? ' product-detail--rituels' : ''}`}><div className="product-detail__layout">
    <div className="product-detail__gallery"><div className="product-detail__thumbnails" aria-label="상품 이미지 선택">{[0,1].map((index) => <button key={index} type="button" className={`product-detail__thumbnail ${view === index ? 'product-detail__thumbnail--active' : ''}`} aria-label={index === 0 ? '상품 전체 이미지' : '상품 확대 이미지'} aria-pressed={view === index} onClick={() => setView(index)}><img className={index === 1 ? 'product-detail__thumbnail-zoom' : ''} src={product.image} alt="" onError={handleImageError} /></button>)}<button className="product-detail__gallery-next" type="button" aria-label="다음 상품 이미지" onClick={() => setView((v) => (v+1)%2)}><span /></button></div><div className={`product-detail__media ${view === 1 ? 'product-detail__media--zoom' : ''}`}><img src={product.image} alt={product.name} onError={handleImageError} /></div></div>
    <div className="product-detail__content"><header className="product-detail__heading"><p className="product-detail__category">{product.catalogCategory === 'fragrances' ? 'Fragrances' : product.line || product.category}</p><h1>{product.englishName || DISPLAY_NAMES[name] || name}</h1><p className="product-detail__subtitle">{name}</p><div className="product-detail__meta"><span>{type} {size}</span><span>{displayPrice(price)}</span></div></header><p className="product-detail__story">{description}</p>
    <div className="product-detail__purchase">{sizes.length > 0 && <fieldset className="product-detail__sizes"><legend>용량</legend><div>{sizes.map((option) => {
      const variant = variants.find((p) => sizeOf(p) === option);
      return <button key={option} type="button" aria-pressed={size === option} onClick={() => {
        if (!variant || variant.id === product.id) return;
        setProduct(variant);
        setView(0);
        setAdded(false);
      }}>{option}</button>;
    })}</div></fieldset>}
    <div className="product-detail__quantity" aria-label="수량"><button type="button" aria-label="수량 줄이기" disabled={quantity === 1} onClick={() => { setQuantity((v) => Math.max(1,v-1)); setAdded(false); }}><img src={minusIcon} alt="" /></button><output aria-live="polite">{quantity}</output><button type="button" aria-label="수량 늘리기" disabled={quantity === 10} onClick={() => { setQuantity((v) => Math.min(10,v+1)); setAdded(false); }}><img src={plusIcon} alt="" /></button></div>
    <button className="product-detail__cart" type="button" onClick={() => { addItem({ ...product, price, currency }, quantity); setAdded(true); }}>장바구니 담기 | {displayPrice(price * quantity)}</button><button className="product-detail__wish" type="button" aria-pressed={liked} onClick={handleLike}><img src={heartIcon} alt="" />{liked ? '관심상품 추가됨' : '관심상품 추가'}</button><p className="product-detail__feedback" role="status">{added ? '장바구니에 담았습니다.' : ''}</p></div>
    <div className="product-detail__accordions"><details><summary>제품 정보<img src={plusIcon} alt="" /></summary><p>{product.name}<br />{product.subtitle}<br />원료의 개성과 조향사의 기억이 만나 하나의 후각적 풍경을 완성합니다.</p></details><details><summary>향 노트<img src={plusIcon} alt="" /></summary><p>{product.notes || product.color || '상세 향 노트는 상품 안내를 확인해 주세요.'}</p></details><details><summary>배송 및 교환/환불<img src={plusIcon} alt="" /></summary><p>무료 기본 배송과 수령 후 14일 이내 반품을 지원합니다.</p></details></div></div>
  </div></main>;
}
