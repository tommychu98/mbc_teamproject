import { Link } from 'react-router-dom';
import './Footer.css';

const footerAssets = '/images/footer';

export default function Footer() {
    return (
        <footer className="footer" data-node-id="3498:2119">
            <div className="footer__canvas">
                <div className="footer__wordmark" aria-label="DIPTYQUE">
                    <span aria-hidden="true">&nbsp;&nbsp;&nbsp;&nbsp;IPTY&nbsp;&nbsp;&nbsp;&nbsp;UE</span>
                    <img className="footer__brand-object footer__brand-object--left" src={`${footerAssets}/brand-object-left.png`} alt="" />
                    <img className="footer__brand-object footer__brand-object--right" src={`${footerAssets}/brand-object-right.png`} alt="" />
                </div>

                <img className="footer__decoration footer__decoration--left" src={`${footerAssets}/decor-left.svg`} alt="" />
                <img className="footer__decoration footer__decoration--right" src={`${footerAssets}/decor-right.svg`} alt="" />

                <div className="footer__navigation">
                    <div className="footer__support">
                        <a className="footer__support-phone" href="tel:1644-4490">(유료) 1644-4490</a>
                        <Link to="/contact/faq">고객센터</Link>
                        <span>평일 09:00~18:00</span>
                        <Link to="/contact/membership">매장안내</Link>
                        <Link to="/inquiries">채팅상담</Link>
                        <span>ARS</span>
                    </div>
                    <nav className="footer__links" aria-label="Footer">
                        <Link to="/about/history">ABOUT</Link>
                        <Link to="/contact/notices">공지사항</Link>
                        <Link to="/about/history">회사소개</Link>
                        <Link to="/mypage/profile">개인정보처리방침</Link>
                        <Link to="/contact/faq">이용약관</Link>
                        <Link to="/inquiries">입점상담</Link>
                    </nav>
                </div>

                <div className="footer__company">
                    <div className="footer__company-primary">
                        <p>주소: 서울특별시 강남구 도산대로 449 (청담동) | 대표이사 : 김덕주,서민희,이승민</p>
                        <p>사업자등록번호 : 201-81-53657 | 통신판매업 신고번호 : 강남-13797</p>
                        <div className="footer__company-secondary">
                            <p>개인정보보호책임자 : 장승환 | 호스팅사업자 : (주)신세계아이앤씨</p>
                            <p>고객센터(유료) : 1644-4490 | 이메일 : si_cs@sikorea.co.kr</p>
                        </div>
                    </div>
                    <img className="footer__divider" src={`${footerAssets}/divider.svg`} alt="" />
                    <div className="footer__company-note">
                        <p>사업자정보확인 &gt; 에스크로서비스가입확인</p>
                        <p>일부 상품의 경우 (주)신세계인터내셔날은 통신판매의 당사자가 아닌 통신판매중개자로서,<br />입점 판매자가 등록한 상품 정보 및 거래에 대해 책임을 지지 않습니다.</p>
                    </div>
                </div>

                <div className="footer__isms">
                    <div className="footer__isms-mark">
                        <img src={`${footerAssets}/isms-mark.svg`} alt="" />
                        <span>ISMS</span>
                    </div>
                    <div>
                        <p>인증범위 신세계인터내셔날 온라인 쇼핑몰 운영</p>
                        <p>유효기간 2023.09.16 ~ 2026.09.15</p>
                    </div>
                </div>

                <p className="footer__copyright">©2022 SHINSEGAE INTERNATIONAL ALL RIGHTS RESERVED</p>
            </div>
        </footer>
    );
}
