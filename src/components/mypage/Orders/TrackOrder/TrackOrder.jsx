import { Link } from 'react-router-dom';
import OrdersNav from '../OrdersNav/OrdersNav';
import './TrackOrder.css';

const navigation = [
  ['MY PAGE', '/mypage'],
  ['PROFILE', '/mypage/profile'],
  ['MY ORDERS', '/mypage/orders/history'],
  ['COMMUNITY', '/mypage/posts'],
];

const trackingGuide = [
  ['주문번호 입력', '주문 완료 후 발급된 주문번호를 입력해주세요.'],
  ['배송 현황 확인', '조회 버튼을 통해 현재 배송 진행 상태를 확인합니다.'],
  ['배송 완료', '배송이 완료되면 최종 배송 상태를 확인할 수 있습니다.'],
];

export default function TrackOrder() {
  return (
    <main className="track-order">
      <header className="track-order__header">
        <h1 className="track-order__title">My Page</h1>
        <nav className="track-order__navigation" aria-label="마이페이지 메뉴">
          {navigation.map(([label, to]) => (
            <Link className="track-order__nav-link" key={label} to={to} aria-current={label === 'MY ORDERS' ? 'page' : undefined}>
              <span className="track-order__nav-sizer" aria-hidden="true">{label}</span>
              <span className="track-order__nav-label">{label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <OrdersNav active="tracking" />

      <section className="track-order__content" aria-labelledby="track-order-heading">
        <div className="track-order__intro">
          <p className="track-order__eyebrow">ORDER TRACKING</p>
          <h2 id="track-order-heading">배송 현황을 확인하세요.</h2>
          <p className="track-order__description">주문번호를 입력하면 현재 배송 상태를 확인할 수 있습니다.</p>
        </div>

        <div className="track-order__lookup" role="group" aria-label="배송조회">
          <label className="track-order__label" htmlFor="track-order-number">주문번호</label>
          <div className="track-order__controls">
            <input
              className="track-order__input"
              id="track-order-number"
              name="orderNumber"
              type="text"
              placeholder="DP-20260917-001"
            />
            {/* Preserve the existing UI-only button until tracking is connected. */}
            <button className="track-order__search" type="button">조회</button>
          </div>
          <p className="track-order__help">
            <span>주문번호는 주문 내역에서 확인할 수 있습니다.</span>
            <Link className="track-order__history-link" to="/mypage/orders/history">
              주문 내역 확인 <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="track-order__guide" aria-labelledby="track-order-guide-heading">
        <p className="track-order__eyebrow">TRACKING GUIDE</p>
        <h2 id="track-order-guide-heading">배송 조회 안내</h2>
        <ol className="track-order__steps">
          {trackingGuide.map(([title, description], index) => (
            <li className="track-order__step" key={title}>
              <span className="track-order__step-number" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
