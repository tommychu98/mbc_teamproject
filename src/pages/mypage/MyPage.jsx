import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import { getProductById } from '../../services/productService';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import { useBoardStore } from '../../store/useBoardStore';
import { useInquiryStore } from '../../store/useInquiryStore';
import './MyPage.css';

const EMPTY_IDS = [];

export default function MyPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const wishlistIds = useWishlistStore((state) => state.byUser[user.id] ?? EMPTY_IDS);
  const recentIds = useRecentlyViewedStore((state) => state.byUser[user.id] ?? EMPTY_IDS);
  const clearRecent = useRecentlyViewedStore((state) => state.clear);
  const removeRecent = useRecentlyViewedStore((state) => state.remove);
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const allPosts = useBoardStore((state) => state.posts);
  const allInquiries = useInquiryStore((state) => state.inquiries);
  const posts = useMemo(() => allPosts.filter((post) => post.userId === user.id), [allPosts, user.id]);
  const inquiries = useMemo(() => allInquiries.filter((item) => item.userId === user.id), [allInquiries, user.id]);
  const likedProducts = useMemo(() => wishlistIds.map(getProductById).filter(Boolean), [wishlistIds]);
  const recentProducts = useMemo(() => recentIds.map(getProductById).filter(Boolean), [recentIds]);

  return <main className="mypage container section">
    <section className="mypage__profile"><img src={user.profileImage} alt={`${user.name} 프로필`} /><div><p className="eyebrow">{user.grade}</p><h1>{user.name}</h1><p>{user.email}</p></div><div className="mypage__profile-actions"><Link className="button button--secondary" to="/mypage/profile">프로필 수정</Link><button className="button button--text" type="button" onClick={() => { logout(); navigate('/'); }}>로그아웃</button></div></section>
    <nav className="mypage__ia"><Link to="/mypage/orders"><strong>MY ORDERS</strong><span>주문·배송·반품 관리</span></Link><Link to="/mypage/profile"><strong>INFORMATION</strong><span>회원정보 관리</span></Link></nav>
    <section className="mypage__summary"><a href="#likes"><strong>{likedProducts.length}</strong><span>좋아요 상품</span></a><a href="#recent"><strong>{recentProducts.length}</strong><span>최근 본 상품</span></a><Link to="/cart"><strong>{cartCount}</strong><span>장바구니</span></Link><Link to="/mypage/posts"><strong>{posts.length}</strong><span>작성 게시글</span></Link><Link to="/inquiries"><strong>{inquiries.length}</strong><span>고객문의</span></Link></section>
    <ProductSection id="recent" title="최근 본 상품" products={recentProducts} onRemove={(productId) => removeRecent(user.id, productId)} action={recentProducts.length ? <button className="button button--text" type="button" onClick={() => clearRecent(user.id)}>전체 삭제</button> : null} />
    <ProductSection id="likes" title="좋아요 상품" products={likedProducts} />
  </main>;
}

function ProductSection({ id, title, products, action, onRemove }) {
  return <section className="mypage__products" id={id}><div className="mypage__section-head"><h2>{title}</h2>{action}</div>{products.length ? <ProductGrid products={products} onRemove={onRemove} /> : <div className="empty-state"><p>{title}이 없습니다.</p><Link className="button" to="/shop">컬렉션 둘러보기</Link></div>}</section>;
}
