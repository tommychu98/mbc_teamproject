import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useBoardStore } from '../../store/useBoardStore';
import './BoardPage.css';

export default function BoardFormPage() {
  const { postId } = useParams();
  const user = useAuthStore((state) => state.user);
  const { addPost, updatePost, getById } = useBoardStore();
  const existing = postId ? getById(postId) : null;
  const navigate = useNavigate();
  const [form, setForm] = useState(() => existing?.userId === user.id
    ? { category: existing.category, title: existing.title, content: existing.content }
    : { category: 'REVIEW', title: '', content: '' });
  const [errors, setErrors] = useState({});
  if (postId && (!existing || existing.userId !== user.id)) return <main className="board-page container"><div className="empty-state"><p>게시글이 없거나 수정 권한이 없습니다.</p><Link className="button" to="/board">목록으로</Link></div></main>;
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault(); const next = {};
    if (!form.category) next.category = '카테고리를 선택해 주세요.';
    if (form.title.trim().length < 2 || form.title.trim().length > 100) next.title = '제목은 2자 이상 100자 이하로 작성해 주세요.';
    if (form.content.trim().length < 10) next.content = '내용을 10자 이상 작성해 주세요.';
    setErrors(next); if (Object.keys(next).length) return;
    if (existing) { updatePost(existing.id, user.id, form); navigate(`/board/${existing.id}`); }
    else { const id = addPost({ ...form, userId: user.id, author: user.name }); navigate(`/board/${id}`); }
  };
  return <main className="board-page container"><div className="board-page__head"><div><p className="eyebrow">Maison community</p><h1 className="page-title">{existing ? 'Edit Post' : 'New Post'}</h1></div></div><form className="board-form" onSubmit={submit}><label className="field"><span className="field__label">카테고리</span><select className="field__input" name="category" value={form.category} onChange={update}><option value="STYLE">STYLE</option><option value="REVIEW">REVIEW</option><option value="Q&A">Q&amp;A</option></select>{errors.category && <span className="field__error">{errors.category}</span>}</label><label className="field"><span className="field__label">제목</span><input className="field__input" name="title" value={form.title} onChange={update} maxLength="100" />{errors.title && <span className="field__error">{errors.title}</span>}</label><label className="field"><span className="field__label">내용</span><textarea className="field__input" name="content" value={form.content} onChange={update} />{errors.content && <span className="field__error">{errors.content}</span>}</label><div className="board-detail__actions"><button className="button" type="submit">{existing ? '수정 완료' : '등록'}</button><Link className="button button--secondary" to={existing ? `/board/${existing.id}` : '/board'}>취소</Link></div></form></main>;
}
