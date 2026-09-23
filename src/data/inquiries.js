export const INITIAL_INQUIRIES = [
  {
    id: 'inquiry-001', userId: 'test-user-001', category: 'DELIVERY',
    title: '배송 일정을 확인하고 싶습니다.', content: '주문한 상품의 예상 배송 일정을 알려주세요.',
    orderNumber: 'DP-20260917-001', status: 'PENDING', answer: null,
    createdAt: '2026-09-17T10:00:00.000Z', updatedAt: null,
  },
  {
    id: 'inquiry-002', userId: 'test-user-001', category: 'PRODUCT',
    title: '향의 지속 시간이 궁금합니다.', content: '오르페옹 오 드 퍼퓸의 평균 지속 시간을 알고 싶습니다.',
    orderNumber: '', status: 'IN_REVIEW', answer: null,
    createdAt: '2026-09-15T10:00:00.000Z', updatedAt: null,
  },
  {
    id: 'inquiry-003', userId: 'test-user-001', category: 'RETURN',
    title: '교환 절차를 알려주세요.', content: '미개봉 상품의 교환 절차와 기간을 확인하고 싶습니다.',
    orderNumber: 'DP-20260911-003', status: 'ANSWERED',
    answer: '수령일로부터 14일 이내 고객센터를 통해 교환을 신청할 수 있습니다.',
    answerDepartment: 'DIPTYQUE Client Service', answerDate: '2026-09-12T06:00:00.000Z',
    createdAt: '2026-09-11T10:00:00.000Z', updatedAt: null,
  },
];
