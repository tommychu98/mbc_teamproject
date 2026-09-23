import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import '../../components/auth/AuthPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const { authError, loginWithCredentials, loginAsTestUser, clearAuthError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/mypage';
  const submit = (event) => {
    event.preventDefault(); clearAuthError();
    const nextErrors = { username: form.username ? '' : '아이디를 입력해 주세요.', password: form.password ? '' : '비밀번호를 입력해 주세요.' };
    setErrors(nextErrors); if (nextErrors.username || nextErrors.password) return;
    if (loginWithCredentials(form.username, form.password)) navigate(destination, { replace: true });
  };
  const testLogin = () => { loginAsTestUser(); navigate(destination, { replace: true }); };
  return <main className="auth-page"><div className="auth-page__panel"><p className="eyebrow">Welcome back</p><h1>Sign in</h1><form className="auth-form" onSubmit={submit}><label className="field"><span className="field__label">아이디</span><input className="field__input" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />{errors.username && <span className="field__error">{errors.username}</span>}</label><label className="field"><span className="field__label">비밀번호</span><input className="field__input" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{errors.password && <span className="field__error">{errors.password}</span>}</label>{authError && <p className="auth-form__error" role="alert">{authError}</p>}<button className="button" type="submit">로그인</button></form><div className="auth-page__divider"><span>또는</span></div><button className="auth-page__kakao" type="button" onClick={() => alert('카카오 서버 설정 후 사용할 수 있습니다. 테스트 로그인을 이용해 주세요.')}>카카오로 시작하기</button><button className="button button--secondary" type="button" onClick={testLogin}>테스트 계정으로 로그인</button><p className="auth-page__hint">데모 계정: demo / DIPTYQUE-demo-1234</p><p className="auth-page__join">계정이 없으신가요? <Link to="/signup">회원가입</Link></p></div></main>;
}
