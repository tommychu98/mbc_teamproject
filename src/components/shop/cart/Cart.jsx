import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import './Cart.css';

export default function CartPage() {
  const { items, removeItem, setQuantity, clear } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <main className="cart-page container section"><p className="eyebrow">Your selection</p><h1 className="page-title">Shopping bag</h1>{items.length === 0 ? <div className="empty-state"><p>장바구니가 비어 있습니다.</p><Link className="button" to="/shop">Shop now</Link></div> : <div className="cart-page__layout"><div className="cart-page__items">{items.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt="" /><div><Link to={`/products/${item.id}`}><h2>{item.name}</h2><p>{item.subtitle}</p></Link><div className="cart-item__quantity"><button type="button" aria-label="수량 줄이기" onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button type="button" aria-label="수량 늘리기" onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus /></button></div></div><div><strong>US ${item.price * item.quantity}</strong><button className="cart-item__remove" type="button" aria-label={`${item.name} 삭제`} onClick={() => removeItem(item.id)}><Trash2 /></button></div></article>)}</div><aside className="cart-summary"><h2>Order summary</h2><p><span>Subtotal</span><strong>US ${total}</strong></p><p><span>Delivery</span><strong>Complimentary</strong></p><button className="button" type="button">Checkout</button><button className="button button--text" type="button" onClick={clear}>장바구니 비우기</button></aside></div>}</main>;
}
