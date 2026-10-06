import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import background from './assets/bg image 2.png';
import dateDivider from './assets/detail-date-divider.svg';
import sectionLine from './assets/detail-section-line.svg';
import bottomLine from './assets/detail-bottom-line.svg';
import pencil from './assets/detail-pencil.svg';
import backArrow from './assets/detail-back.svg';
import './ProductInquiryDetail.css';

const exampleContents = {
  'sample-2': '한국에서만 구매할 수 있는 한정판 상품이 있나요?\n온라인 스토어와 매장의 판매 여부도 궁금합니다.',
  'sample-3': '선물용으로 구매하려고 합니다.\n선물 포장 신청 방법을 안내 부탁드립니다.',
  'sample-1': '현재 품절된 상품의 재입고 일정이 궁금합니다.\n재입고 알림을 받을 수 있는 방법도 안내 부탁드립니다.',
  'sample-4': '찾고 있는 상품이 온라인 스토어에 보이지 않습니다.\n단종 여부와 다시 구매할 수 있는지 궁금합니다.',
  'sample-5': '배송 중 향수병이 파손될 우려가 있나요?\n상품을 안전하게 받을 수 있도록 어떤 포장을 사용하는지 궁금합니다.',
  'sample-6': '오르페옹 오 드 뚜왈렛의 출시 일정이 궁금합니다.\n온라인 스토어에서도 구매할 수 있는지 안내 부탁드립니다.',
};
const exampleAnswers = {
  'sample-2': '안녕하세요, 딥디크입니다.\n한정판 상품의 판매 여부는 시즌과 매장에 따라 달라질 수 있습니다.\n관심 있는 상품명과 방문 예정 매장을 알려주시면 확인 후 안내드리겠습니다.\n\n더 궁금하신 점이 있으시면 언제든지 문의해주세요.\n감사합니다.',
  'sample-3': '안녕하세요, 딥디크입니다.\n선물 포장 가능 여부는 상품과 주문 방식에 따라 달라질 수 있습니다.\n주문 시 선물 포장 옵션을 확인하시거나 고객센터에 문의해 주세요.\n\n더 궁금하신 점이 있으시면 언제든지 문의해주세요.\n감사합니다.',
};

export default function ProductInquiryDetail({ inquiry, user, listUrl }) {
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [inquiry.id]);
  const canEdit = !inquiry.isExample && user?.id === inquiry.userId && inquiry.status !== 'ANSWERED';
  const isAnswered = inquiry.status === 'ANSWERED';
  const answerDate = inquiry.answerDate ? new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(inquiry.answerDate)) : null;
  const date = inquiry.createdAt ? new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(inquiry.createdAt)) : '작성일 미등록';

  return <main className={`product-inquiry product-inquiry-detail${isAnswered ? ' product-inquiry-detail--answered' : ''}`}>
    <img className="product-inquiry__background product-inquiry__background--right" src={background} alt="" aria-hidden="true" />
    <div className="product-inquiry__content">
      <header className="product-inquiry-detail__header">
        <p>상품문의</p>
        <h1 ref={titleRef} tabIndex={-1}>{inquiry.title}</h1>
        <div className="product-inquiry-detail__meta">
          <span className={`product-inquiry__badge${isAnswered ? ' product-inquiry__badge--answered' : ''}`}>{isAnswered ? '답변완료' : '답변대기'}</span>
          <img src={dateDivider} alt="" />
          <time dateTime={inquiry.createdAt || undefined}>{date}</time>
        </div>
      </header>
      <article className="product-inquiry-detail__card" aria-label="상품문의 상세">
        {canEdit && <Link className="product-inquiry-detail__edit" to={`/inquiries/${inquiry.id}/edit`}><span><img src={pencil} alt="" /></span>수정하기</Link>}
        <section>
          <h2 className="product-inquiry-detail__section-title">문의 내용<span><img src={sectionLine} alt="" /></span></h2>
          <div className="product-inquiry-detail__question">{inquiry.isExample ? exampleContents[inquiry.id] : inquiry.content}</div>
        </section>
        <section>
          <h2 className="product-inquiry-detail__section-title">답변 내용<span><img src={sectionLine} alt="" /></span></h2>
          <div className={`product-inquiry-detail__waiting${isAnswered ? ' product-inquiry-detail__waiting--answered' : ''}`}>
            {isAnswered && answerDate && <time className="product-inquiry-detail__answer-date" dateTime={inquiry.answerDate}>{answerDate}</time>}
            {isAnswered ? <p>{inquiry.isExample ? exampleAnswers[inquiry.id] : inquiry.answer || '등록된 답변 내용이 없습니다.'}</p> : <p>문의내용을 확인하고 있습니다.<br />답변이 등록되면 이 화면에서 확인할 수 있습니다.</p>}
          </div>
        </section>
        <div className="product-inquiry-detail__bottom-line"><img src={bottomLine} alt="" /></div>
        <Link className="product-inquiry-detail__back" to={listUrl}><span>Back to List</span><img src={backArrow} alt="" /></Link>
      </article>
    </div>
  </main>;
}
