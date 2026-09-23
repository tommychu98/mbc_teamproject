import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import './Header.css';

const navItems = [
  { label: 'HOME', to: '/' },
  {
    label: 'SHOP', to: '/shop', variant: 'shop', groups: [
      { label: 'Best seller', to: '/shop/best-sellers' },
      { label: 'New / Season', to: '/shop/new-season', isNew: true, items: [
        { label: 'Season recommend', to: '/shop/new-season/season-recommend' },
        { label: 'Les Rituels de Soin', to: '/shop/new-season/les-rituels-de-soin' },
      ] },
      { label: 'GIFT', to: '/shop/gifts', isNew: true, items: [
        { label: 'Gift Sets', to: '/shop/gifts/gift-sets' },
      ] },
      { label: 'Product Line', to: '/shop', isNew: true, items: [
        { label: 'Fragrances', to: '/shop/fragrances' },
        { label: 'Exclusive', to: '/shop/fragrances/exclusive-perfumes' },
        { label: 'Candles & Home', to: '/shop/candles-home' },
        { label: 'Bath & Body', to: '/shop/bath-body' },
        { label: 'Home Décor', to: '/shop/home-decor' },
      ] },
    ],
  },
  { label: 'ABOUT', to: '/about/history', groups: [
    { label: 'Diptyque History', to: '/about/history' },
    { label: 'Fragrances Story', to: '/about/fragrances-story' },
    { label: 'For The Planet', to: '/about/for-the-planet' },
  ] },
  { label: 'GALERIE', to: '/galerie' },
  { label: 'CONTACT US', to: '/contact/notices', groups: [
    { label: '공지사항', to: '/contact/notices' },
    { label: 'MEMBERSHIP', to: '/contact/membership' },
    { label: 'FAQ', to: '/contact/faq' },
    { label: '1:1 문의', to: '/inquiries' },
    { label: '상품문의', to: '/inquiries/write?category=PRODUCT' },
  ] },
  {
    label: 'MY PAGE', to: '/mypage', variant: 'mypage', groups: [
      { label: 'Profile', to: '/mypage', items: [
        { label: 'Information', to: '/mypage/profile' },
        { label: 'LOG OUT', action: 'logout', authOnly: true },
      ] },
      { label: 'MY ORDERS', to: '/mypage/orders', items: [
        { label: 'Payment Methods', to: '/mypage/orders/payment-methods' },
        { label: 'Order History', to: '/mypage/orders/history' },
        { label: 'Returns & Refunds', to: '/mypage/orders/returns-refunds' },
        { label: 'Track Order', to: '/mypage/orders/track' },
      ] },
      { label: 'COMMUNITY', to: '/inquiries', items: [
        { label: '1:1 문의', to: '/inquiries' },
        { label: 'FAQ', to: '/contact/faq' },
        { label: '상품문의', to: '/inquiries/write?category=PRODUCT' },
      ] },
    ],
  },
];

const HEADER_HIDE_DELAY = 240;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const animationFrameRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isHeaderHoveredRef = useRef(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const navigate = useNavigate();
  const closeMenu = () => setOpen(false);
  const handleLogout = () => { logout(); closeMenu(); navigate('/'); };

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const showHeader = () => {
    clearHideTimeout();
    setIsVisible(true);
  };

  const scheduleHeaderHide = () => {
    clearHideTimeout();
    if (window.scrollY === 0 || open || isHeaderHoveredRef.current) return;
    hideTimeoutRef.current = window.setTimeout(() => setIsVisible(false), HEADER_HIDE_DELAY);
  };

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (animationFrameRef.current) return;

      animationFrameRef.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const headerHeight = window.innerWidth >= 1180 ? 110 : 72;

        if (currentScrollY <= 0 || open) {
          clearHideTimeout();
          setIsVisible(true);
        } else if (currentScrollY > lastScrollYRef.current && currentScrollY > headerHeight && !isHeaderHoveredRef.current) {
          clearHideTimeout();
          setIsVisible(false);
        }

        lastScrollYRef.current = currentScrollY;
        animationFrameRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearHideTimeout();
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [open]);

  const renderMenuItem = (item) => {
    if (item.authOnly && !isAuthenticated) return null;
    if (item.action === 'logout') return <button className="header__submenu-action" type="button" onClick={handleLogout}>{item.label}</button>;
    return <Link to={item.to} onClick={closeMenu}>{item.label}</Link>;
  };

  return <>
    <div
      className="header-hover-zone"
      aria-hidden="true"
      onMouseEnter={showHeader}
      onMouseLeave={scheduleHeaderHide}
    />
    <header
      className={`header ${isVisible || open ? 'header--visible' : 'header--hidden'}`}
      onMouseEnter={() => { isHeaderHoveredRef.current = true; showHeader(); }}
      onMouseLeave={() => { isHeaderHoveredRef.current = false; scheduleHeaderHide(); }}
    >
    <div className="header__inner">
      <button className="header__menu-button" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      <Link className="header__logo" to="/" aria-label="DIPTYQUE 홈" onClick={closeMenu}><img src="/images/common/diptyque-nav-logo.png" alt="DIPTYQUE PARIS" /></Link>
      <nav className={`header__nav ${open ? 'header__nav--open' : ''}`} aria-label="주 메뉴">
        {navItems.map((item) => <div className={`header__nav-item header__nav-item--${item.variant || 'standard'}`} key={item.label}>
          <NavLink to={item.to} end={item.to === '/'} onClick={closeMenu}>{item.label}</NavLink>
          {item.groups && <div className={`header__submenu header__submenu--${item.variant || 'standard'}`}>
            {item.groups.map((group) => <section className="header__submenu-group" key={group.label}>
              <Link className="header__submenu-title" to={group.to} onClick={closeMenu}>{group.label}{group.isNew && <span>NEW</span>}</Link>
              {group.items && <div className="header__submenu-links">{group.items.map((child) => <span key={child.label}>{renderMenuItem(child)}</span>)}</div>}
            </section>)}
          </div>}
        </div>)}
        <div className="header__mobile-auth">{isAuthenticated ? <button type="button" onClick={handleLogout}>LOG OUT</button> : <><Link to="/login" onClick={closeMenu}>LOGIN</Link><Link to="/signup" onClick={closeMenu}>JOIN</Link></>}</div>
      </nav>
      <div className="header__utilities">
        <Link className="header__account" to={isAuthenticated ? '/mypage' : '/login'} aria-label={isAuthenticated ? '마이페이지' : '로그인'}>{user?.profileImage ? <img className="header__profile-image" src={user.profileImage} alt="" /> : <img src="/images/common/icon-profile.svg" alt="" />}</Link>
        <Link className="header__search" to="/search" aria-label="검색"><img src="/images/common/icon-search.svg" alt="" /></Link>
        <Link className="header__cart" to="/cart" aria-label={`장바구니 ${cartCount}개`}><img src="/images/common/icon-bag.svg" alt="" />{cartCount > 0 && <span>{cartCount}</span>}</Link>
      </div>
    </div>
    </header>
  </>;
}
