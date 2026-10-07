import { useId, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import backgroundLeft from './assets/faqbg1.png';
import backgroundRight from './assets/faqbg2.png';
import plusIcon from './assets/plus.svg';
import minusIcon from './assets/minus.svg';
import searchIcon from './assets/search.svg';
import './FAQ.css';

const categories = ['전체', '주문/배송', '교환/반품', '제품/향수', '회원/멤버쉽', '매장/서비스'];
// The design supplies the address answer; other answers refer to existing support channels.
const questions = [
  { id: 'payment', category: '주문/배송', question: '주문 후 결제수단을 변경 할 수 있나요?', answer: '결제수단 변경에 관한 안내는 주문 상태에 따라 달라질 수 있습니다. 주문 내역을 확인한 뒤 고객센터에 문의해 주세요.' },
  { id: 'store', category: '매장/서비스', question: '공식 온라인 스토어 이용 안내', answer: '공식 온라인 스토어에서 제품을 확인하고 주문할 수 있습니다. 스토어 이용 중 궁금한 사항은 고객센터에 문의해 주세요.' },
  { id: 'address', category: '주문/배송', question: '배송지 변경이 가능한가요?', answer: '배송 준비가 시작되기 전에는 배송지 변경이 가능합니다.\n주문 상태가  ‘상품 준비 중’ 또는 ‘배송 중’ 으로 변경된 이후에는 주소 변경이 어려울 수 있으므로,\n변경이 필요한 경우 고객센터를 통해 빠르게 문의해 주세요' },
  { id: 'returns', category: '교환/반품', question: '교환 및 반품은 어떻게 진행되나요?', answer: '주문번호와 문의하실 상품을 확인한 뒤 고객센터에 문의해 주세요. 상품 상태와 문의 내용에 맞는 안내를 확인하실 수 있습니다.' },
  { id: 'gift', category: '매장/서비스', question: '기프트 서비스가 가능한가요?', answer: '기프트 서비스에 관한 안내는 상품과 주문에 따라 달라질 수 있습니다. 원하는 상품과 함께 고객센터에 문의해 주세요.' },
  { id: 'orders', category: '주문/배송', question: '주문현황은 어디서 확인하나요?', answer: 'My Page의 MY ORDERS에서 주문 내역과 배송 현황을 확인해 주세요.' },
  { id: 'membership-benefits', category: '회원/멤버쉽', question: '멤버십 혜택은 어디서 확인할 수 있나요?', answer: 'CONTACT US의 멤버십 페이지에서 회원 혜택과 서비스 안내를 확인하실 수 있습니다. 혜택별 적용 조건과 이용 방법은 해당 페이지의 안내를 확인해 주세요.' },
  { id: 'membership-profile', category: '회원/멤버쉽', question: '회원정보는 어떻게 변경하나요?', answer: '로그인 후 MY PAGE의 회원정보 관리에서 변경 가능한 정보를 확인해 주세요. 정보 수정 중 어려움이 있으시면 1:1 문의를 이용해 주세요.' },
  { id: 'membership-account', category: '회원/멤버쉽', question: '로그인이 되지 않을 때는 어떻게 해야 하나요?', answer: '가입 시 사용한 로그인 방법과 입력 정보를 먼저 확인해 주세요. 문제가 계속되면 오류 메시지와 이용 상황을 고객센터에 알려 주세요. 비밀번호는 문의 내용에 포함하지 마세요.' },
  { id: 'fragrance-choice', category: '제품/향수', question: '나에게 맞는 향수는 어떻게 선택하나요?', answer: '상품 상세 페이지에서 향의 노트와 특징을 살펴보고 평소 좋아하는 향과 비교해 보세요. 같은 향도 피부와 사용 환경에 따라 다르게 느껴질 수 있으므로, 가능하다면 매장에서 직접 시향해 보시는 것을 권해 드립니다.' },
  { id: 'fragrance-types', category: '제품/향수', question: '오 드 뚜왈렛과 오 드 퍼퓸은 어떤 차이가 있나요?', answer: '두 제품은 향의 농도와 구성에 차이가 있을 수 있습니다. 같은 이름의 향도 표현이 다를 수 있으니 각 상품의 상세 설명을 비교해 주세요. 지속 시간과 발향은 피부 상태 및 사용 환경에 따라 달라질 수 있습니다.' },
  { id: 'fragrance-storage', category: '제품/향수', question: '향수는 어떻게 보관해야 하나요?', answer: '직사광선과 높은 온도, 급격한 온도 변화를 피해 보관해 주세요. 사용 후에는 뚜껑을 닫고, 제품에 표시된 보관 방법과 사용 안내를 확인해 주세요.' },
  { id: 'candle-use', category: '제품/향수', question: '캔들을 사용할 때 주의할 점은 무엇인가요?', answer: '제품에 표시된 사용 안내를 먼저 확인해 주세요. 불이 붙은 캔들은 자리를 비우지 말고, 가연성 물건과 어린이·반려동물의 손이 닿는 곳을 피해 안정된 표면에서 사용해 주세요. 사용 중 용기가 뜨거울 수 있으니 충분히 식힌 후 옮겨 주세요.' },
];

export default function FAQ() {
  const instanceId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [openId, setOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;
  const searchTerm = query.trim().toLocaleLowerCase();
  const visibleQuestions = questions.filter((item) => (
    (category === '전체' || item.category === category)
    && `${item.question} ${item.answer}`.toLocaleLowerCase().includes(searchTerm)
  ));
  const pageCount = Math.ceil(visibleQuestions.length / questionsPerPage);
  const pageQuestions = visibleQuestions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

  return (
    <main className="contact-faq" aria-labelledby={`${instanceId}-title`}>
      <div className="contact-faq__decoration" aria-hidden="true">
        <img className="contact-faq__background contact-faq__background--left" src={backgroundLeft} alt="" />
        <img className="contact-faq__background contact-faq__background--right" src={backgroundRight} alt="" />
      </div>
      <div className="contact-faq__content">
        <header className="contact-faq__intro">
          <p className="contact-faq__eyebrow">Contact us</p>
          <h1 id={`${instanceId}-title`}>FAQ</h1>
          <div className="contact-faq__description"><p>Frequently asked questions</p><p>자주 묻는 질문을 확인해 보세요</p></div>
        </header>
        <div className="contact-faq__controls">
          <label className="contact-faq__search">
            <span className="sr-only">자주 묻는 질문 검색</span>
            <span className="contact-faq__search-icon" aria-hidden="true"><img src={searchIcon} alt="" /></span>
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); setOpenId(null); }} placeholder="궁금한 내용을 검색해보세요" />
          </label>
          <div className="contact-faq__categories" role="group" aria-label="질문 카테고리">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setCurrentPage(1); setOpenId(null); }}>{item}</button>)}
          </div>
        </div>
        <section id={`${instanceId}-list`} className="contact-faq__list" aria-label="자주 묻는 질문 목록">
          {pageQuestions.map((item) => {
            const isOpen = openId === item.id;
            const questionId = `${instanceId}-${item.id}-question`;
            const answerId = `${instanceId}-${item.id}-answer`;
            return (
              <div className={`contact-faq__item${isOpen ? ' contact-faq__item--open' : ''}`} key={item.id}>
                <h2>
                  <button className="contact-faq__question" id={questionId} type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenId(isOpen ? null : item.id)}>
                    <span className="contact-faq__number">{String(questions.indexOf(item) + 1).padStart(2, '0')}</span>
                    <span className="contact-faq__question-text">{item.question}</span>
                    <span className="contact-faq__toggle" aria-hidden="true"><img src={isOpen ? minusIcon : plusIcon} alt="" /></span>
                  </button>
                </h2>
                <div className="contact-faq__answer" id={answerId} role="region" aria-labelledby={questionId} hidden={!isOpen}><p>{item.answer}</p></div>
              </div>
            );
          })}
          {visibleQuestions.length === 0 && <p className="contact-faq__empty" role="status">해당하는 질문이 없습니다. 다른 검색어나 카테고리를 선택해 주세요.</p>}
        </section>
        {pageCount > 1 && <nav className="contact-faq__pagination" aria-label="FAQ 페이지">
          <button type="button" className="contact-faq__page-button" aria-label="첫 페이지" aria-controls={`${instanceId}-list`} disabled={currentPage === 1} onClick={() => { setCurrentPage(1); setOpenId(null); }}><ChevronsLeft size={20} strokeWidth={1} aria-hidden="true" /></button>
          <button type="button" className="contact-faq__page-button" aria-label="이전 페이지" aria-controls={`${instanceId}-list`} disabled={currentPage === 1} onClick={() => { setCurrentPage(currentPage - 1); setOpenId(null); }}><ChevronLeft size={20} strokeWidth={1} aria-hidden="true" /></button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button key={index} type="button" className="contact-faq__page-button" aria-label={`${index + 1}페이지`} aria-current={currentPage === index + 1 ? 'page' : undefined} aria-controls={`${instanceId}-list`} onClick={() => { setCurrentPage(index + 1); setOpenId(null); }}>{index + 1}</button>
          ))}
          <button type="button" className="contact-faq__page-button" aria-label="다음 페이지" aria-controls={`${instanceId}-list`} disabled={currentPage === pageCount} onClick={() => { setCurrentPage(currentPage + 1); setOpenId(null); }}><ChevronRight size={20} strokeWidth={1} aria-hidden="true" /></button>
          <button type="button" className="contact-faq__page-button" aria-label="마지막 페이지" aria-controls={`${instanceId}-list`} disabled={currentPage === pageCount} onClick={() => { setCurrentPage(pageCount); setOpenId(null); }}><ChevronsRight size={20} strokeWidth={1} aria-hidden="true" /></button>
        </nav>}
        <p className="sr-only" role="status">검색 결과 {visibleQuestions.length}개{pageCount > 0 && `, ${currentPage}페이지`}</p>
      </div>
    </main>
  );
}
