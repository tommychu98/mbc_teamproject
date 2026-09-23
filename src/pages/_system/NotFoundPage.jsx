import { Link } from 'react-router-dom';
import './StatusPage.css';

export default function NotFoundPage() {
  return <main className="status-page container"><p className="eyebrow">404</p><h1 className="page-title">Page not found</h1><p>요청한 페이지를 찾을 수 없습니다.</p><Link className="button" to="/">홈으로 돌아가기</Link></main>;
}
