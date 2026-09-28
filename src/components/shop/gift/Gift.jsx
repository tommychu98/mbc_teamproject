import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ProductLineBackMain,
    ProductLineExplore,
    ProductLineServices,
    ViewMoreLink,
} from '../ProductLine/ProductLine';
import './Gift.css';

const ASSET_PATH = '/images/gift';
const GIFT_SET_ROUTE = '/shop/gifts/gift-sets';

const heroImages = [
    { file: 'hero-01.png', className: 'gift-page__hero-image--one' },
    { file: 'hero-02.png', className: 'gift-page__hero-image--two' },
    { file: 'hero-03.png', className: 'gift-page__hero-image--three' },
    { file: 'hero-04.png', className: 'gift-page__hero-image--four' },
    { file: 'hero-05.png', className: 'gift-page__hero-image--five' },
    { file: 'hero-06.png', className: 'gift-page__hero-image--six' },
    { file: 'hero-07.png', className: 'gift-page__hero-image--seven' },
    { file: 'hero-08.png', className: 'gift-page__hero-image--eight' },
    { file: 'hero-09.png', className: 'gift-page__hero-image--nine' },
];

const giftSets = [
    ['gift-set-01.png', 'Set of 5 Eaux de toilette', 'Pre-composed'],
    ['gift-set-02.png', 'Set of 5 eaux de parfum', 'Les Essences de Diptyque'],
    ['gift-set-03.png', 'Lilyphéa', 'Eau de parfum'],
    ['gift-set-04.png', 'Energizing morning ritual', 'Discovery set'],
    ['gift-set-05.png', 'Set of 5 miniature candles', 'Pre-composed'],
    ['gift-set-06.png', 'Set of 3 small candles', 'Pre-composed'],
];

function GiftHero() {
    return (
        <section className="gift-page__hero">
            <div className="gift-page__canvas">
                {heroImages.map(({ file, className }) => (
                    <div className={`gift-page__hero-image ${className}`} key={file}>
                        <img src={`${ASSET_PATH}/${file}`} alt="" />
                    </div>
                ))}
                <div className="gift-page__hero-copy">
                    <p>Diptyque</p>
                    <h1>A Gift to Remember</h1>
                    <p>향으로 전하는 마음, 소중한 순간을 위한 Diptyque의 셀렉션.</p>
                </div>
            </div>
        </section>
    );
}

function GiftStory() {
    return (
        <section className="gift-page__story">
            <div className="gift-page__canvas">
                <div className="gift-page__story-image"><img src={`${ASSET_PATH}/gift-story.png`} alt="" /></div>
                <div className="gift-page__story-copy">
                    <h2>The Gift by Diptyque</h2>
                    <div>
                        <p>딥디크는 브랜드의 시작부터 선물을 위한 특별한 크리에이션을 선보여 왔습니다. 누군가에게 기쁨을 전하고, 소중한 순간을 기억하게 하며, 오래도록 남는 감정을 전하기 위해서입니다.</p>
                        <p>오늘날 Diptyque는 생일과 기념일, 감사의 마음을 전하는 순간, 결혼식은 물론 특별한 이유 없이 건네는 작은 선물까지, 어떤 순간에도 어울리는 선물을 만날 수 있는 특별한 공간이 되었습니다.</p>
                        <p>다양한 취향과 예산에 맞춰 선택할 수 있는 Diptyque의 기프트는 각자의 마음을 담은 섬세하고 세련된 선물로, 언제나 기분 좋은 기억을 남깁니다.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function GiftBoutique() {
    return (
        <section className="gift-page__boutique">
            <div className="gift-page__canvas">
                <div className="gift-page__boutique-copy">
                    <h2>The art of gifting in boutiques</h2>
                    <div>
                        <p>Diptyque 부티크에서는 선물을 준비하는 모든 과정에도 메종만의 섬세한 노하우를 담아, 작은 디테일까지 세심하게 완성합니다.</p>
                        <p>메종의 시작부터 이어져 온 ‘세 겹 접기’ 포장은 일본의 전통 예술에서 영감을 받은 방식으로, Diptyque의 크리에이션을 우아하게 감싸줍니다. 소재의 질감과 색의 조화를 섬세하게 조합해, 하나의 선물 자체가 특별한 경험이 되도록 완성합니다.</p>
                        <p>시그니처 기프트 세트에는 수작업으로 스탬프를 더하고, 받는 분의 이니셜을 새겨 더욱 개인적인 선물로 완성할 수 있습니다. 여기에 티슈 페이퍼와 레드, 블루, 그린 컬러의 리본을 더해, 어떤 순간에도 어울리는 맞춤형 기프트를 연출할 수 있습니다.</p>
                        <p>향수와 향초에는 퍼스널 인그레이빙을 더해 보다 오래 기억에 남는 특별한 오브제로 완성할 수 있습니다. 또한 리필 가능한 글라스 핸드 케어 제품과 캔들 홀더, 글라스 리드 디퓨저에도 부티크에서만 제공되는 맞춤 각인 서비스를 이용할 수 있습니다.</p>
                        <p>Diptyque 부티크에서 하나의 선물은 단순한 포장을 넘어, 세심하게 준비된 하나의 특별한 경험이 됩니다.</p>
                    </div>
                    <ViewMoreLink to={GIFT_SET_ROUTE} label="The art of gifting in boutiques" />
                </div>
                <div className="gift-page__boutique-image"><img src={`${ASSET_PATH}/boutique.png`} alt="" /></div>
            </div>
        </section>
    );
}

function GiftCard({ product }) {
    const [image, name, type] = product;
    return (
        <article className="gift-page__card">
            <Link className="gift-page__card-link" to={GIFT_SET_ROUTE} aria-label={`${name} Gift Set 보기`}>
                <span className="gift-page__card-image"><img src={`${ASSET_PATH}/${image}`} alt="" /></span>
                <span className="gift-page__card-copy"><strong>{name}</strong><small>{type}</small></span>
            </Link>
            <button className="gift-page__heart" type="button" aria-label={`${name} 찜하기`}><img src={`${ASSET_PATH}/heart.svg`} alt="" /></button>
        </article>
    );
}

function GiftSetSection() {
    const sliderRef = useRef(null);
    const dragRef = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
    const cardStep = 462;

    const scrollCards = (direction) => {
        sliderRef.current?.scrollBy({ left: direction * cardStep, behavior: 'smooth' });
    };

    const handleWheel = (event) => {
        if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
        event.preventDefault();
        sliderRef.current.scrollLeft += event.deltaY;
    };

    const handlePointerDown = (event) => {
        if (event.pointerType === 'touch') return;
        dragRef.current = { active: true, moved: false, startX: event.clientX, scrollLeft: sliderRef.current.scrollLeft };
        sliderRef.current.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!dragRef.current.active) return;
        const distance = event.clientX - dragRef.current.startX;
        if (Math.abs(distance) > 4) dragRef.current.moved = true;
        sliderRef.current.scrollLeft = dragRef.current.scrollLeft - distance;
    };

    const stopDragging = (event) => {
        if (!dragRef.current.active) return;
        dragRef.current.active = false;
        if (sliderRef.current.hasPointerCapture(event.pointerId)) sliderRef.current.releasePointerCapture(event.pointerId);
    };

    const preventDraggedClick = (event) => {
        if (!dragRef.current.moved) return;
        event.preventDefault();
        event.stopPropagation();
        dragRef.current.moved = false;
    };

    return (
        <>
            <section className="gift-page__sets">
                <div className="gift-page__canvas">
                    <h2>Find the perfect gift</h2>
                    <div className="gift-page__set-controls" aria-label="Gift 상품 슬라이드 이동">
                        <button type="button" onClick={() => scrollCards(-1)} aria-label="이전 상품">←</button>
                        <button type="button" onClick={() => scrollCards(1)} aria-label="다음 상품">→</button>
                    </div>
                    <div
                        ref={sliderRef}
                        className="gift-page__set-viewport"
                        onWheel={handleWheel}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={stopDragging}
                        onPointerCancel={stopDragging}
                        onClickCapture={preventDraggedClick}
                    >
                        <div className="gift-page__set-list">{giftSets.map((product) => <GiftCard product={product} key={product[1]} />)}</div>
                    </div>
                    <div className="gift-page__set-more"><ViewMoreLink to={GIFT_SET_ROUTE} label="Find the perfect gift" /></div>
                </div>
            </section>
            <section className="gift-page__closing">
                <p>Diptyque는 향기로운 크리에이션을 통해 사랑의 마음을 전합니다.<br />소중한 사람을 위한 완벽한 선물을 찾을 수 있도록, 특별한 기프트 셀렉션을 선보입니다.</p>
            </section>
        </>
    );
}

export default function Gift() {
    return (
        <main className="gift-page" data-node-id="3532:4634">
            <GiftHero />
            <GiftStory />
            <GiftBoutique />
            <GiftSetSection />
            <ProductLineExplore />
            <ProductLineBackMain />
            <ProductLineServices />
        </main>
    );
}
