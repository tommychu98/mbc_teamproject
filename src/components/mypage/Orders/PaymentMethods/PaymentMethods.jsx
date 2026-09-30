import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrdersNav from '../OrdersNav/OrdersNav';
import kakaopayIcon from './assets/kakaopay.png';
import './PaymentMethods.css';

const navigation = [
  ['MY PAGE', '/mypage'],
  ['PROFILE', '/mypage/profile'],
  ['MY ORDERS', '/mypage/orders/history'],
  ['COMMUNITY', '/mypage/posts'],
];

const methods = [
  { id: 'card', mark: null, name: '신용 / 체크카드' },
  { id: 'naver', mark: 'N', name: '네이버페이' },
  { id: 'kakao', mark: null, name: '카카오페이' },
  { id: 'toss', mark: 'toss', name: '토스페이' },
];

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <main className="payment-methods">
      <header className="payment-methods__header">
        <h1 className="payment-methods__title">My Page</h1>
        <nav className="payment-methods__navigation" aria-label="마이페이지 메뉴">
          {navigation.map(([label, to]) => (
            <Link className="payment-methods__nav-link" key={label} to={to} aria-current={label === 'MY ORDERS' ? 'page' : undefined}>
              <span className="payment-methods__nav-sizer" aria-hidden="true">{label}</span>
              <span className="payment-methods__nav-label">{label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <OrdersNav active="payment" />

      <section className="payment-methods__content" aria-labelledby="payment-methods-heading">
        <p className="payment-methods__eyebrow">PAYMENT METHODS</p>
        <div className="payment-methods__intro">
          <div>
            <h2 id="payment-methods-heading">결제수단 관리</h2>
            <p className="payment-methods__description">등록하거나 연결할 결제수단을 선택해주세요.</p>
          </div>
        </div>
        <ul className="payment-methods__list">
          {methods.map(({ id, mark, name }) => (
            <li className="payment-methods__row" key={id}>
              <span className={`payment-methods__icon payment-methods__icon--${id}`} aria-hidden="true">
                {id === 'card' ? <CreditCard strokeWidth={1.5} /> : id === 'kakao' ? <img src={kakaopayIcon} alt="" /> : <span className="payment-methods__mark">{mark}</span>}
              </span>
              <div className="payment-methods__info">
                <h3>{name}</h3>
              </div>
              <button
                className="payment-methods__add"
                type="button"
                aria-label={`${name} 추가`}
                onClick={() => setSelectedMethod(id)}
              >
                <span aria-hidden="true">+</span> 추가
              </button>
              <p className="payment-methods__feedback" role="status" aria-atomic="true">
                {selectedMethod === id ? `${name} 등록은 현재 지원하지 않습니다.` : ''}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="payment-methods__notice" aria-labelledby="payment-notice-heading">
        <p className="payment-methods__eyebrow">PAYMENT NOTICE</p>
        <h2 id="payment-notice-heading">결제 이용 안내</h2>
        <div className="payment-methods__notice-copy">
          <p>결제수단에 따라 별도의 인증 절차가 진행될 수 있습니다.</p>
          <p>결제 관련 내역은 주문 내역에서 확인할 수 있습니다.</p>
        </div>
        <div className="payment-methods__notice-action">
          <Link className="payment-methods__notice-link" to="/mypage/orders/history">
            주문 내역 확인 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
