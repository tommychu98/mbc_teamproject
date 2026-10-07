import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock3, CreditCard, Package, Truck, PackageCheck, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { TEST_USER } from '../../data/testUser';
import defaultProfileImage from './Profile/Information/assets/default-flower.svg';
import character02 from './Profile/Information/assets/flower-02.svg';
import character03 from './Profile/Information/assets/flower-03.svg';
import character04 from './Profile/Information/assets/flower-04.svg';
import character05 from './Profile/Information/assets/flower-05.svg';
import Wishlist from './Wishlist';
import './MyPage.css';

const profileAvatarImages = {
  'character-01': defaultProfileImage,
  'character-02': character02,
  'character-03': character03,
  'character-04': character04,
  'character-05': character05,
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
    { label: 'FAQ', to: '/contact/faq' },
    { label: '상품문의', to: '/mypage/community/product-inquiry' },
  ] },
];

export default function MyPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  if (!user) return null;
  const membershipInfo = { points: user.id === TEST_USER.id ? 2026 : 0, coupons: 0 };
  const avatarImage = profileAvatarImages[user.selectedAvatarId];
  const profileImage = user.profileImageType !== 'upload'
    ? avatarImage || (user.profileImage === '/images/characters/character-01.svg' ? defaultProfileImage : user.profileImage) || defaultProfileImage
    : user.profileImage || defaultProfileImage;

  return (
    <main className="mypage container">
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
                <div><dt>POINT <span>포인트</span></dt><dd><span>{membershipInfo.points.toLocaleString('ko-KR')}</span><small>P</small></dd></div>
                <div><dt>COUPON <span>쿠폰</span></dt><dd><span>{membershipInfo.coupons.toLocaleString('ko-KR')}</span><small>장</small></dd></div>
              </dl>
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
            <Wishlist userId={user.id} />
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
