import './CommunityNav.css';

const items = [['inquiry', '1:1 문의'], ['faq', 'FAQ'], ['product', '상품문의']];

export default function CommunityNav({ active = 'faq' }) {
  return (
    <nav className="community-nav" aria-label="커뮤니티 메뉴">
      {items.map(([id, label]) => (
        // Destinations will be connected when MyPage Community routes are ready.
        <span className="community-nav__tab" key={id} aria-current={active === id ? 'page' : undefined} aria-disabled={active !== id ? true : undefined}>
          {label}
        </span>
      ))}
    </nav>
  );
}
