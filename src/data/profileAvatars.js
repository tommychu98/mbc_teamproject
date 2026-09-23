export const PROFILE_AVATARS = Array.from({ length: 6 }, (_, index) => ({
  id: `character-0${index + 1}`,
  name: ['블랙 캣', '화이트 래빗', '브라운 베어', '레드 폭스', '그레이 울프', '크림 퍼피'][index],
  src: `/images/characters/character-0${index + 1}.svg`,
}));
