import { useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../../data/products';
import { useWishlistStore } from '../../../store/useWishlistStore';
import WishlistEmpty from '../WishlistEmpty';
import arrowUpRight from './assets/arrow-up-right.svg';
import heartActive from './assets/heart-active.svg';
import tamDaoImage from './assets/tamdao.png';
import eauDesSensImage from './assets/eaudessens.png';
import eauRoseImage from './assets/eaurose.png';
import eauRoseHandCreamImage from './assets/eaurosehandcream.png';
import './Wishlist.css';

const EMPTY_IDS = [];

function subscribeToHydration(callback) {
  const unsubscribeStart = useWishlistStore.persist.onHydrate(callback);
  const unsubscribeFinish = useWishlistStore.persist.onFinishHydration(callback);
  return () => { unsubscribeStart(); unsubscribeFinish(); };
}

function getProductPresentation(product) {
  if ((product.id === 'tam-dao' || product.name.includes('탐 다오')) && product.categorySlug === 'eaux-de-parfum') {
    return { name: 'TAM DAO', subtitle: 'Eau de parfum', image: tamDaoImage, design: true };
  }
  if (product.categorySlug === 'eaux-de-toilette' && product.name.includes('오 로즈')) {
    return { name: 'EAU ROSE', subtitle: 'Eau de toilette', image: eauRoseImage, design: true };
  }
  if (product.categorySlug === 'bath-body' && product.name.includes('오 데 썽') && product.name.includes('로션')) {
    return { name: 'EAU DES SENS', subtitle: 'Perfumed body lotion', image: eauDesSensImage, design: true };
  }
  if (product.categorySlug === 'bath-body' && product.name.includes('오 로즈') && product.name.includes('핸드크림')) {
    return { name: 'EAU ROSE', subtitle: 'Perfumed hand cream', image: eauRoseHandCreamImage, design: true };
  }
  return { name: product.displayName || product.name, subtitle: product.displaySubtitle || product.subtitle, image: product.image };
}

function WishlistItem({ product, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { name, subtitle, image, design } = getProductPresentation(product);

  return (
    <li className={`wishlist__item${design ? ' wishlist__item--design' : ''}`}>
      <Link to={`/products/${product.id}`} aria-label={`${product.name} 상세 보기`}>
        {image && !imageFailed
          ? <img className="wishlist__image" src={image} alt={product.name} width="107" height="160" onError={() => setImageFailed(true)} />
          : <span className="wishlist__image wishlist__image--missing">이미지 준비 중</span>}
        <h3>{name}</h3>
        <p>{subtitle}</p>
      </Link>
      <button className="wishlist__remove" type="button" aria-label={`${product.name} 관심 상품에서 삭제`} aria-pressed="true" onClick={() => onRemove(product.id)}>
        <img src={heartActive} alt="" width="32.5" height="29.435" />
      </button>
    </li>
  );
}

export default function Wishlist({ userId }) {
  const ids = useWishlistStore((state) => state.byUser[userId] || EMPTY_IDS);
  const toggle = useWishlistStore((state) => state.toggle);
  const hydrated = useSyncExternalStore(subscribeToHydration, useWishlistStore.persist.hasHydrated, () => false);
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef(null);
  const products = ids.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean);

  if (!hydrated) return <>
    <h2 className="sr-only" id="mypage-wishlist-title">관심 상품</h2>
    <p className="wishlist__loading" role="status" aria-busy="true">관심 상품을 불러오는 중입니다.</p>
  </>;
  if (products.length === 0) return <WishlistEmpty />;

  function viewHistory() {
    if (products.length > 4) setShowAll((value) => !value);
    else listRef.current?.focus();
  }

  function removeProduct(productId) {
    if (products.length === 1) setShowAll(false);
    toggle(userId, productId);
  }

  return (
    <div className="wishlist">
      <div className="wishlist__header">
        <div><p className="wishlist__kicker">WISH LIST</p><h2 id="mypage-wishlist-title">관심 상품</h2></div>
        <button className="mypage__text-link wishlist__history" type="button" aria-controls="mypage-wishlist-items" aria-expanded={products.length > 4 ? showAll : undefined} onClick={viewHistory}>
          {showAll && products.length > 4 ? '접기' : '전체 내역'} <img src={arrowUpRight} alt="" width="14" height="14" />
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">관심 상품 {products.length}개</p>
      <ul className="wishlist__items" id="mypage-wishlist-items" ref={listRef} tabIndex={-1} aria-label={`저장한 관심상품 ${products.length}개`}>
        {(showAll ? products : products.slice(0, 4)).map((product) => <WishlistItem key={product.id} product={product} onRemove={removeProduct} />)}
      </ul>
    </div>
  );
}
