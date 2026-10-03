import { useRef } from 'react';
import arrowUpRight from './assets/arrow-up-right.svg';
import './WishlistEmpty.css';

export default function WishlistEmpty() {
  const historyRef = useRef(null);

  return (
    <div className="wishlist-empty">
      <div className="wishlist-empty__header">
        <div>
          <p className="wishlist-empty__kicker">WISH LIST</p>
          <h2 id="mypage-wishlist-title">관심 상품</h2>
        </div>
        <button className="mypage__text-link wishlist-empty__history" type="button" aria-controls="mypage-wishlist-empty" onClick={() => historyRef.current?.focus()}>
          전체 내역 <img src={arrowUpRight} alt="" width="14" height="14" />
        </button>
      </div>
      <p className="wishlist-empty__message" id="mypage-wishlist-empty" ref={historyRef} tabIndex={-1} role="status">관심 상품이 없습니다.</p>
    </div>
  );
}
