import { useState } from 'react';
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

export default function Membership({ membership = { grade: '일반회원', points: 0, coupons: 0 } }) {
    const [selectedTier, setSelectedTier] = useState('SIGNATURE');
    const summary = [
        { icon: crown, label: '현재 등급', value: membership.grade },
        { icon: coins, label: '보유 포인트', value: `${Number(membership.points ?? 0).toLocaleString('ko-KR')} P` },
        { icon: ticket, label: '보유 쿠폰', value: `${Number(membership.coupons ?? 0).toLocaleString('ko-KR')} 장` },
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
                            <button key={tier.name} type="button" className={`membership__tier${selectedTier === tier.name ? ' membership__tier--selected' : ''}`} aria-pressed={selectedTier === tier.name} onClick={() => setSelectedTier(tier.name)}>
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
        </main>
    );
}
