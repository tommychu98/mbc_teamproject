import { Link } from 'react-router-dom';
import OrdersNav from '../OrdersNav/OrdersNav';
import './ReturnsRefunds.css';

const navigation = [
  ['MY PAGE', '/mypage'],
  ['PROFILE', '/mypage/profile'],
  ['MY ORDERS', '/mypage/orders/history'],
  ['COMMUNITY', '/mypage/posts'],
];

const steps = [
  ['신청', '신청 전 주문 상태와 취소·반품·교환 가능 여부를 확인합니다.'],
  ['확인', '신청 내용과 상품 상태를 확인하는 단계입니다.'],
  ['완료', '취소·환불 또는 교환 결과를 확인하는 단계입니다.'],
];

export default function ReturnsRefunds() {
  return (
    <main className="returns-refunds">
      <header className="returns-refunds__header">
        <h1 className="returns-refunds__title">My Page</h1>
        <nav className="returns-refunds__navigation" aria-label="마이페이지 메뉴">
          {navigation.map(([label, to]) => (
            <Link className="returns-refunds__nav-link" key={label} to={to} aria-current={label === 'MY ORDERS' ? 'page' : undefined}>
              <span className="returns-refunds__nav-sizer" aria-hidden="true">{label}</span>
              <span className="returns-refunds__nav-label">{label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <OrdersNav active="returns" />

      <section className="returns-refunds__intro" aria-labelledby="returns-intro">
        <p className="returns-refunds__eyebrow">CANCEL · RETURN · EXCHANGE</p>
        <h2 id="returns-intro">취소, 반품 및 교환 현황을 확인하세요.</h2>
        <p className="returns-refunds__description">신청 가능한 주문과 현재 처리 진행 상태를 한 곳에서 확인하세요.</p>
      </section>

      {/* No order or claim data source exists in this branch; show the empty state. */}
      <dl className="returns-refunds__summary" aria-label="취소·반품·교환 현황">
        {['신청 가능', '처리 중', '처리 완료'].map((label) => (
          <div key={label}><dt>{label}</dt><dd>0</dd></div>
        ))}
      </dl>

      <section className="returns-refunds__section" aria-labelledby="returns-eligible">
        <div className="returns-refunds__section-heading">
          <h2 id="returns-eligible">신청 가능한 주문</h2>
          <Link className="returns-refunds__text-link" to="/mypage/orders/history">주문 내역 확인</Link>
        </div>
        <p className="returns-refunds__empty">신청 가능한 주문이 없습니다.</p>
      </section>

      <section className="returns-refunds__section returns-refunds__section--history" aria-labelledby="returns-history">
        <div className="returns-refunds__section-heading"><h2 id="returns-history">처리 내역</h2></div>
        <p className="returns-refunds__empty">취소 · 반품 · 교환 내역이 없습니다.</p>
      </section>

      <section className="returns-refunds__process" aria-labelledby="returns-process">
        <p className="returns-refunds__eyebrow">HOW IT WORKS</p>
        <h2 id="returns-process">진행 절차 안내</h2>
        <ol className="returns-refunds__steps">
          {steps.map(([title, description], index) => (
            <li key={title}>
              <span className="returns-refunds__step-number" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
