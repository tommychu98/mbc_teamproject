import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useInquiryStore } from '../../store/useInquiryStore';
import './InquiryPage.css';

export default function InquiryWritePage() {
  const { inquiryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { addInquiry, updateInquiry, getById } = useInquiryStore();
  const existing = inquiryId ? getById(inquiryId) : null;
  const [form, setForm] = useState(() => existing?.userId === user.id
    ? { category: existing.category, title: existing.title, content: existing.content, orderNumber: existing.orderNumber || '', notify: true }
    : { category: searchParams.get('category') || 'PRODUCT', title: '', content: '', orderNumber: '', notify: true });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);

  if (inquiryId && (!existing || existing.userId !== user.id)) return <main className="inquiry-page container"><div className="empty-state"><p>문의가 없거나 조회 권한이 없습니다.</p><Link className="button" to="/inquiries">목록으로</Link></div></main>;
  if (existing?.status === 'ANSWERED') return <main className="inquiry-page container"><div className="empty-state"><p>답변 완료 문의는 수정할 수 없습니다.</p><Link className="button" to={`/inquiries/${existing.id}`}>문의 보기</Link></div></main>;

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.category) next.category = '카테고리를 선택해 주세요.';
    if (form.title.trim().length < 2 || form.title.trim().length > 100) next.title = '제목은 2자 이상 100자 이하로 작성해 주세요.';
    if (form.content.trim().length < 10 || form.content.trim().length > 2000) next.content = '내용은 10자 이상 2,000자 이하로 작성해 주세요.';
    if (form.orderNumber && !/^DP-\d{8}-\d{3}$/.test(form.orderNumber)) next.orderNumber = '주문번호 형식은 DP-YYYYMMDD-000입니다.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const payload = { userId: user.id, category: form.category, title: form.title.trim(), content: form.content.trim(), orderNumber: form.orderNumber.trim(), notify: form.notify };
    if (existing) { updateInquiry(existing.id, user.id, payload); navigate(`/inquiries/${existing.id}`, { state: { message: '문의가 수정되었습니다.' } }); }
    else { const id = addInquiry(payload); navigate(`/inquiries/${id}`, { state: { message: '문의가 등록되었습니다.' } }); }
  };
  const pickFiles = (event) => {
    const nextFiles = Array.from(event.target.files).slice(0, 3);
    if (nextFiles.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) { setErrors((value) => ({ ...value, files: 'JPEG, PNG, WebP 파일을 개별 5MB 이하로 첨부해 주세요.' })); return; }
    setFiles(nextFiles); setErrors((value) => ({ ...value, files: undefined }));
  };

  return <main className="inquiry-page container"><div className="inquiry-page__head"><div><p className="eyebrow">Contact us</p><h1 className="page-title">{existing ? 'Edit Inquiry' : 'New Inquiry'}</h1></div></div>
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <label className="field"><span className="field__label">문의 카테고리</span><select className="field__input" name="category" value={form.category} onChange={update}><option value="PRODUCT">상품 문의</option><option value="DELIVERY">배송 문의</option><option value="RETURN">교환·반품 문의</option><option value="ACCOUNT">회원정보 문의</option><option value="ETC">기타 문의</option></select>{errors.category && <span className="field__error">{errors.category}</span>}</label>
      <label className="field"><span className="field__label">제목</span><input className="field__input" name="title" value={form.title} onChange={update} maxLength="100" />{errors.title && <span className="field__error">{errors.title}</span>}</label>
      <label className="field"><span className="field__label">문의 내용</span><textarea className="field__input" name="content" value={form.content} onChange={update} maxLength="2000" />{errors.content && <span className="field__error">{errors.content}</span>}</label>
      <label className="field"><span className="field__label">주문번호 (선택)</span><input className="field__input" name="orderNumber" value={form.orderNumber} onChange={update} placeholder="DP-20260921-001" />{errors.orderNumber && <span className="field__error">{errors.orderNumber}</span>}</label>
      {!existing && <label className="field"><span className="field__label">이미지 첨부 (최대 3개, 미리보기 전용)</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pickFiles} />{files.length > 0 && <small>{files.map((file) => file.name).join(', ')}</small>}{errors.files && <span className="field__error">{errors.files}</span>}</label>}
      <label><input type="checkbox" name="notify" checked={form.notify} onChange={update} /> 답변 등록 알림을 받습니다.</label>
      <div className="inquiry-form__actions"><button className="button" type="submit">{existing ? '수정 완료' : '문의 등록'}</button><Link className="button button--secondary" to={existing ? `/inquiries/${existing.id}` : '/inquiries'}>취소</Link></div>
    </form>
  </main>;
}
