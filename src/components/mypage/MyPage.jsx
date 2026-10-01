import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock3, CreditCard, Heart, Package, Truck, PackageCheck, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { PRODUCTS } from '../../data/products';
import MyPageHeader from './MyPageHeader/MyPageHeader';
import defaultProfileImage from './Profile/Information/assets/profile1.png';
import tamDaoImage from './Profile/Information/assets/tamdao.png';
import eauRoseImage from './Profile/Information/assets/eaurose.png';
import eauDesSensImage from './Profile/Information/assets/eaudessens.png';
import eauRoseHandCreamImage from './Profile/Information/assets/eaurosehandcream.png';
import './MyPage.css';

const wishlistPreview = [
  { id: 'preview-tam-dao', name: 'TAM DAO', subtitle: 'Eau de parfum', image: tamDaoImage },
  { id: 'preview-eau-des-sens', name: 'EAU DES SENS', subtitle: 'Perfumed body lotion', image: eauDesSensImage },
  { id: 'preview-eau-rose', name: 'EAU ROSE', subtitle: 'Eau de toilette', image: eauRoseImage },
  { id: 'preview-eau-rose-hand-cream', name: 'EAU ROSE', subtitle: 'Perfumed hand cream', image: eauRoseHandCreamImage },
];

const getWishlistImage = (product) => {
  if (product.id === 'tam-dao' || (product.categorySlug === 'eaux-de-parfum' && product.name.includes('탐 다오'))) return tamDaoImage;
  if (product.categorySlug === 'eaux-de-toilette' && product.name.includes('오 로즈')) return eauRoseImage;
  return product.image?.startsWith('/') && !product.image.startsWith('//') ? product.image : null;
};

const orderSteps = [
  { label: '입금 대기', icon: Clock3 },
  { label: '결제 완료', icon: CreditCard },
  { label: '상품 준비 중', icon: Package },
  { label: '배송 중', icon: Truck },
  { label: '배송 완료', icon: PackageCheck },
  { label: '구매 확정', icon: BadgeCheck },
];
const menuGroups = [
  { title: 'Profile', label: '회원 정보', links: [
    { label: 'Information', to: '/mypage/profile' },
  ] },
  { title: 'My Orders', label: '주문 정보', links: [
    { label: '결제수단', to: '/mypage/orders/payment-methods' },
    { label: '주문 내역', to: '/mypage/orders/history' },
    { label: '취소·반품·교환', to: '/mypage/orders/returns-refunds' },
    { label: '배송 조회', to: '/mypage/orders/track' },
  ] },
  { title: 'Community', label: '나의 활동', links: [
    { label: '1:1 문의', to: '/mypage/community/inquiry' },
    { label: '상품문의', to: '/mypage/community/product-inquiry' },
  ] },
];

export default function MyPage() {
  const { user, logout } = useAuthStore();
  const wishlistByUser = useWishlistStore((state) => state.byUser);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const [showAllWishlist, setShowAllWishlist] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  if (!user) return null;
  const wishlist = (wishlistByUser[user.id] || [])
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter(Boolean);
  const isWishlistPreview = wishlist.length === 0;
  const visibleWishlist = isWishlistPreview ? wishlistPreview : showAllWishlist ? wishlist : wishlist.slice(0, 4);
  const WishlistItemLink = isWishlistPreview ? 'div' : Link;
  const profileImage = user.profileImageType !== 'upload' && user.profileImage === '/images/characters/character-01.svg'
    ? defaultProfileImage : user.profileImage;

  return (
    <main className="mypage container">
      <MyPageHeader active="mypage" />

      <div className="mypage__dashboard">
        <div className="mypage__overview">
          <section className="mypage__member" aria-labelledby="mypage-member-title">
            <div className="mypage__profile">
              <img src={profileImage} alt="" width="72" height="72" />
              <div className="mypage__identity">
                <p className="mypage__kicker">{user.grade}</p>
                <h2 id="mypage-member-title">{user.name}<span>님, 반갑습니다.</span></h2>
                <p className="mypage__email">{user.email}</p>
              </div>
              <Link className="mypage__text-link" to="/mypage/profile">프로필 수정 <ArrowUpRight aria-hidden="true" size={14} /></Link>
            </div>
            <div className="mypage__benefits" id="mypage-benefits">
              <h3 className="sr-only">나의 혜택</h3>
              <dl>
                <div><dt>POINT <span>포인트</span></dt><dd><span aria-label="정보 없음">—</span><small>P</small></dd></div>
                <div><dt>COUPON <span>쿠폰</span></dt><dd><span aria-label="정보 없음">—</span><small>장</small></dd></div>
              </dl>
              <p className="mypage__note">등록된 혜택 정보가 없습니다.</p>
            </div>
          </section>

          <section className="mypage__orders" aria-labelledby="mypage-orders-title">
            <div className="mypage__panel-head">
              <div><p className="mypage__kicker">ORDER STATUS</p><h2 id="mypage-orders-title">나의 주문 현황</h2></div>
              <Link className="mypage__text-link" to="/mypage/orders/history">전체 내역 <ArrowUpRight aria-hidden="true" size={14} /></Link>
            </div>
            <ol className="mypage__order-steps">
              {orderSteps.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <Link to="/mypage/orders/history">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.25} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
          <section className="mypage__wishlist" aria-labelledby="mypage-wishlist-title">
            <div className="mypage__panel-head">
              <div><p className="mypage__kicker">WISH LIST</p><h2 id="mypage-wishlist-title">관심 상품</h2></div>
              {isWishlistPreview && <p className="mypage__wishlist-preview-note">관심상품 없음 · 상품 미리보기</p>}
              {wishlist.length > 4 && <button className="mypage__text-link" type="button" aria-expanded={showAllWishlist} aria-controls="mypage-wishlist-items" onClick={() => setShowAllWishlist((value) => !value)}>
                {showAllWishlist ? '접기' : '전체 내역'} <ArrowUpRight aria-hidden="true" size={14} />
              </button>}
            </div>
            <ul className="mypage__wishlist-items" id="mypage-wishlist-items" aria-label={isWishlistPreview ? '상품 미리보기' : '저장한 관심상품'}>
              {visibleWishlist.map((product) => (
                <li className="mypage__wishlist-item" key={product.id}>
                  <WishlistItemLink {...(!isWishlistPreview && { to: `/products/${product.id}` })}>
                    {getWishlistImage(product)
                      ? <img src={getWishlistImage(product)} alt={`${product.name} ${product.subtitle || ''}`} width="107" height="160" />
                      : <span className="mypage__wishlist-image-missing">이미지 준비 중</span>}
                    <h3>{product.name}</h3>
                    <p>{product.subtitle}</p>
                  </WishlistItemLink>
                  {!isWishlistPreview && <button className="mypage__wishlist-remove" type="button" aria-label={`${product.name} 관심 상품에서 삭제`} aria-pressed="true" onClick={() => toggleWishlist(user.id, product.id)}>
                    <Heart aria-hidden="true" size={24} fill="currentColor" strokeWidth={1.25} />
                  </button>}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mypage__account">
          <aside className="mypage__menu" aria-label="마이페이지 전체 메뉴">
            {menuGroups.map((group) => (
              <section className="mypage__menu-group" key={group.title}>
                <h2>{group.title}<span>{group.label}</span></h2>
                <ul>
                  {group.links.map(({ label, to }) => <li key={label}>
                    {to ? <Link to={to}>{label}</Link> : <span className="mypage__menu-placeholder" aria-disabled="true">{label}</span>}
                  </li>)}
                </ul>
              </section>
            ))}
          </aside>
          <div className="mypage__session">
            <button className="mypage__text-link" type="button" onClick={handleLogout}>로그아웃</button>
          </div>
        </div>
      </div>
    </main>
  );
}
