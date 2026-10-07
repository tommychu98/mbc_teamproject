import { useEffect, useId, useRef, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { TEST_USER } from '../../../data/testUser';
import essential from './assets/이미지1.png';
import signature from './assets/이미지2.png';
import prestige from './assets/이미지3.png';
import flowers from './assets/배경1.png';
import arch from './assets/배경2.png';
import bird from './assets/배경3.png';
import coins from './assets/coins.svg';
import gift from './assets/gift.svg';
import bag from './assets/bag.svg';
import crown from './assets/crown.svg';
import ticket from './assets/ticket.svg';
import divider from './assets/divider.svg';
import './Membership.css';

const tiers = [
    { name: 'ESSENTIAL', label: '에센셜', image: essential, lines: ['딥디크의 첫 만남을 위한', '기본 혜택을 제공합니다.'] },
    { name: 'SIGNATURE', label: '시그니처', image: signature, lines: ['더 풍성하고 특별한 혜택으로', '일상이 더욱 향기로워집니다.'] },
    { name: 'PRESTIGE', label: '프레스티지', image: prestige, lines: ['가장 특별한 고객님을 위한', '단 하나의 멤버십입니다.'] },
];
const benefits = [
    { icon: coins, title: '구매 적립', description: '구매 시 포인트가 적립됩니다.' },
    { icon: gift, title: '생일 혜택', description: '생일을 맞이한 회원님께 특별한 혜택을 드립니다.' },
    { icon: bag, title: '회원 전용 서비스', description: '회원만을 위한 특별한 서비스를 제공합니다.' },
];

// Proposed benefits for this renewal project, not official Diptyque policy.
const tierGuides = {
    ESSENTIAL: {
        invitation: '나만의 향을 발견하는 첫 만남',
        qualification: '회원가입 시 부여 · 최근 12개월 구매금액 50만원 미만',
        benefits: [
            ['웰컴 쿠폰', '가입 시 5% 쿠폰 1장'],
            ['생일의 선물', '생일 월 5% 쿠폰 1장'],
            ['배송', '실결제 10만원 이상 주문 시 무료배송'],
            ['포인트', '상품 실결제금액의 1% 적립'],
            ['향의 발견', '구매 시 향수 샘플 1종'],
        ],
    },
    SIGNATURE: {
        invitation: '취향이 깊어지는 향기로운 일상',
        qualification: '최근 12개월 구매금액 50만원 이상 ~ 150만원 미만',
        benefits: [
            ['시즌 쿠폰', '분기별 7% 쿠폰 1장'],
            ['생일의 선물', '생일 월 10% 쿠폰 1장'],
            ['배송', '구매금액과 관계없이 무료배송'],
            ['포인트', '상품 실결제금액의 3% 적립'],
            ['향의 발견', '구매 시 향수 샘플 2종'],
            ['특별한 초대', '신제품 소식과 시즌 컬렉션 사전 안내'],
        ],
    },
    PRESTIGE: {
        invitation: '당신의 취향을 위한 특별한 환대',
        qualification: '최근 12개월 구매금액 150만원 이상',
        benefits: [
            ['시즌 쿠폰', '분기별 10% 쿠폰 1장'],
            ['생일의 선물', '생일 월 15% 쿠폰 1장'],
            ['배송', '구매금액과 관계없이 무료배송'],
            ['포인트', '상품 실결제금액의 5% 적립'],
            ['선물의 예술', '향수 샘플 3종 · 선물 포장·메시지 카드'],
            ['특별한 초대', '프라이빗 시향 행사 우선 예약'],
        ],
    },
};

export default function Membership({ membership }) {
    const user = useAuthStore((state) => state.user);
    const membershipInfo = membership ?? { grade: '일반회원', points: user?.id === TEST_USER.id ? 2026 : 0, coupons: 0 };
    const [selectedTier, setSelectedTier] = useState('SIGNATURE');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const guideRef = useRef(null);
    const guideId = useId();
    const activeTier = tiers.find((tier) => tier.name === selectedTier);
    const activeGuide = tierGuides[selectedTier];
    useEffect(() => {
        if (!isGuideOpen) return;
        const dialog = guideRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [isGuideOpen]);
    const openGuide = (name) => {
        setSelectedTier(name);
        setIsGuideOpen(true);
    };
    const summary = [
        { icon: crown, label: '현재 등급', value: membershipInfo.grade },
        { icon: coins, label: '보유 포인트', value: `${Number(membershipInfo.points ?? 0).toLocaleString('ko-KR')} P` },
        { icon: ticket, label: '보유 쿠폰', value: `${Number(membershipInfo.coupons ?? 0).toLocaleString('ko-KR')} 장` },
    ];
    return (
        <main className="membership">
            <div className="membership__decor" aria-hidden="true">
                <img className="membership__bird" src={bird} alt="" />
                <img className="membership__arch" src={arch} alt="" />
                <div className="membership__flowers"><img src={flowers} alt="" /></div>
            </div>
            <header className="membership__hero">
                <p className="membership__eyebrow">Contact us</p>
                <h1>Membership</h1>
                <p className="membership__lead">딥디크의 특별한 혜택과 회원 서비스를 만나보세요</p>
            </header>
            <div className="membership__content">
                <section className="membership__tiers" aria-labelledby="membership-tiers-title">
                    <div className="membership__section-heading">
                        <p>Profile · Information</p>
                        <h2 id="membership-tiers-title">세 가지 등급의 특별한 혜택</h2>
                    </div>
                    <div className="membership__tier-grid" aria-label="멤버십 등급 선택">
                        {tiers.map((tier) => (
                            <button key={tier.name} type="button" className={`membership__tier${selectedTier === tier.name ? ' membership__tier--selected' : ''}`} aria-pressed={selectedTier === tier.name} aria-haspopup="dialog" aria-controls={guideId} onClick={() => openGuide(tier.name)}>
                                <span className="membership__tier-name">{tier.name}</span>
                                <span className="membership__tier-label">{tier.label}</span>
                                <span className="membership__tier-rule"><img src={divider} alt="" /></span>
                                <span className="membership__tier-description">{tier.lines.map((line) => <span key={line}>{line}</span>)}</span>
                                <span className={`membership__tier-image membership__tier-image--${tier.name.toLowerCase()}`}><img src={tier.image} alt="" /></span>
                            </button>
                        ))}
                    </div>
                </section>
                <section className="membership__benefits" aria-labelledby="membership-benefits-title">
                    <div className="membership__section-heading">
                        <p>Membership Benefits</p>
                        <h2 id="membership-benefits-title">회원만을 위한 혜택</h2>
                    </div>
                    <div className="membership__benefit-grid">
                        {benefits.map((benefit) => <article className="membership__benefit" key={benefit.title}>
                            <span className="membership__icon"><img src={benefit.icon} alt="" /></span>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </article>)}
                    </div>
                    <section className="membership__summary" aria-labelledby="membership-summary-title">
                        <h2 id="membership-summary-title">MY MEMBERSHIP</h2>
                        <dl className="membership__summary-grid">
                            {summary.map((item) => <div className="membership__summary-item" key={item.label}>
                                <img className="membership__summary-divider" src={divider} alt="" />
                                <span className="membership__icon"><img src={item.icon} alt="" /></span>
                                <div><dt>{item.label}</dt><dd>{item.value}</dd></div>
                            </div>)}
                        </dl>
                    </section>
                </section>
            </div>
            <dialog
                ref={guideRef}
                id={guideId}
                className="membership__guide"
                aria-labelledby={`${guideId}-title`}
                aria-describedby={`${guideId}-notice ${guideId}-description`}
                onCancel={() => setIsGuideOpen(false)}
                onClose={() => setIsGuideOpen(false)}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setIsGuideOpen(false);
                }}
            >
                <div className="membership__guide-content">
                    <button className="membership__guide-close" type="button" aria-label="등급 안내 닫기" onClick={() => setIsGuideOpen(false)}>×</button>
                    <p className="membership__eyebrow">MEMBERSHIP GUIDE</p>
                    <h2 id={`${guideId}-title`}>{activeTier.label} 등급 안내</h2>
                    <p className="membership__guide-name">{activeTier.name}</p>
                    <p className="membership__guide-notice" id={`${guideId}-notice`}>
                        <span>* 리뉴얼 프로젝트용 가상 정책입니다.</span>
                        <span>딥디크 공식 혜택이 아니며 실제 제공되지 않습니다.</span>
                    </p>
                    <p id={`${guideId}-description`} className="membership__guide-description">{activeGuide.invitation}</p>
                    <p className="membership__guide-qualification">{activeGuide.qualification}</p>
                    <dl className="membership__guide-benefits">
                        {activeGuide.benefits.map(([label, description]) => (
                            <div key={label}><dt>{label}</dt><dd>{description}</dd></div>
                        ))}
                    </dl>
                    <button className="membership__guide-confirm" type="button" onClick={() => setIsGuideOpen(false)}>확인</button>
                </div>
            </dialog>
        </main>
    );
}
