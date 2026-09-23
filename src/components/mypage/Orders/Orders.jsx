import { NavLink, useLocation } from 'react-router-dom';
import './Orders.css';

const sections = {
  '/mypage/orders': ['My orders', '주문 관련 메뉴를 선택해 결제 수단, 주문 내역, 반품 또는 배송 상태를 확인하세요.'],
  '/mypage/orders/payment-methods': ['Payment methods', '등록된 결제 수단이 없습니다. 결제 단계에서 안전하게 결제 수단을 추가할 수 있습니다.'],
  '/mypage/orders/history': ['Order history', '최근 주문 내역이 없습니다. 새로운 향의 컬렉션을 둘러보세요.'],
  '/mypage/orders/returns-refunds': ['Returns & refunds', '미개봉 상품은 수령 후 14일 이내 반품 신청이 가능합니다.'],
  '/mypage/orders/track': ['Track order', '주문번호를 입력하면 현재 배송 상태를 확인할 수 있습니다.'],
};

export default function OrdersPage() {
  const { pathname } = useLocation();
  const [title, text] = sections[pathname] || sections['/mypage/orders'];
  return <main className="orders-page container section"><p className="eyebrow">My page</p><h1 className="page-title">{title}</h1><div className="orders-page__layout"><nav aria-label="주문 메뉴"><NavLink to="/mypage/orders/payment-methods">Payment methods</NavLink><NavLink to="/mypage/orders/history">Order history</NavLink><NavLink to="/mypage/orders/returns-refunds">Returns & refunds</NavLink><NavLink to="/mypage/orders/track">Track order</NavLink></nav><section><h2>{title}</h2><p>{text}</p>{pathname.endsWith('/track') && <label className="field"><span className="field__label">주문번호</span><input className="field__input" placeholder="DP-20260917-001" /><button className="button" type="button">조회</button></label>}</section></div></main>;
}
