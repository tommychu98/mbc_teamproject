import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useInquiryStore } from '../../store/useInquiryStore';
import './InquiryPage.css';

const statusLabels = { PENDING: '접수 완료', IN_REVIEW: '확인 중', ANSWERED: '답변 완료' };
const categoryLabels = { PRODUCT: '상품', DELIVERY: '배송', RETURN: '교환·반품', ACCOUNT: '회원정보', ETC: '기타' };

export default function InquiryListPage() {
  const user = useAuthStore((state) => state.user);
  const inquiries = useInquiryStore((state) => state.inquiries);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = useMemo(() => inquiries
    .filter((item) => item.userId === user.id)
    .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    .filter((item) => status === 'ALL' || item.status === status)
    .sort((a, b) => sort === 'oldest' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)), [inquiries, query, sort, status, user.id]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const changeFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };

  return <main className="inquiry-page container">
    <div className="inquiry-page__head"><div><p className="eyebrow">Contact us</p><h1 className="page-title">My Inquiries</h1><p>문의 접수와 답변 현황을 확인할 수 있습니다.</p></div><Link className="button" to="/inquiries/write">문의 작성</Link></div>
    <div className="inquiry-toolbar">
      <label className="field"><span className="sr-only">제목 검색</span><input className="field__input" value={query} onChange={changeFilter(setQuery)} placeholder="제목 검색" /></label>
      <label className="field"><span className="sr-only">상태</span><select className="field__input" value={status} onChange={changeFilter(setStatus)}><option value="ALL">전체 상태</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label className="field"><span className="sr-only">정렬</span><select className="field__input" value={sort} onChange={changeFilter(setSort)}><option value="newest">최신순</option><option value="oldest">오래된순</option></select></label>
    </div>
    {visible.length ? <>
      <table className="inquiry-table"><thead><tr><th>문의 번호</th><th>분류</th><th>제목</th><th>상태</th><th>작성일</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td>{item.id.replace('inquiry-', '#')}</td><td>{categoryLabels[item.category]}</td><td><Link to={`/inquiries/${item.id}`}>{item.title}</Link></td><td><span className={`status-badge status-badge--${item.status}`}>{statusLabels[item.status]}</span></td><td>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</td></tr>)}</tbody></table>
      <div className="inquiry-card-list">{visible.map((item) => <Link className="inquiry-card" key={item.id} to={`/inquiries/${item.id}`}><div className="inquiry-card__top"><span>{categoryLabels[item.category]}</span><span className={`status-badge status-badge--${item.status}`}>{statusLabels[item.status]}</span></div><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</small></Link>)}</div>
      {totalPages > 1 && <nav className="pagination" aria-label="페이지">{Array.from({ length: totalPages }, (_, index) => <button type="button" aria-current={page === index + 1 ? 'page' : undefined} key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>)}</nav>}
    </> : <div className="empty-state"><p>등록한 고객문의가 없습니다.<br />궁금한 내용을 문의해 주세요.</p><Link className="button" to="/inquiries/write">문의 작성하기</Link></div>}
  </main>;
}
