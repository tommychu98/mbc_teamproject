import { Link } from 'react-router-dom';
import '../content/StatusPage.css';

export default function AuthStatusPage({ mode }) {
  const error = mode === 'error';
  return <main className="status-page container"><p className="eyebrow">Authentication</p><h1 className="page-title">{error ? 'Sign-in error' : 'Kakao callback'}</h1><p>{error ? '로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.' : '카카오 인증 서버 연동을 위한 콜백 경로입니다. 현재 데모에서는 테스트 로그인을 이용해 주세요.'}</p><Link className="button" to="/login">로그인으로</Link></main>;
}
