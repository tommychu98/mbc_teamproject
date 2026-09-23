import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand"><strong>DIPTYQUE</strong><span>PARIS · 34 BOULEVARD SAINT-GERMAIN</span></div>
        <div className="footer__links"><Link to="/about/history">Maison</Link><Link to="/contact/faq">FAQ</Link><Link to="/inquiries">Contact</Link><Link to="/board">Community</Link></div>
        <p className="footer__note">교육용 리뉴얼 프로젝트이며 DIPTYQUE 공식 서비스가 아닙니다.</p>
      </div>
    </footer>
  );
}
