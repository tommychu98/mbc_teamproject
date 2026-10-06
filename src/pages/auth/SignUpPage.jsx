import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import floralKey from '../../components/auth/assets/signup-floral-key.png';
import passwordHiddenIcon from '../../components/auth/assets/signup-eye.svg';
import kakaoIcon from '../../components/auth/assets/signup-kakao.svg';
import dividerLeft from '../../components/auth/assets/signup-divider-left.svg';
import dividerRight from '../../components/auth/assets/signup-divider-right.svg';
import '../../components/auth/AuthPage.css';
import '../../components/auth/SignUpPage.css';

export default function SignUpPage() {
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
    if (message) setMessage('');
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {
      username: form.username ? '' : '아이디를 입력해주세요.',
      password: form.password ? (form.password.length >= 8 ? '' : '비밀번호는 8자 이상 입력해주세요.') : '비밀번호를 입력해주세요.',
      name: form.name ? '' : '이름을 입력해주세요.',
    };
    setErrors(nextErrors);
    setMessage('');
    if (Object.values(nextErrors).some(Boolean)) return;
    if (!signUp(form)) {
      setMessage('이미 사용 중인 아이디입니다.');
      return;
    }
    window.alert('회원가입이 완료되었습니다. 로그인해주세요.');
    navigate('/login');
  };

  return (
    <main className="auth-page auth-page--signup">
      <img className="signup-decoration" src={floralKey} alt="" aria-hidden="true" />
      <section className="auth-page__panel signup-card" aria-labelledby="signup-title">
        <header className="signup-card__header">
          <p>Join Diptyque</p>
          <h1 id="signup-title">Create account</h1>
        </header>
        <form className="auth-form signup-form" onSubmit={submit} noValidate>
          <label className="field login-field">
            <span className="field__label">아이디</span>
            <input className="field__input" autoComplete="username" placeholder="아이디를 입력해주세요." value={form.username} aria-invalid={Boolean(errors.username)} onChange={(event) => updateField('username', event.target.value)} />
            {errors.username && <span className="field__error">{errors.username}</span>}
          </label>
          <label className="field login-field">
            <span className="field__label">비밀번호</span>
            <span className="login-field__control">
              <input className="field__input" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="비밀번호를 입력해주세요." value={form.password} aria-invalid={Boolean(errors.password)} onChange={(event) => updateField('password', event.target.value)} />
              <button className={`login-field__visibility${showPassword ? ' is-visible' : ''}`} type="button" aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'} aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>
                <img src={passwordHiddenIcon} alt="" />
              </button>
            </span>
            {errors.password && <span className="field__error">{errors.password}</span>}
          </label>
          <label className="field login-field">
            <span className="field__label">이름</span>
            <input className="field__input" autoComplete="name" placeholder="이름을 입력해주세요." value={form.name} aria-invalid={Boolean(errors.name)} onChange={(event) => updateField('name', event.target.value)} />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </label>
          {message && <p className="auth-form__error" role="alert">{message}</p>}
          <button className="button login-card__button signup-card__submit" type="submit">가입</button>
          <button className="button button--secondary login-card__button signup-card__cancel" type="button" onClick={() => navigate('/login')}>취소</button>
        </form>
        <div className="signup-card__divider">
          <span className="signup-card__rule" aria-hidden="true"><img src={dividerLeft} alt="" /></span>
          <span>OR</span>
          <span className="signup-card__rule" aria-hidden="true"><img src={dividerRight} alt="" /></span>
        </div>
        <button className="auth-page__kakao login-card__button signup-card__kakao" type="button" onClick={() => window.alert('카카오 서버 설정 후 사용할 수 있습니다.')}>
          <img src={kakaoIcon} alt="" />
          카카오로 시작하기
        </button>
      </section>
    </main>
  );
}
