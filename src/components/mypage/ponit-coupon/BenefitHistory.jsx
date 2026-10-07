import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, Ticket } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import './BenefitHistory.css';
import { getMembership } from './membership';
import { TEST_USER } from '../../../data/testUser';

export default function BenefitHistory({ type }) {
  const user = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState('all');
  const isPoints = type === 'points';
  const membership = getMembership(user);
  const balance = Number((isPoints ? membership?.points : membership?.coupons) ?? 0);
  const filters = isPoints
    ? [['all', '전체'], ['earned', '적립'], ['used', '사용']]
    : [['available', '사용 가능'], ['used', '사용 완료'], ['expired', '기간 만료']];
  const status = isPoints ? filter : filter === 'all' ? 'available' : filter;
  // Demo grants explain the supplied balance without inventing purchase transactions.
  const records = isPoints
    ? membership?.pointHistory ?? (user?.id === TEST_USER.id && balance > 0 ? [{ id: 'demo-points', title: '테스트 계정 기본 지급', amount: balance, status: 'earned', date: null }] : [])
    : membership?.couponHistory ?? (balance > 0 ? Array.from({ length: balance }, (_, index) => ({
        id: `demo-coupon-${index}`, title: membership?.grade === 'SIGNATURE' ? '시그니처 시즌 쿠폰' : membership?.grade === 'PRESTIGE' ? '프레스티지 시즌 쿠폰' : '에센셜 웰컴 쿠폰',
        discount: membership?.grade === 'SIGNATURE' ? '7%' : membership?.grade === 'PRESTIGE' ? '10%' : '5%',
        status: 'available', description: '리뉴얼 프로젝트용 데모 쿠폰', date: null,
      })) : []);
  const visible = records.filter((record) => status === 'all' || record.status === status);
  const Icon = isPoints ? Coins : Ticket;
  const title = isPoints ? '포인트 적립내역' : '쿠폰 내역';
  return <main className="benefit-history container">
    <header className="benefit-history__heading"><p>{isPoints ? 'MY POINTS' : 'MY COUPONS'}</p><h2>{title}</h2><span>{isPoints ? '나의 포인트 적립과 사용 내역을 확인하세요.' : '나에게 주어진 쿠폰과 혜택을 확인하세요.'}</span></header>
    <nav className="benefit-history__tabs" aria-label="포인트 및 쿠폰">
      <Link to="/mypage/points" aria-current={isPoints ? 'page' : undefined}>포인트</Link>
      <Link to="/mypage/coupons" aria-current={!isPoints ? 'page' : undefined}>쿠폰</Link>
    </nav>
    <section className="benefit-history__balance" aria-label={isPoints ? '보유 포인트' : '사용 가능한 쿠폰'}>
      <Icon size={32} strokeWidth={1.25} aria-hidden="true" />
      <div><p>{isPoints ? '사용 가능한 포인트' : '사용 가능한 쿠폰'}</p><strong>{balance.toLocaleString('ko-KR')} <small>{isPoints ? 'P' : '장'}</small></strong></div>
      <Link to="/contact/membership">멤버십 혜택 보기 &gt;</Link>
    </section>
    <section aria-label={title}>
      <div className="benefit-history__filters" role="group" aria-label="내역 필터">
        {filters.map(([value, label]) => <button key={value} type="button" aria-pressed={status === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <p className="benefit-history__count" role="status">총 {visible.length}건</p>
      {visible.length ? <ul className={`benefit-history__list${isPoints ? '' : ' benefit-history__list--coupons'}`}>
        {visible.map((record) => <li className="benefit-history__record" key={record.id}>
          <div><span className="benefit-history__status">{isPoints ? record.status === 'used' ? '사용' : '적립' : record.status === 'used' ? '사용 완료' : record.status === 'expired' ? '기간 만료' : '사용 가능'}</span><h3>{record.title}</h3><p>{record.description ?? '리뉴얼 프로젝트용 데모 포인트'}</p><small>{record.date ? <time dateTime={record.date}>{record.date}</time> : isPoints ? '지급일 정보 없음' : '유효기간 정보 없음'}</small></div>
          <strong className={record.status === 'used' ? 'benefit-history__amount--used' : ''}>{isPoints ? `${record.status === 'used' ? '−' : '+'}${Math.abs(record.amount).toLocaleString('ko-KR')} P` : record.discount}</strong>
        </li>)}
      </ul> : <div className="benefit-history__empty"><Icon size={32} strokeWidth={1} aria-hidden="true" /><p>{isPoints ? '해당하는 포인트 내역이 없습니다.' : '해당하는 쿠폰이 없습니다.'}</p></div>}
    </section>
    <aside className="benefit-history__notice"><h3>{isPoints ? '포인트 이용 안내' : '쿠폰 이용 안내'}</h3><p>{isPoints ? '포인트 잔액과 내역은 로그인한 계정을 기준으로 표시됩니다.' : '쿠폰별 할인율과 사용 조건을 확인해 주세요.'}</p><p>현재 표시되는 기본 지급 혜택은 프로젝트 데모이며 실제 결제에 사용할 수 없습니다.</p></aside>
    <Link className="benefit-history__back" to="/mypage"><ArrowLeft size={16} aria-hidden="true" /> 마이페이지로 돌아가기</Link>
  </main>;
}
