import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { normalizeCartItems } from '../shopProducts';
import { useCartStore } from '../../../store/useCartStore';
import { formatPrice } from '../../../utils/formatPrice';
import { DISPLAY_NAMES } from '../data/products/fragranceDisplayNames';
import './Cart.css';
import emptyArch from './assets/empty-arch.png';
import emptyBag from './assets/empty-bag.png';

import receiptPaper from './assets/receipt-paper.png';
import receiptFloral from './assets/receipt-floral.png';
import receiptFigs from './assets/receipt-figs.png';
import minusIcon from './assets/quantity-minus.svg';
import plusIcon from './assets/quantity-plus.svg';

function cartTitle(item) {
  const name = item.name.replace(/^오 드 (퍼퓸|뚜왈렛)\s*/, '').replace(/\s*\d+(?:\.\d+)?\s*ml\s*$/i, '');
  const scent = DISPLAY_NAMES[name];
  if (!scent) return item.englishName || item.name;
  const type = item.name.startsWith('오 드 퍼퓸') ? 'Eau de parfum' : item.name.startsWith('오 드 뚜왈렛') ? 'Eau de toilette' : '';
  const size = item.name.match(/\d+(?:\.\d+)?\s*ml/i)?.[0] || '';
  return [type, scent.toLowerCase(), size].filter(Boolean).join(' ');
}

export default function CartPage() {
  const [checkoutNotice, setCheckoutNotice] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { items, removeItem, setQuantity } = useCartStore();
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const toggleItem = (id) => setSelectedIds((current) => current.includes(id)
    ? current.filter((selectedId) => selectedId !== id) : [...current, id]);
  const removeSelected = () => {
    selectedItems.forEach((item) => removeItem(item.id));
    setSelectedIds([]);
  };
  useEffect(() => {
    const normalized = normalizeCartItems(items);
    if (normalized.length !== items.length || normalized.some((item, index) => item !== items[index])) {
      useCartStore.setState({ items: normalized });
    }
  }, [items]);
  const totals = selectedItems.reduce((result, item) => {
    const currency = item.currency || 'USD';
    result[currency] = (result[currency] || 0) + item.price * item.quantity;
    return result;
  }, {});
  const subtotalEntries = selectedItems.length > 0
    ? Object.entries(totals)
    : [[items[0]?.currency || 'USD', 0]];
  if (items.length === 0) return (
    <main className="cart-empty">
      <img className="cart-empty__arch" src={emptyArch} alt="" aria-hidden="true" />
      <div className="cart-empty__content">
        <header className="cart-empty__heading">
          <p className="cart-empty__eyebrow">Your Selection</p>
          <h1>Shopping bag</h1>
          <p className="cart-empty__intro">선택하신 제품을 확인해 주세요.</p>
        </header>
        <section className="cart-empty__panel" aria-label="빈 장바구니">
          <img className="cart-empty__bag" src={emptyBag} alt="" />
          <p className="cart-empty__message">장바구니가 비어있습니다.</p>
          <Link className="cart-empty__shop" to="/shop">Shop Now</Link>
        </section>
      </div>
    </main>
  );
  return (
    <main className="cart-page">
      <div className="cart-page__layout">
        <div className="cart-page__selection">
          <header className="cart-empty__heading">
            <p className="cart-empty__eyebrow">Your Selection</p>
            <h1>Shopping bag</h1>
            <p className="cart-empty__intro">선택하신 제품을 확인해 주세요.</p>
          </header>
          <div className="cart-selection-toolbar">
            <label className="cart-selection-toolbar__all">
              <input type="checkbox" checked={allSelected} onChange={() => setSelectedIds(allSelected ? [] : items.map((item) => item.id))} />
              <span className="cart-selection-toolbar__desktop-label">전체 ( {selectedItems.length}/{items.length} )</span>
              <span className="cart-selection-toolbar__mobile-label">전체선택</span>
            </label>
            <button type="button" disabled={selectedItems.length === 0} onClick={removeSelected}>선택 삭제</button>
          </div>
          <table className="cart-table">
            <thead><tr><th scope="col">제품</th><th scope="col">가격</th><th scope="col">수량</th><th scope="col">합계</th></tr></thead>
            <tbody>{items.map((item) => (
              <tr key={item.id}>
                <td><div className="cart-product-cell">
                  <input className="cart-product-checkbox" type="checkbox" aria-label={`${item.name} 선택`} checked={selectedIds.includes(item.id)} onChange={() => toggleItem(item.id)} />
                  <Link className="cart-product" to={`/products/${item.id}`}>
                  <img src={item.image} alt="" />
                  <div><h2>{cartTitle(item)}</h2><p>{item.name}</p></div>
                </Link></div></td>
                <td className="cart-table__price" data-label="가격">{formatPrice(item.price, item.currency)}</td>
                <td><div className="cart-item__controls">
                  <div className="cart-item__quantity">
                    <button type="button" aria-label={`${item.name} 수량 줄이기`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.id, item.quantity - 1)}><img src={minusIcon} alt="" /></button>
                    <output aria-label={`${item.name} 수량`}>{item.quantity}</output>
                    <button type="button" aria-label={`${item.name} 수량 늘리기`} onClick={() => setQuantity(item.id, item.quantity + 1)}><img src={plusIcon} alt="" /></button>
                  </div>
                </div></td>
                <td className="cart-table__price" data-label="합계">{formatPrice(item.price * item.quantity, item.currency)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <aside className="cart-summary" aria-label="주문 요약">
          <div className="cart-summary__paper"><img src={receiptPaper} alt="" /></div>
          <img className="cart-summary__floral" src={receiptFloral} alt="" />
          <img className="cart-summary__figs" src={receiptFigs} alt="" />
          <div className="cart-summary__content">
            <h2>Order summary</h2>
            <div className="cart-summary__subtotal" aria-live="polite">
              {subtotalEntries.map(([currency, total]) => <p key={currency}><span>Subtotal</span><span>{formatPrice(total, currency)}</span></p>)}
              <p><span>Delivery</span><span>무료</span></p>
            </div>
            <hr />
            <div className="cart-summary__total" aria-live="polite">{subtotalEntries.map(([currency, total]) => <p key={currency}><span>Total</span><span>{formatPrice(total, currency)}</span></p>)}</div>
            <p className="cart-summary__vat">(VAT 포함)</p>
            <button className="cart-summary__checkout" type="button" onClick={() => setCheckoutNotice(true)}>CHECKOUT</button>
            {checkoutNotice && <p className="cart-summary__notice" role="status">결제 기능은 준비 중입니다.</p>}
          </div>
        </aside>
      </div>
    </main>
  );
}
