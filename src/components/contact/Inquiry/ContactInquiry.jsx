import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useInquiryStore } from '../../../store/useInquiryStore';
import leftBackground from './assets/bg image1.png';
import rightBackground from './assets/bg image2.png';
import chatIcon from './assets/chat.svg';
import phoneIcon from './assets/phone.svg';
import mailIcon from './assets/mail.svg';
import verticalDivider from './assets/divider-vertical.svg';
import horizontalDivider from './assets/divider-horizontal.svg';
import './ContactInquiry.css';

export default function ContactInquiry() {
  const user = useAuthStore((state) => state.user);
  const addInquiry = useInquiryStore((state) => state.addInquiry);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', category: params.get('category') || '', title: '', content: '' });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const pickFiles = (event) => {
    const selected = Array.from(event.target.files);
    if (selected.length > 5 || selected.some((file) => !['image/jpeg', 'image/png'].includes(file.type) || file.size > 10 * 1024 * 1024)) {
      setError('JPG, PNG 이미지를 파일당 10MB 이하, 최대 5개까지 선택해 주세요.');
      event.target.value = '';
      return;
    }
    setFiles(selected);
    setError('');
  };
  const submit = (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!user) { setError('로그인 후 문의를 등록해 주세요.'); return; }
    if (!form.name.trim() || !form.category || form.title.trim().length < 2 || form.content.trim().length < 10) {
      setError('이름과 문의 유형을 확인하고, 제목은 2자 이상, 내용은 10자 이상 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const id = addInquiry({ ...form, name: form.name.trim(), email: form.email.trim(), title: form.title.trim(), content: form.content.trim(), userId: user.id, orderNumber: '', notify: true });
      navigate(`/inquiries/${id}`, { state: { message: '문의가 등록되었습니다.' } });
    } catch {
      setError('문의를 저장하지 못했습니다. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };
  return <main className="contact-inquiry">
    <img className="contact-inquiry__background contact-inquiry__background--left" src={leftBackground} alt="" aria-hidden="true" />
    <img className="contact-inquiry__background contact-inquiry__background--right" src={rightBackground} alt="" aria-hidden="true" />
    <header className="contact-inquiry__heading"><p>Contact us</p><h1>1:1문의</h1><div>궁금하신 점이 있으신가요?<br />딥디크가 빠르고 친절하게 답변드리겠습니다</div></header>
    <div className="contact-inquiry__panel">
      <form className="contact-inquiry__form" onSubmit={submit}>
        <div className="contact-inquiry__form-heading"><h2>문의하기</h2><p>문의하실 내용을 입력해 주시면, 확인 후 답변드리겠습니다.</p></div>
        <div className="contact-inquiry__fields">
          <div className="contact-inquiry__identity">
            <label>이름 *<input name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={update} placeholder="이름을 입력해 주세요" /></label>
            <label>이메일 *<input type="email" name="email" autoComplete="email" required maxLength={254} value={form.email} onChange={update} placeholder="이메일을 입력해 주세요" /></label>
          </div>
          <label>문의 유형 *<select name="category" required value={form.category} onChange={update}><option value="" disabled>선택해 주세요</option><option value="PRODUCT">제품/향수</option><option value="DELIVERY">주문/배송</option><option value="RETURN">교환/반품</option><option value="ACCOUNT">회원/멤버십</option><option value="ETC">매장/서비스 및 기타</option></select></label>
          <label>제목 *<input name="title" required minLength={2} maxLength={100} value={form.title} onChange={update} placeholder="제목을 입력해주세요." /></label>
          <label>내용 *<textarea name="content" required minLength={10} maxLength={2000} value={form.content} onChange={update} placeholder="문의하실 내용을 자세히 입력해주세요" /></label>
        </div>
        <div className="contact-inquiry__attachment">
          <label htmlFor="contact-inquiry-files">첨부파일 (선택)</label>
          <div className="contact-inquiry__file-row"><label className="contact-inquiry__file-button">파일 선택<input id="contact-inquiry-files" className="sr-only" type="file" accept="image/jpeg,image/png" multiple onChange={pickFiles} aria-describedby="contact-inquiry-file-help" /></label><div className="contact-inquiry__file-names">{files.length ? files.map((file) => file.name).join(', ') : '선택된 파일이 없습니다.'}<small id="contact-inquiry-file-help">이미지 파일 (JPG, PNG) 10MB 이하, 최대 5개까지 첨부 가능합니다.</small></div></div>
          {files.length > 0 && <p className="contact-inquiry__file-note">현재 첨부파일은 선택 확인만 지원하며 문의와 함께 전송되지 않습니다.</p>}
        </div>
        {error && <p className="contact-inquiry__error" role="alert">{error}</p>}
        <button className="contact-inquiry__submit" type="submit" disabled={submitting}>{submitting ? '등록 중…' : '문의 하기'}</button>
      </form>
      <aside className="contact-inquiry__support" aria-label="고객센터 안내">
        <img className="contact-inquiry__vertical-divider" src={verticalDivider} alt="" />
        <h2>고객센터 안내</h2>
        <span className="contact-inquiry__horizontal-divider"><img src={horizontalDivider} alt="" /></span>
        <dl><div><img src={chatIcon} alt="" /><div><dt>운영시간</dt><dd>평일 9:00 ~ 18:00<br />(주말 공휴일 제외)</dd></div></div><div><img src={phoneIcon} alt="" /><div><dt>전화 문의</dt><dd>02 - 1234 - 5678</dd></div></div><div><img src={mailIcon} alt="" /><div><dt>이메일 문의</dt><dd>cs@diptyque.co.kr</dd></div></div></dl>
        <div className="contact-inquiry__faq"><span className="contact-inquiry__horizontal-divider"><img src={horizontalDivider} alt="" /></span><h2>자주 묻는 질문</h2><p>많이 문의주시는 내용은 FAQ에서<br />빠르게 확인하실 수 있습니다.</p><Link to="/contact/faq">FAQ 바로가기</Link></div>
      </aside>
    </div>
  </main>;
}
