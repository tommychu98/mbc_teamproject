import { useId } from 'react';
import CommunityNav from '../CommunityNav/CommunityNav';
import './Inquiry.css';

export default function Inquiry() {
  const instanceId = useId();

  return (
    <main className="mypage-inquiry">
      <CommunityNav active="inquiry" />
      <section className="mypage-inquiry__content" aria-labelledby={`${instanceId}-heading`}>
        <p className="mypage-inquiry__eyebrow">CUSTOMER CARE</p>
        <h2 id={`${instanceId}-heading`}>1:1 문의 내역을 확인하세요.</h2>
        <p className="mypage-inquiry__description">궁금한 사항을 직접 문의하실 수 있습니다.</p>

        <section className="mypage-inquiry__history" aria-labelledby={`${instanceId}-history`}>
          <div className="mypage-inquiry__history-header">
            <h3 id={`${instanceId}-history`}>문의 내역</h3>
            {/* MyPage inquiry writing will be connected when its route is available. */}
            <button className="mypage-inquiry__write" type="button" aria-disabled="true" title="문의 작성 기능은 준비 중입니다.">
              + 문의하기
            </button>
          </div>
          {/* Contact inquiry demo records are intentionally separate from MyPage inquiries. */}
          <div className="mypage-inquiry__empty">
            <p>등록된 문의가 없습니다.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
