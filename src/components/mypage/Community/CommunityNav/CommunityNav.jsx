import { Link } from 'react-router-dom';
import './CommunityNav.css';

const items = [
  ['inquiry', '1:1 문의', '/mypage/community/inquiry'],
  ['faq', 'FAQ', '/contact/faq'],
  ['product', '상품문의', '/mypage/community/product-inquiry'],
];

export default function CommunityNav({ active = 'faq' }) {
  return (
    <nav className="community-nav" aria-label="커뮤니티 메뉴">
      {items.map(([id, label, to]) => {
        const Item = to ? Link : 'span';
        return (
          <Item className="community-nav__tab" key={id} {...(to ? { to } : {})} aria-current={active === id ? 'page' : undefined} aria-disabled={!to && active !== id ? true : undefined}>
            {label}
          </Item>
        );
      })}
    </nav>
  );
}
