import { Link } from 'react-router-dom';
import './OrdersNav.css';

const links = [
  { key: 'history', label: '주문 내역', to: '/mypage/orders/history' },
  { key: 'returns', label: '취소·반품·교환', to: '/mypage/orders/returns-refunds' },
  { key: 'tracking', label: '배송조회', to: '/mypage/orders/track' },
  { key: 'payment', label: '결제수단', to: '/mypage/orders/payment-methods' },
];

export default function OrdersNav({ active }) {
  return (
    <nav className="orders-nav" aria-label="주문 메뉴">
      {links.map(({ key, label, to }) => (
        <Link key={key} className="orders-nav__tab" to={to} aria-current={active === key ? 'page' : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
