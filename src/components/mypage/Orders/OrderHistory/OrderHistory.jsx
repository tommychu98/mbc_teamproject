import { useState } from 'react';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

const orderLinks = [
  ['주문 내역', '/mypage/orders/history'],
  ['취소·반품·교환', '/mypage/orders/returns-refunds'],
  ['배송조회', '/mypage/orders/track'],
  ['결제수단', '/mypage/orders/payment-methods'],
];
const periods = ['오늘', '7일', '15일', '1개월', '3개월', '1년'];

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getRange(period) {
  const end = new Date();
  const start = new Date(end);
  if (period === '7일' || period === '15일') {
    start.setDate(start.getDate() - (period === '7일' ? 6 : 14));
  } else if (period !== '오늘') {
    const day = start.getDate();
    start.setDate(1);
    start.setMonth(start.getMonth() - (period === '1개월' ? 1 : period === '3개월' ? 3 : 12));
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    start.setDate(Math.min(day, lastDay));
  }
  return { start: formatDate(start), end: formatDate(end) };
}

export default function OrderHistory() {
  const [period, setPeriod] = useState('3개월');
  const [range, setRange] = useState(() => getRange('3개월'));
  const [submittedRange, setSubmittedRange] = useState(null);

  function selectPeriod(value) {
    setPeriod(value);
    setRange(getRange(value));
    setSubmittedRange(null);
  }

  function changeDate(key, value) {
    setPeriod(null);
    setRange((current) => ({ ...current, [key]: value }));
    setSubmittedRange(null);
  }

  function handleSearch(event) {
    event.preventDefault();
    // No order API is connected yet; keep the selected range as local UI state.
    setSubmittedRange({ ...range });
  }

  return (
    <main className="order-history">
      <header className="order-history__header">
        <h1 className="order-history__title">My Page</h1>
        <nav className="order-history__navigation" aria-label="마이페이지 메뉴">
          {[
            ['MY PAGE', '/mypage'],
            ['PROFILE', '/mypage/profile'],
            ['MY ORDERS', '/mypage/orders/history'],
            ['COMMUNITY', null],
          ].map(([label, to]) => {
            const Item = to ? Link : 'span';
            const itemProps = to ? { to } : { role: 'link', tabIndex: 0, 'aria-disabled': true };
            return (
              <Item className="order-history__nav-link" key={label} {...itemProps} aria-current={label === 'MY ORDERS' ? 'page' : undefined}>
                <span className="order-history__nav-sizer" aria-hidden="true">{label}</span>
                <span className="order-history__nav-label">{label}</span>
              </Item>
            );
          })}
        </nav>
      </header>

      <nav className="order-history__tabs" aria-label="주문 메뉴">
        {orderLinks.map(([label, to], index) => (
          <Link key={to} className="order-history__tab" to={to} aria-current={index === 0 ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>

      <section className="order-history__content" aria-label="주문 내역">
        <form className="order-history__filter" onSubmit={handleSearch}>
          <fieldset className="order-history__periods">
            <legend className="order-history__legend">조회기간</legend>
            <div className="order-history__presets">
              {periods.map((value) => (
                <button className="order-history__period" key={value} type="button" aria-pressed={period === value} onClick={() => selectPeriod(value)}>{value}</button>
              ))}
            </div>
          </fieldset>
          <div className="order-history__dates">
            <label className="order-history__date"><span>시작일</span><input type="date" required value={range.start} max={range.end || formatDate(new Date())} onChange={(event) => changeDate('start', event.target.value)} /></label>
            <span className="order-history__separator" aria-hidden="true">~</span>
            <label className="order-history__date"><span>종료일</span><input type="date" required value={range.end} min={range.start} max={formatDate(new Date())} onChange={(event) => changeDate('end', event.target.value)} /></label>
            <button className="order-history__search" type="submit">조회</button>
          </div>
        </form>
        <div className="order-history__empty" role="status">
          {submittedRange && <p className="order-history__range">{submittedRange.start} ~ {submittedRange.end}</p>}
          <p>주문 내역이 없습니다.</p>
        </div>
      </section>
    </main>
  );
}
