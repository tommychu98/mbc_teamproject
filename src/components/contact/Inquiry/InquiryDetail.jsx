import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useInquiryStore } from '../../../store/useInquiryStore';
import './Inquiry.css';

const statusLabels = { PENDING: '접수 완료', IN_REVIEW: '확인 중', ANSWERED: '답변 완료' };
const categoryLabels = { PRODUCT: '상품 문의', DELIVERY: '배송 문의', RETURN: '교환·반품 문의', ACCOUNT: '회원정보 문의', ETC: '기타 문의' };

export default function InquiryDetailPage() {
  const { inquiryId } = useParams();
  const user = useAuthStore((state) => state.user);
  const { getById, deleteInquiry } = useInquiryStore();
  const navigate = useNavigate();
  const location = useLocation();
  const inquiry = getById(inquiryId);
  if (!inquiry || inquiry.userId !== user.id) return <main className="inquiry-page container"><div className="empty-state"><p>문의가 없거나 조회 권한이 없습니다.</p><Link className="button" to="/inquiries">목록으로</Link></div></main>;
  const remove = () => { if (window.confirm('고객문의를 삭제하시겠습니까?\n삭제한 문의는 복구할 수 없습니다.')) { deleteInquiry(inquiry.id, user.id); navigate('/inquiries', { state: { message: '문의가 삭제되었습니다.' } }); } };
  return <main className="inquiry-page container"><article className="inquiry-detail">
    <p className="eyebrow">{categoryLabels[inquiry.category]}</p><h1 className="page-title">{inquiry.title}</h1>
    {location.state?.message && <p role="status">{location.state.message}</p>}
    <div className="inquiry-detail__meta"><span className={`status-badge status-badge--${inquiry.status}`}>{statusLabels[inquiry.status]}</span><span>작성 {new Date(inquiry.createdAt).toLocaleString('ko-KR')}</span>{inquiry.updatedAt && <span>수정 {new Date(inquiry.updatedAt).toLocaleString('ko-KR')}</span>}{inquiry.orderNumber && <span>주문번호 {inquiry.orderNumber}</span>}</div>
    <div className="inquiry-detail__content">{inquiry.content}</div>
    <section className="inquiry-detail__answer"><h2>Client Service</h2>{inquiry.answer ? <><p>{inquiry.answer}</p><small>{inquiry.answerDepartment} · {new Date(inquiry.answerDate).toLocaleDateString('ko-KR')}</small></> : <p>문의 내용을 확인하고 있습니다.<br />답변이 등록되면 이 화면에서 확인할 수 있습니다.</p>}</section>
    <div className="inquiry-detail__actions"><Link className="button button--secondary" to="/inquiries">목록으로</Link>{inquiry.status !== 'ANSWERED' && <Link className="button" to={`/inquiries/${inquiry.id}/edit`}>문의 수정</Link>}{inquiry.status === 'PENDING' && <button className="button button--secondary" type="button" onClick={remove}>문의 삭제</button>}</div>
    {inquiry.status === 'ANSWERED' && <p>답변 완료 문의는 수정할 수 없습니다.</p>}
  </article></main>;
}
