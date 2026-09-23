import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus } from 'lucide-react';
import { getProductById } from '../../../services/productService';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCartStore } from '../../../store/useCartStore';
import { useWishlistStore } from '../../../store/useWishlistStore';
import { useRecentlyViewedStore } from '../../../store/useRecentlyViewedStore';
import './ProductDetail.css';

const EMPTY_WISHLIST = [];

export default function ProductDetailPage() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const ids = useWishlistStore((state) => state.byUser[user?.id] ?? EMPTY_WISHLIST);
  const toggle = useWishlistStore((state) => state.toggle);
  const addRecently = useRecentlyViewedStore((state) => state.add);
  useEffect(() => { if (product && isAuthenticated) addRecently(user.id, product.id); }, [addRecently, isAuthenticated, product, user]);
  if (!product) return <Navigate to="/not-found" replace />;
  const liked = ids.includes(product.id);
  const handleLike = () => isAuthenticated ? toggle(user.id, product.id) : navigate('/login', { state: { from: `/products/${product.id}` } });
  return <main className="product-detail container section"><div className="product-detail__media"><img src={product.image} alt={`${product.name} ${product.subtitle}`} /></div><div className="product-detail__content"><p className="eyebrow">{product.badge || product.line}</p><h1>{product.name}</h1><p className="product-detail__subtitle">{product.subtitle}</p><p className="product-detail__price">US ${product.price}</p><p className="product-detail__story">{product.color}. 기억과 감각을 깨우는 섬세한 노트가 피부 위에서 천천히 펼쳐집니다. 메종의 자유로운 감성과 정교한 조향을 경험해 보세요.</p><div className="product-detail__quantity" aria-label="수량"><button type="button" aria-label="수량 줄이기" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus /></button><span>{quantity}</span><button type="button" aria-label="수량 늘리기" onClick={() => setQuantity((value) => Math.min(10, value + 1))}><Plus /></button></div><button className="button product-detail__cart" type="button" onClick={() => addItem(product, quantity)}>Add {quantity} to bag</button><button className="button button--secondary product-detail__wish" type="button" aria-pressed={liked} onClick={handleLike}><Heart fill={liked ? 'currentColor' : 'none'} />{liked ? 'Saved' : 'Add to favorites'}</button><details><summary>Story & Savoir-Faire</summary><p>원료의 개성과 조향사의 기억이 만나 하나의 후각적 풍경을 완성합니다.</p></details><details><summary>Delivery & Returns</summary><p>무료 기본 배송과 수령 후 14일 이내 반품을 지원합니다.</p></details></div></main>;
}
