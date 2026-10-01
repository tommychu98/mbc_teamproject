import { Link } from 'react-router-dom';
import './MyPageHeader.css';

const navItems = [
  { id: 'mypage', label: 'MY PAGE', to: '/mypage' },
  { id: 'profile', label: 'PROFILE', to: '/mypage/profile' },
  { id: 'orders', label: 'MY ORDERS', to: '/mypage/orders/history' },
  { id: 'community', label: 'COMMUNITY', to: '/mypage/posts' },
];

export default function MyPageHeader({ active = 'mypage' }) {
  return (
    <>
      <header className="mypage-header__heading">
        <h1 className="mypage-header__title">My Page</h1>
      </header>

      <nav className="mypage-header__nav" aria-label="마이페이지 메뉴">
        {navItems.map(({ id, label, to }) => (
          <Link
            className="mypage-header__nav-item"
            key={id}
            to={to}
            aria-current={active === id ? 'page' : undefined}
          >
            <span className="mypage-header__nav-sizer" aria-hidden="true">{label}</span>
            <span className="mypage-header__nav-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
