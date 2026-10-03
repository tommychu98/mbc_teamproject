import { useId, useState } from 'react';
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
];

export default function FAQ() {
  const instanceId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [openId, setOpenId] = useState('address');
  const searchTerm = query.trim().toLocaleLowerCase();
  const visibleQuestions = questions.filter((item) => (
    (category === '전체' || item.category === category)
    && `${item.question} ${item.answer}`.toLocaleLowerCase().includes(searchTerm)
  ));

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
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="궁금한 내용을 검색해보세요" />
          </label>
          <div className="contact-faq__categories" role="group" aria-label="질문 카테고리">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </div>
        <section className="contact-faq__list" aria-label="자주 묻는 질문 목록">
          {visibleQuestions.map((item) => {
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
      </div>
    </main>
  );
}
