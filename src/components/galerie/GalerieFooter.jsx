import { useRef } from 'react';
import { Link } from 'react-router-dom';
import letterDLayers from './assets/footer/letter-d-layers.png';
import letterQBase from './assets/footer/letter-q-base.png';
import letterQFlowers from './assets/footer/letter-q-flowers.png';
import useFooterFlowers from './useFooterFlowers';
import botanicalLeft from './assets/footer/botanical-left.svg';
import botanicalRight from './assets/footer/botanical-right.svg';
import isms from './assets/footer/isms.svg';
import divider from './assets/footer/divider.svg';
import mobileLetterD from './assets/footer/letter-d.png';
import mobileLetterQ from './assets/footer/letter-q.png';
import mobileBotanical from './assets/footer/mobile-botanical.svg';
import './GalerieFooter.css';

export default function GalerieFooter({ animateFlowers = true, className = '', id }) {
    const footerRef = useRef(null);
    useFooterFlowers(footerRef, animateFlowers);
    return (
        <footer ref={footerRef} id={id} className={`galerie-footer ${className}`.trim()} aria-label="DIPTYQUE 회사 및 고객센터 안내">
            <div className="galerie-footer__wordmark" role="img" aria-label="DIPTYQUE">
                <span aria-hidden="true">{'    IPTY    UE'}</span>
                <div className="galerie-footer__letter-d" aria-hidden="true">
                    <img className="galerie-footer__mobile-letter" src={mobileLetterD} alt="" loading="lazy" />
                    <div className="galerie-footer__sprite"><img src={letterDLayers} alt="" /></div>
                    <div className="galerie-footer__flowers" data-footer-flowers>
                        <div className="galerie-footer__sprite galerie-footer__sprite--flowers"><img src={letterDLayers} alt="" /></div>
                    </div>
                </div>
                <div className="galerie-footer__letter-q" aria-hidden="true">
                    <img className="galerie-footer__mobile-letter" src={mobileLetterQ} alt="" loading="lazy" />
                    <img className="galerie-footer__letter-base" src={letterQBase} alt="" />
                    <img className="galerie-footer__flowers" data-footer-flowers src={letterQFlowers} alt="" />
                </div>
            </div>
            <img className="galerie-footer__botanical-left" src={botanicalLeft} alt="" loading="lazy" />
            <picture>
                <source media="(max-width: 767px)" srcSet={mobileBotanical} />
                <img className="galerie-footer__botanical-right" src={botanicalRight} alt="" loading="lazy" />
            </picture>
            <div className="galerie-footer__content">
                <nav className="galerie-footer__mobile-links" aria-label="고객 안내">
                    <Link to="/contact/faq">고객센터</Link>
                    <Link to="/contact/notices">공지사항</Link>
                    <span>개인정보처리방침</span>
                    <span>매장안내</span>
                    <Link to="/inquiries">문의하기</Link>
                </nav>
                <div className="galerie-footer__service">
                    <a className="galerie-footer__phone" href="tel:16444490">(유료) 1644-4490</a>
                    <Link to="/contact/faq">고객센터</Link>
                    <span>평일 09:00~18:00</span>
                    <span>매장안내</span><span>채팅상담</span><span>ARS</span>
                </div>
                <nav className="galerie-footer__links" aria-label="회사 안내">
                    <Link to="/about/history">ABOUT</Link>
                    <Link to="/contact/notices">공지사항</Link>
                    <Link to="/about/history">회사소개</Link>
                    <span>개인정보처리방침</span><span>이용약관</span><span>입점상담</span>
                </nav>
                <div className="galerie-footer__details">
                    <div>
                        <p className="galerie-footer__company"><span>주소: 서울특별시 강남구 도산대로 449 (청담동)</span><span className="galerie-footer__separator"> | </span><span>대표이사 : 김덕주,서민희,이승민</span><br /><span>사업자등록번호 : 201-81-53657</span><span className="galerie-footer__separator"> | </span><span>통신판매업 신고번호 : 강남-13797</span></p>
                        <p>개인정보보호책임자 : 장승환 | 호스팅사업자 : (주)신세계아이앤씨<br />고객센터(유료) : <a href="tel:16444490">1644-4490</a> | 이메일 : <a href="mailto:si_cs@sikorea.co.kr">si_cs@sikorea.co.kr</a></p>
                    </div>
                    <img className="galerie-footer__divider" src={divider} alt="" />
                    <div>
                        <p>사업자정보확인 &gt; 에스크로서비스가입확인</p>
                        <p>일부 상품의 경우 (주)신세계인터내셔날은 통신판매의 당사자가 아닌 통신판매중개자로서, 입점 판매자가 등록한 상품 정보 및 거래에 대해 책임을 지지 않습니다.</p>
                    </div>
                </div>
            </div>
            <div className="galerie-footer__bottom">
                <div className="galerie-footer__certification">
                    <span className="galerie-footer__isms"><img src={isms} alt="" /><span>ISMS</span></span>
                    <p>인증범위 신세계인터내셔날 온라인 쇼핑몰 운영<br />유효기간 2023.09.16 ~ 2026.09.15</p>
                </div>
                <p>©2022 SHINSEGAE INTERNATIONAL ALL RIGHTS RESERVED</p>
            </div>
        </footer>
    );
}
