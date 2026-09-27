import logoD from './assets/footer-logo-d.png';
import logoQ from './assets/footer-logo-q.png';
import botanicalLeft from './assets/footer-botanical-left.svg';
import botanicalRight from './assets/footer-botanical-right.svg';
import isms from './assets/footer-isms.svg';
import divider from './assets/footer-divider.svg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="fragrances-footer" aria-label="Diptyque 회사 정보">
      <div className="fragrances-footer__scene">
        <div className="fragrances-footer__brand" role="img" aria-label="DIPTYQUE">
          <p className="fragrances-footer__wordmark" aria-hidden="true">{'    IPTY    UE'}</p>
          <img className="fragrances-footer__logo-q" src={logoQ} alt="" width="393" height="393" />
          <img className="fragrances-footer__logo-d" src={logoD} alt="" width="325" height="325" />
        </div>
        <img className="fragrances-footer__botanical-left" src={botanicalLeft} alt="" width="403.014" height="584.666" />
        <img className="fragrances-footer__botanical-right" src={botanicalRight} alt="" width="266.97" height="422.702" />
        <div className="fragrances-footer__contact">
          <strong>(유료) 1644-4490</strong>
          <span>고객센터</span><span>평일 09:00~18:00</span><span>매장안내</span><span>채팅상담</span><span>ARS</span>
        </div>
        <ul className="fragrances-footer__menu" aria-label="회사 안내">
          {['ABOUT', '공지사항', '회사소개', '개인정보처리방침', '이용약관', '입점상담'].map((label) => <li key={label}>{label}</li>)}
        </ul>
        <p className="fragrances-footer__company">
          {'주소: 서울특별시 강남구 도산대로 449 (청담동) | 대표이사 : 김덕주,서민희,이승민 '}<br />
          사업자등록번호 : 201-81-53657 | 통신판매업 신고번호 : 강남-13797
        </p>
        <p className="fragrances-footer__privacy">
          {'개인정보보호책임자 : 장승환 | 호스팅사업자 : (주)신세계아이앤씨 '}<br />
          고객센터(유료) : 1644-4490 | 이메일 : si_cs@sikorea.co.kr
        </p>
        <p className="fragrances-footer__verification">{'사업자정보확인 > 에스크로서비스가입확인 '}</p>
        <p className="fragrances-footer__disclaimer">일부 상품의 경우 (주)신세계인터내셔날은 통신판매의 당사자가 아닌 통신판매중개자로서, 입점 판매자가 등록한 상품 정보 및 거래에 대해 책임을 지지 않습니다.</p>
        <img className="fragrances-footer__divider" src={divider} alt="" width="98" height="1" />
        <div className="fragrances-footer__certification">
          <div className="fragrances-footer__isms"><img src={isms} alt="" width="32" height="24" /><span>ISMS</span></div>
          <div className="fragrances-footer__certification-text"><p>인증범위 신세계인터내셔날 온라인 쇼핑몰 운영</p><p>유효기간 2023.09.16 ~ 2026.09.15</p></div>
        </div>
        <p className="fragrances-footer__copyright">©2022 SHINSEGAE INTERNATIONAL ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}
