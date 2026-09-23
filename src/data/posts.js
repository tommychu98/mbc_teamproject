const basePosts = [
  ['post-001', 'test-user-001', '테스트 사용자', 'REVIEW', '오르페옹과 함께한 하루', '파우더리한 우디 향이 차분하게 이어져 오래 기억에 남습니다.', 7, 34, '2026-09-18'],
  ['post-002', 'guest-002', 'Scent Lover', 'STYLE', '가을 공간을 위한 캔들 조합', '베이와 휘기에를 함께 켜면 깊고 편안한 분위기가 완성됩니다.', 12, 81, '2026-09-16'],
  ['post-003', 'guest-003', 'Paris Notes', 'Q&A', '첫 니치 향수 추천', '부드럽고 데일리로 쓰기 좋은 향을 추천해 주세요.', 3, 22, '2026-09-14'],
  ['post-004', 'guest-004', 'Maison 34', 'REVIEW', '플레르 드 뽀 첫인상', '아이리스와 머스크가 포근하게 겹치는 잔향이 인상적입니다.', 19, 106, '2026-09-12'],
  ['post-005', 'guest-005', 'Green Room', 'STYLE', '현관에 어울리는 룸 스프레이', '공간에 들어설 때 산뜻한 인상을 주는 향을 찾고 있습니다.', 4, 39, '2026-09-10'],
  ['post-006', 'guest-006', 'Paper Mood', 'REVIEW', '로 파피에의 깨끗한 잔향', '종이와 잉크를 떠올리게 하는 담백한 향이라 자주 손이 갑니다.', 15, 92, '2026-09-08'],
  ['post-007', 'guest-007', 'Candle Night', 'Q&A', '캔들 심지 관리 방법', '처음 사용할 때 권장 연소 시간과 심지 길이가 궁금합니다.', 2, 28, '2026-09-06'],
  ['post-008', 'guest-008', 'Object Lover', 'STYLE', '오브제로 활용하는 캔들', '빈 용기에 작은 소품을 담아 책상 위 오브제로 사용하고 있어요.', 8, 57, '2026-09-04'],
  ['post-009', 'guest-009', 'Tam Dao', 'REVIEW', '탐다오의 나무 향', '샌들우드가 건조하고 고요하게 남아 사계절 사용하기 좋습니다.', 11, 74, '2026-09-02'],
  ['post-010', 'guest-010', 'DIPTYQUE Team', 'NOTICE', '커뮤니티 이용 안내', '서로의 취향을 존중하며 향과 공간에 관한 이야기를 나눠 주세요.', 1, 143, '2026-09-01'],
];

export const INITIAL_POSTS = basePosts.map(([id, userId, author, category, title, content, likes, views, date]) => ({
  id, userId, author, category, title, content, likes, views,
  createdAt: `${date}T09:00:00.000Z`,
}));
