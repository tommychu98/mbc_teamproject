import { useId } from 'react';
import CommunityNav from '../CommunityNav/CommunityNav';
import './ProductInquiry.css';

export default function ProductInquiry() {
  const instanceId = useId();

  return (
    <main className="mypage-product-inquiry">
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
