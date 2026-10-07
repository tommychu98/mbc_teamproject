import { TEST_USER } from '../../../data/testUser';

const grades = { ESSENTIAL: 'ESSENTIAL', SIGNATURE: 'SIGNATURE', PRESTIGE: 'PRESTIGE', 에센셜: 'ESSENTIAL', 시그니처: 'SIGNATURE', 프레스티지: 'PRESTIGE' };

export function getMembership(user) {
  const defaults = user?.id === TEST_USER.id
    ? { grade: 'SIGNATURE', points: 2026, coupons: 1 }
    : { grade: 'ESSENTIAL', points: 0, coupons: user ? 1 : 0 };
  const membership = { ...defaults, ...user?.membership };
  const balance = (value) => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
  return { ...membership, grade: grades[membership.grade] ?? defaults.grade, points: balance(membership.points), coupons: balance(membership.coupons) };
}
