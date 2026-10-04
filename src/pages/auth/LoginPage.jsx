import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import flowerRibbon from '../../components/auth/assets/login-floral-ribbon.png';
import flowerEnvelope from '../../components/auth/assets/login-floral-envelope.png';
import passwordHiddenIcon from '../../components/auth/assets/figma-vector-3.svg';
import testLoginIcon from '../../components/auth/assets/figma-vector-2.svg';
import kakaoIcon from '../../components/auth/assets/figma-vector-8.svg';
import '../../components/auth/AuthPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { authError, loginWithCredentials, loginAsTestUser, clearAuthError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/mypage';

  const submit = (event) => {
    event.preventDefault();
    clearAuthError();
    const nextErrors = {
      username: form.username ? '' : '아이디를 입력해 주세요.',
      password: form.password ? '' : '비밀번호를 입력해 주세요.',
    };
    setErrors(nextErrors);
    if (nextErrors.username || nextErrors.password) return;
    if (loginWithCredentials(form.username, form.password)) navigate(destination, { replace: true });
  };

  const testLogin = () => {
    loginAsTestUser();
    navigate(destination, { replace: true });
  };

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  };

  return (
    <main className="auth-page auth-page--login">
      <img className="login-decoration login-decoration--ribbon" src={flowerRibbon} alt="" aria-hidden="true" />
      <img className="login-decoration login-decoration--envelope" src={flowerEnvelope} alt="" aria-hidden="true" />

      <section className="auth-page__panel login-card" aria-labelledby="login-title">
        <header className="login-card__header">
          <p>Welcome Back</p>
          <h1 id="login-title">Sign in</h1>
        </header>

        <form className="auth-form login-form" onSubmit={submit} noValidate>
          <label className="field login-field">
            <span className="field__label">아이디</span>
            <input className="field__input" autoComplete="username" placeholder="아이디를 입력해 주세요." value={form.username} aria-invalid={Boolean(errors.username)} onChange={(event) => updateField('username', event.target.value)} />
            {errors.username && <span className="field__error">{errors.username}</span>}
          </label>

          <label className="field login-field">
            <span className="field__label">비밀번호</span>
            <span className="login-field__control">
              <input className="field__input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="비밀번호를 입력해 주세요." value={form.password} aria-invalid={Boolean(errors.password)} onChange={(event) => updateField('password', event.target.value)} />
              <button className={`login-field__visibility${showPassword ? ' is-visible' : ''}`} type="button" aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'} aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>
                <img src={passwordHiddenIcon} alt="" />
              </button>
            </span>
            {errors.password && <span className="field__error">{errors.password}</span>}
          </label>

          {authError && <p className="auth-form__error" role="alert">{authError}</p>}
          <button className="button login-card__button login-card__button--primary" type="submit">로그인</button>
        </form>

        <div className="auth-page__divider login-card__divider"><span>또는</span></div>

        <div className="login-card__actions">
          <button className="auth-page__kakao login-card__button" type="button" onClick={() => alert('카카오 서버 설정 후 사용할 수 있습니다. 테스트 로그인을 이용해 주세요.')}>
            <img src={kakaoIcon} alt="" />
            카카오로 시작하기
          </button>
          <button className="button button--secondary login-card__button" type="button" onClick={testLogin}>
            <img src={testLoginIcon} alt="" />
            테스트 계정으로 로그인
          </button>
        </div>

        <p className="auth-page__join login-card__join">계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
      </section>
    </main>
  );
}
