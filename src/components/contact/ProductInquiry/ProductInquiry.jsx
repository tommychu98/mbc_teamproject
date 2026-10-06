import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductInquiryDetail from './ProductInquiryDetail';
import { useAuthStore } from '../../../store/useAuthStore';
import { useInquiryStore } from '../../../store/useInquiryStore';
import leftBackground from './assets/bg image 1.png';
import rightBackground from './assets/bg image 2.png';
import noticeImage from './assets/image 1.png';
import lockIcon from './assets/lock.svg';
import searchIcon from './assets/search.svg';
import warningIcon from './assets/warning.svg';
import noticeDivider from './assets/divider.svg';
import './ProductInquiry.css';

const examples = [
  { id: 'sample-1', title: '재입고 일정 문의', author: 'dip***', isPrivate: true, status: 'PENDING' },
  { id: 'sample-2', title: '한국에서만 파는 한정판 제품이 있나요?', author: 'jiy***', isPrivate: false, status: 'ANSWERED' },
  { id: 'sample-3', title: '선물 포장도 가능한가요?', author: 'jhy***', isPrivate: true, status: 'ANSWERED' },
  { id: 'sample-4', title: '단종된 제품인가요?', author: 'chn***', isPrivate: true, status: 'PENDING' },
  { id: 'sample-5', title: '배송시 파손 우려가 있나요?', author: 'psj***', isPrivate: true, status: 'PENDING' },
  { id: 'sample-6', title: '오르페옹 오 드 뚜왈렛은 언제 출시 되나요?', author: 'ui2***', isPrivate: true, status: 'PENDING' },
];
const filters = [['all', '전체'], ['public', '공개 문의'], ['private', '비공개 문의']];
const formatDate = (date) => date ? new Date(date).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replaceAll(' ', '').replace(/\.$/, '') : '00.00.00';

export default function ProductInquiry() {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const inquiries = useInquiryStore((state) => state.inquiries);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  // Legacy inquiries have no visibility field and remain private to their owner.
  const actual = inquiries.filter((item) => item.category === 'PRODUCT' && (item.isPrivate === false || (user && item.userId === user.id)));
  const isPreview = actual.length === 0;
  const items = [...examples.map((item) => ({ ...item, isExample: true })), ...[...actual].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))];
  const filtered = items.filter((item) => (filter === 'all' || (filter === 'private' ? item.isPrivate !== false : item.isPrivate === false)) && item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * 6, currentPage * 6);
  const selectedInquiry = items.find((item) => item.id === searchParams.get('inquiry'));
  const listParams = new URLSearchParams(searchParams);
  listParams.delete('inquiry');
  const listUrl = listParams.size ? `?${listParams}` : '/contact/product-inquiry';
  if (selectedInquiry) return <ProductInquiryDetail inquiry={selectedInquiry} user={user} listUrl={listUrl} />;

  return <main className="product-inquiry">
    <img className="product-inquiry__background product-inquiry__background--left" src={leftBackground} alt="" aria-hidden="true" />
    <img className="product-inquiry__background product-inquiry__background--right" src={rightBackground} alt="" aria-hidden="true" />
    <div className="product-inquiry__content">
      <header className="product-inquiry__heading"><p>Contact us</p><h1>상품문의</h1><p>상품에 대해 궁금한점을 확인하고 질문해 보세요</p></header>
      <div className="product-inquiry__toolbar">
        <div className="product-inquiry__filters" role="group" aria-label="문의 공개 여부">{filters.map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => { setFilter(value); setPage(1); }}>{label}</button>)}</div>
        <label className="product-inquiry__search"><span className="product-inquiry__search-icon"><img src={searchIcon} alt="" /></span><span className="sr-only">문의 내용 검색</span><input type="search" placeholder="문의 내용 검색하기" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
      </div>
      <p className="sr-only" role="status">{isPreview ? '디자인 예시 목록. ' : ''}검색 결과 {filtered.length}개</p>
      <aside className="product-inquiry__notice" aria-labelledby="product-inquiry-notice-title">
        <div className="product-inquiry__notice-title"><img className="product-inquiry__notice-image" src={noticeImage} alt="" width="120" height="120" /><span className="product-inquiry__warning-icon"><img src={warningIcon} alt="" /></span><h2 id="product-inquiry-notice-title">꼭 확인해 주세요.</h2><img className="product-inquiry__notice-divider" src={noticeDivider} alt="" /></div>
        <ul><li>개인정보가 포함된 문의(주민번호, 연락처, 주소 등)는 비공개로 등록해 주세요.</li><li>상품과 관련 없는 내용이나 욕설, 비방 등의 글은 사전 통보 없이 삭제될 수 있습니다.</li><li>답변은 영업일 기준 1~2일 이내에 등록되며, 마이페이지에서도 확인하실 수 있습니다.</li></ul>
      </aside>
      <section className="product-inquiry__board" aria-label={isPreview ? '상품 문의 예시 목록' : '상품 문의 목록'}>
        <div className="product-inquiry__columns" aria-hidden="true"><span>번호</span><span>제목</span><span>작성자</span><span>작성일</span><span>답변상태</span></div>
        {visible.map((item, index) => {
          const isExample = item.isExample === true;
          const isPrivate = item.isPrivate !== false;
          const author = isExample ? item.author : `${(item.name || (user && item.userId === user.id ? user.name : '') || '고객').slice(0, 3)}***`;
          return <article className="product-inquiry__item" key={item.id}>
            <button className="product-inquiry__row" type="button" onClick={() => {
              const params = new URLSearchParams(searchParams); params.set('inquiry', item.id); setSearchParams(params);
            }}>
              <span className="product-inquiry__number">{(currentPage - 1) * 6 + index + 1}</span>
              <span className="product-inquiry__subject"><span className="product-inquiry__lock">{isPrivate && <img src={lockIcon} alt="비공개" />}</span><span>{item.title}</span></span>
              <span className="product-inquiry__author">{author}</span><time dateTime={item.createdAt || undefined}>{formatDate(item.createdAt)}</time>
              <span className="product-inquiry__state"><span className={`product-inquiry__badge${item.status === 'ANSWERED' ? ' product-inquiry__badge--answered' : ''}`}>{item.status === 'ANSWERED' ? '답변완료' : '답변대기'}</span><ChevronRight size={18} strokeWidth={1} aria-hidden="true" /></span>
            </button>
          </article>;
        })}
        {!visible.length && <p className="product-inquiry__empty">검색 결과가 없습니다. 다른 검색어나 공개 여부를 선택해 주세요.</p>}
      </section>
      <nav className="product-inquiry__pagination" aria-label="문의 페이지">{Array.from({ length: totalPages }, (_, index) => <button type="button" key={index} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => { setPage(index + 1); }}>{index + 1}</button>)}</nav>
      <div className="product-inquiry__actions">
        {isPreview && <p>현재 목록은 디자인 예시입니다.</p>}
        <Link to="/inquiries/write?category=PRODUCT">상품 문의 작성</Link>
      </div>
    </div>
  </main>;
}
