import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import '../../components/auth/AuthPage.css';

export default function SignUpPage() {
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [message, setMessage] = useState('');
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    if (!form.username || !form.password || !form.name) { setMessage('모든 필수 항목을 입력해 주세요.'); return; }
    if (form.password.length < 8) { setMessage('비밀번호는 8자 이상 입력해 주세요.'); return; }
    if (!signUp(form)) { setMessage('이미 사용 중인 아이디입니다.'); return; }
    alert('회원가입이 완료되었습니다. 로그인해 주세요.'); navigate('/login');
  };
  return <main className="auth-page"><div className="auth-page__panel"><p className="eyebrow">Join the maison</p><h1>Create account</h1><form className="auth-form" onSubmit={submit}><label className="field"><span className="field__label">아이디</span><input className="field__input" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label className="field"><span className="field__label">비밀번호</span><input className="field__input" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label className="field"><span className="field__label">이름</span><input className="field__input" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>{message && <p className="auth-form__error" role="alert">{message}</p>}<button className="button" type="submit">가입</button><button className="button button--secondary" type="button" onClick={() => navigate('/login')}>취소</button></form><div className="auth-page__divider"><span>또는</span></div><button className="auth-page__kakao" type="button" onClick={() => alert('카카오 서버 설정 후 사용할 수 있습니다. 테스트 로그인을 이용해 주세요.')}>카카오로 시작하기</button></div></main>;
}
