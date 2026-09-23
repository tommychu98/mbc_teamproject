import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useBoardStore } from '../../store/useBoardStore';
import './BoardPage.css';

export default function BoardListPage({ onlyMine = false }) {
  const posts = useBoardStore((state) => state.posts);
  const { user, isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filtered = useMemo(() => posts
    .filter((post) => !onlyMine || post.userId === user?.id)
    .filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
    .filter((post) => category === 'ALL' || post.category === category)
    .sort((a, b) => sort === 'views' ? b.views - a.views : sort === 'likes' ? b.likes - a.likes : new Date(b.createdAt) - new Date(a.createdAt)), [category, onlyMine, posts, query, sort, user?.id]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const changeFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };
  return <main className="board-page container">
    <div className="board-page__head"><div><p className="eyebrow">Maison community</p><h1 className="page-title">{onlyMine ? 'My Posts' : 'Community Board'}</h1><p>향과 공간에 관한 취향을 나누는 프로젝트 확장 커뮤니티입니다.</p></div>{isAuthenticated && <Link className="button" to="/board/write">글쓰기</Link>}</div>
    <div className="board-toolbar"><label className="field"><span className="sr-only">제목 검색</span><input className="field__input" value={query} onChange={changeFilter(setQuery)} placeholder="제목 검색" /></label><label className="field"><span className="sr-only">카테고리</span><select className="field__input" value={category} onChange={changeFilter(setCategory)}><option value="ALL">전체 카테고리</option><option value="NOTICE">NOTICE</option><option value="STYLE">STYLE</option><option value="REVIEW">REVIEW</option><option value="Q&A">Q&amp;A</option></select></label><label className="field"><span className="sr-only">정렬</span><select className="field__input" value={sort} onChange={changeFilter(setSort)}><option value="newest">최신순</option><option value="views">조회순</option><option value="likes">좋아요순</option></select></label></div>
    {visible.length ? <><div className="board-list"><div className="board-row board-row--head"><span>카테고리</span><span>제목</span><span>작성자</span><span>조회 / 좋아요</span><span>작성일</span></div>{visible.map((post) => <Link className="board-row" to={`/board/${post.id}`} key={post.id}><span>{post.category}</span><span className="board-row__title"><strong>{post.title}</strong><small>{post.author} · 조회 {post.views} · 좋아요 {post.likes} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}</small></span><span>{post.author}</span><span>{post.views} / {post.likes}</span><span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span></Link>)}</div><nav className="pagination" aria-label="페이지">{Array.from({ length: pages }, (_, index) => <button type="button" key={index} aria-current={page === index + 1 ? 'page' : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>)}</nav></> : <div className="empty-state"><p>{onlyMine ? '작성한 게시글이 없습니다.' : '검색 결과가 없습니다.'}</p></div>}
  </main>;
}
