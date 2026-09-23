import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useBoardStore } from '../../../store/useBoardStore';
import './Community.css';

export default function BoardDetailPage() {
  const { postId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { posts, incrementViews, toggleLike, deletePost } = useBoardStore();
  const navigate = useNavigate();
  const viewed = useRef(false);
  const post = posts.find((item) => item.id === postId);
  useEffect(() => { if (post && !viewed.current) { incrementViews(postId); viewed.current = true; } }, [incrementViews, post, postId]);
  if (!post) return <main className="board-page container"><div className="empty-state"><p>존재하지 않는 게시글입니다.</p><Link className="button" to="/board">목록으로</Link></div></main>;
  const mine = isAuthenticated && post.userId === user.id;
  const remove = () => { if (window.confirm('게시글을 삭제하시겠습니까?')) { deletePost(post.id, user.id); navigate('/board'); } };
  return <main className="board-page container"><article className="board-detail"><p className="eyebrow">{post.category}</p><h1 className="page-title">{post.title}</h1><div className="board-detail__meta"><span>{post.author}</span><span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span><span>조회 {post.views}</span><span>좋아요 {post.likes}</span></div><div className="board-detail__content">{post.content}</div><div className="board-detail__actions"><Link className="button button--secondary" to="/board">목록으로</Link><button className="button button--secondary" type="button" onClick={() => toggleLike(post.id)}><Heart size={16} /> 좋아요</button>{mine && <><Link className="button" to={`/board/${post.id}/edit`}>수정</Link><button className="button button--secondary" type="button" onClick={remove}>삭제</button></>}</div></article></main>;
}
