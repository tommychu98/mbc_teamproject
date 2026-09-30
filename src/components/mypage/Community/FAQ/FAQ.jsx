import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import CommunityNav from '../CommunityNav/CommunityNav';
import { faqCategories, faqItems } from './faqItems';
import './FAQ.css';

const navigation = [['MY PAGE', '/mypage'], ['PROFILE', '/mypage/profile'], ['MY ORDERS', '/mypage/orders/history'], ['COMMUNITY', '/mypage/community/faq']];

export default function FAQ() {
  const instanceId = useId();
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [openId, setOpenId] = useState(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleItems = faqItems.filter((item) =>
    (category === '전체' || item.category === category) &&
    `${item.question} ${item.answer}`.toLocaleLowerCase().includes(normalizedQuery));

  function search(event) {
    event.preventDefault();
    setQuery(draft);
    setOpenId(null);
  }

  return (
    <main className="mypage-faq">
      <header className="mypage-faq__header">
        <h1 className="mypage-faq__title">My Page</h1>
        <nav className="mypage-faq__navigation" aria-label="마이페이지 메뉴">
          {navigation.map(([label, to]) => {
            const Item = to ? Link : 'span';
            return (
              <Item className="mypage-faq__nav-link" key={label} {...(to ? { to } : {})} aria-current={label === 'COMMUNITY' ? 'page' : undefined}>
                <span className="mypage-faq__nav-sizer" aria-hidden="true">{label}</span>
                <span className="mypage-faq__nav-label">{label}</span>
              </Item>
            );
          })}
        </nav>
      </header>
      <CommunityNav active="faq" />
      <section className="mypage-faq__content" aria-labelledby={`${instanceId}-heading`}>
        <p className="mypage-faq__eyebrow">CUSTOMER CARE</p>
        <h2 id={`${instanceId}-heading`}>자주 묻는 질문을 확인하세요.</h2>
        <p className="mypage-faq__description">궁금한 내용을 빠르게 찾아보실 수 있습니다.</p>

        <form className="mypage-faq__search" role="search" aria-label="FAQ 검색" onSubmit={search}>
          <div className="mypage-faq__search-field">
            <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            <input type="search" aria-label="FAQ 검색어" placeholder="궁금한 내용을 검색해보세요." value={draft} onChange={(event) => setDraft(event.target.value)} />
          </div>
          <button className="mypage-faq__search-button" type="submit">검색</button>
        </form>

        <div className="mypage-faq__categories" role="group" aria-label="FAQ 카테고리">
          {faqCategories.map((item) => (
            <button type="button" key={item} aria-pressed={category === item} onClick={() => { setCategory(item); setOpenId(null); }}>{item}</button>
          ))}
        </div>
        <ol className="mypage-faq__list">
          {visibleItems.map((item, index) => {
            const expanded = openId === item.id;
            const questionId = `${instanceId}-${item.id}-question`;
            const answerId = `${instanceId}-${item.id}-answer`;
            return (
              <li className="mypage-faq__item" key={item.id}>
                <h3>
                  <button className="mypage-faq__question" type="button" id={questionId} aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpenId(expanded ? null : item.id)}>
                    <span className="mypage-faq__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span>{item.question}</span>
                    <span className="mypage-faq__toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
                  </button>
                </h3>
                <div className="mypage-faq__answer" id={answerId} role="region" aria-labelledby={questionId} hidden={!expanded}>
                  <p>{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {!visibleItems.length && (
          <div className="mypage-faq__empty">
            <p>검색 결과가 없습니다. 다른 검색어나 카테고리를 선택해 주세요.</p>
            <button type="button" onClick={() => { setDraft(''); setQuery(''); setCategory('전체'); setOpenId(null); }}>전체 질문 보기</button>
          </div>
        )}
      </section>
    </main>
  );
}
