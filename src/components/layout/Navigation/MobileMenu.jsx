import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import './MobileMenu.css';

export default function MobileMenu({ items, authenticated, onClose, onLogout, cartCount }) {
  const [expanded, setExpanded] = useState(null);
  const panel = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current.querySelector('button[aria-label="메뉴 닫기"]').focus();
    const keydown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const controls = [...panel.current.querySelectorAll('a, button')].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', keydown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const categories = items.filter(item => ['SHOP', 'ABOUT', 'GALERIE', 'CONTACT US'].includes(item.label));
  const renderGroup = (group) => <div className="mobile-menu__group" key={group.label}>
    <Link lang={group.lang} to={group.to} onClick={onClose}>{group.label}</Link>
    {group.items && <div className="mobile-menu__children">{group.items.filter(child => !child.authOnly || authenticated).map(child => child.action === 'logout'
      ? <button key={child.label} onClick={onLogout}>LOG OUT</button>
      : <Link key={child.label} to={child.to} onClick={onClose}>{child.label}</Link>)}</div>}
  </div>;

  return createPortal(<div className="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label="전체 메뉴">
    <div className="mobile-menu__top">
      <Link to="/" onClick={onClose} className="mobile-menu__brand"><img src="/images/common/diptyque-nav-logo.png" alt="DIPTYQUE PARIS" /></Link>
      <div className="mobile-menu__tools">
        <Link to={authenticated ? '/mypage' : '/login'} onClick={onClose} aria-label="마이페이지"><img src="/images/common/icon-profile.svg" alt="" /></Link>
        <Link to="/search" onClick={onClose} aria-label="검색"><img src="/images/common/icon-search.svg" alt="" /></Link>
        <Link to="/cart" onClick={onClose} aria-label={`장바구니 ${cartCount}개`}><img src="/images/common/icon-bag.svg" alt="" /></Link>
        <button onClick={onClose} aria-label="메뉴 닫기"><X strokeWidth={1.4} /></button>
      </div>
    </div>
    <nav aria-label="모바일 메뉴" className="mobile-menu__list">
      {authenticated ? <><button className="mobile-menu__row mobile-menu__login" onClick={() => setExpanded(expanded === 'account' ? null : 'account')} aria-expanded={expanded === 'account'}>MY PAGE<ChevronDown /></button>
        {expanded === 'account' && <div className="mobile-menu__submenu">{items.find(item => item.label === 'MY PAGE').groups.map(renderGroup)}</div>}</>
        : <Link className="mobile-menu__row mobile-menu__login" to="/login" onClick={onClose}>LOGIN</Link>}
      {categories.map((item, index) => item.label === 'GALERIE'
        ? <Link key={item.label} className="mobile-menu__row" to={item.to} onClick={onClose}>{item.label}</Link>
        : <div key={item.label}>
          <button className="mobile-menu__row" aria-expanded={expanded === item.label} aria-controls={`mobile-menu-panel-${index}`} onClick={() => setExpanded(expanded === item.label ? null : item.label)}>{item.label}<ChevronDown className={expanded === item.label ? 'is-expanded' : ''} /></button>
          <div id={`mobile-menu-panel-${index}`} className="mobile-menu__submenu" hidden={expanded !== item.label}>
            {item.groups?.map(renderGroup)}
          </div>
        </div>)}
    </nav>
  </div>, document.body);
}
