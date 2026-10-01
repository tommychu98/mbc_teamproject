import { useId } from 'react';
import { Link } from 'react-router-dom';
import CommunityNav from '../CommunityNav/CommunityNav';
import './ProductInquiry.css';

const navigation = [
  ['MY PAGE', '/mypage'],
  ['PROFILE', '/mypage/profile'],
  ['MY ORDERS', '/mypage/orders/history'],
  ['COMMUNITY', '/mypage/community/inquiry'],
];

export default function ProductInquiry() {
  const instanceId = useId();

  return (
    <main className="mypage-product-inquiry">
      <header className="mypage-product-inquiry__header">
        <h1 className="mypage-product-inquiry__title">My Page</h1>
        <nav className="mypage-product-inquiry__navigation" aria-label="마이페이지 메뉴">
          {navigation.map(([label, to]) => (
            <Link className="mypage-product-inquiry__nav-link" key={label} to={to} aria-current={label === 'COMMUNITY' ? 'page' : undefined}>
              <span className="mypage-product-inquiry__nav-sizer" aria-hidden="true">{label}</span>
              <span className="mypage-product-inquiry__nav-label">{label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <CommunityNav active="product" />
      <section className="mypage-product-inquiry__content" aria-labelledby={`${instanceId}-heading`}>
        <p className="mypage-product-inquiry__eyebrow">CUSTOMER CARE</p>
        <h2 id={`${instanceId}-heading`}>상품 문의 내역을 확인하세요.</h2>
        <p className="mypage-product-inquiry__description">상품에 대해 궁금한 내용을 문의하실 수 있습니다.</p>

        <section className="mypage-product-inquiry__history" aria-labelledby={`${instanceId}-history`}>
          <div className="mypage-product-inquiry__history-header">
            <h3 id={`${instanceId}-history`}>상품 문의 내역</h3>
            {/* Connect the MyPage product inquiry writing route when it is available. */}
            <button className="mypage-product-inquiry__write" type="button" aria-disabled="true" title="상품 문의 작성 기능은 준비 중입니다.">
              + 상품 문의하기
            </button>
          </div>
          {/* Contact demo inquiries are separate from MyPage product inquiry data. */}
          <div className="mypage-product-inquiry__empty">
            <p>등록된 상품 문의가 없습니다.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
