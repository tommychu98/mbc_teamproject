import { useState } from 'react';
import OrdersNav from '../OrdersNav/OrdersNav';
import './OrderHistory.css';

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
      <OrdersNav active="history" />

      <section className="order-history__content" aria-label="주문 내역">
        <div className="order-history__intro">
          <p className="order-history__eyebrow">ORDER HISTORY</p>
          <h2>주문 내역을 확인하세요.</h2>
          <p className="order-history__description">기간을 설정하여 주문 내역을 조회할 수 있습니다.</p>
        </div>
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
