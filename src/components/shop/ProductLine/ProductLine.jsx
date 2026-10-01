import { useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './ProductLine.css';

const ASSET_PATH = '/images/product-line';

const stories = {
    homeDecor: {
        title: 'Home Decor',
        tagline: 'Where artistic vision meets timeless craftsmanship.',
        paragraphs: [
            '예술적인 감각과 장인의 섬세한 손길이 만나, 딥티크만의 독창적인 오브제가 완성됩니다. 장식 컬렉션에는 메종이 오랜 시간 쌓아온 감각과 자유로운 미학이 자연스럽게 담겨 있습니다.',
            '꽃병과 캔들 액세서리, 다양한 장식 오브제는 서로 다른 소재와 색감이 어우러지며 공간에 특별한 분위기를 더합니다. 실용적인 기능을 넘어, 일상에 작은 위트와 시적인 감성을 더하는 오브제로 공간을 한층 더 개성 있게 완성합니다.',
        ],
        href: '/shop?category=home-decor',
        image: 'home-decor.png',
        imageSide: 'left',
    },
    fragrances: {
        title: 'Fragrances',
        tagline: 'A unique Diptyque journey begins with a single scent.',
        paragraphs: [
            '딥티크에게 향수는 단순한 향을 넘어, 새로운 감각의 세계로 떠나는 여행과도 같습니다. 첫 향이 닿는 순간 감각은 깨어나고, 상상력은 익숙한 일상 너머의 새로운 후각적 풍경으로 이어집니다.',
            '60년이 넘는 시간 동안 딥티크는 누구나 자신만의 방식으로 즐길 수 있는 세련된 니치 향수를 선보여 왔습니다. 오 드 뚜왈렛과 오 드 퍼퓸부터 보다 특별한 향의 표현에 이르기까지, 각각의 향은 고유한 개성과 오래도록 기억에 남는 잔향을 지니고 있습니다. 자유로운 창작 정신을 바탕으로 딥티크는 전통적인 향수의 틀에 머무르지 않고, 예상하지 못한 새로운 후각의 영역을 끊임없이 탐구합니다.',
            '우아함과 창의성, 감성이 조화롭게 어우러진 딥티크만의 시그니처 향수 컬렉션을 만나보세요.',
        ],
        href: '/shop?category=fragrances',
        image: 'fragrances.png',
        imageSide: 'right',
    },
    candlesHome: {
        title: 'Candles & Home',
        tagline: 'At Diptyque, fragrance is an art of living.',
        paragraphs: [
            '향초와 홈 향 제품은 공간에 은은한 향을 더해 일상의 분위기를 바꿔줍니다. 각 제품은 공간에 자연스럽게 스며들어 편안하고 감각적인 분위기를 만들며, 딥티크만의 개성 있는 향을 경험할 수 있게 합니다.',
            '60년이 넘는 시간 동안 딥티크는 자연에서 영감을 받아 다양한 향을 만들어왔습니다. 자연이 가진 풍부한 소재와 아름다움을 섬세하게 바라보고, 이를 향으로 표현해 왔습니다. 그렇게 완성된 향은 감각과 기억, 상상력을 자극하며 익숙한 공간에도 새로운 분위기와 이야기를 더해줍니다.',
        ],
        href: '/shop?category=candles-home',
        image: 'candles-home.png',
        imageSide: 'left-half',
    },
    bathBody: {
        title: 'Bath & Body',
        tagline: 'Inspired by nature, Diptyque elevates everyday care.',
        paragraphs: [
            '핸드 & 바디 케어 컬렉션은 향과 촉감, 그리고 피부를 위한 섬세한 케어가 조화를 이루도록 완성되었습니다. 클렌징 제품부터 핸드 케어, 바디 로션까지 각 제품은 부드러운 텍스처와 편안한 사용감을 바탕으로, 매일의 루틴을 한층 특별한 시간으로 만들어줍니다.',
            '산뜻함과 부드러움, 우아한 향이 어우러진 딥티크의 케어 제품은 단순한 피부 관리를 넘어 감각적인 휴식의 순간을 선사합니다. 손끝에 닿는 작은 제스처 하나까지도 딥티크만의 향기로운 세계로 이어집니다.',
            '나를 위한 여유로운 시간에도, 소중한 사람을 위한 선물에도 잘 어울리는 케어 컬렉션입니다.',
        ],
        href: '/shop?category=bath-body',
        image: 'bath-body.png',
        imageSide: 'right-half',
    },
};

const exploreItems = [
    { title: 'Diptyque History', image: 'explore-history.png', href: '/about/history', crop: 'history' },
    { title: 'Fragrances Story', image: 'explore-fragrances.png', href: '/about/fragrances-story', crop: 'fragrances' },
    { title: 'GALERIE', image: 'explore-galerie.png', href: '/galerie', crop: 'galerie' },
    { title: 'For The Planet', image: 'explore-planet.png', href: '/about/for-the-planet', crop: 'planet' },
];

const services = [
    { title: 'FREE SHIPPING', image: 'service-shipping.png', lines: ['13만원 이상 구매 시 무료 배송', '토 일 공휴일 제외 익일 발송'] },
    { title: 'GIFT WRAPPING', image: 'service-gift.png', lines: ['선물 포장 서비스를 제공합니다.'] },
    { title: 'FRAGRANCE SAMPLE', image: 'service-fragrance.png', lines: ['프레그런스 구매 시', '시향 샘플 증정'] },
    { title: 'CHOOSE YOUR SAMPLE', image: 'service-sample.png', lines: ['구매 시 원하는 샘플을', '선택할 수 있습니다.'] },
    { title: '14-DAY RETURNS', image: 'service-returns.png', lines: ['구매 후 14일 이내', '반품 가능합니다.'] },
    { title: 'BIRTHDAY SURPRISE', image: 'service-birthday.png', lines: ['회원 특전으로 생일에', '향기로운 서프라이즈를 제공'] },
];

export function ViewMoreLink({ to, label }) {
    return (
        <Link className="product-line__view-more" to={to} aria-label={`${label} 상품 보기`}>
            <span>{'View More '}</span>
            <img src={`${ASSET_PATH}/view-more-arrow.svg`} alt="" />
        </Link>
    );
}

function ProductLineStorySection({ story, className = '' }) {
    return (
        <section className={`product-line__story product-line__story--${story.imageSide} ${className}`.trim()}>
            <div className="product-line__story-canvas">
                <div className="product-line__story-image-wrap">
                    <img src={`${ASSET_PATH}/${story.image}`} alt="" />
                </div>
                <div className="product-line__story-copy">
                    <h2>{story.title}</h2>
                    <div className="product-line__story-details">
                        <p className="product-line__tagline">{story.tagline}</p>
                        <div className="product-line__body-copy">
                            {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                        <ViewMoreLink to={story.href} label={story.title} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProductLineVisual({ image, className = '' }) {
    return (
        <section className={`product-line__visual ${className}`.trim()} aria-hidden="true">
            <div className="product-line__visual-canvas">
                <img src={`${ASSET_PATH}/${image}`} alt="" />
            </div>
        </section>
    );
}

function ProductLineExclusive() {
    return (
        <section className="product-line__exclusive">
            <h2>Exclusive</h2>
            <p>자연이 간직한 숨은 아름다움에서 영감을 받아, 향과 디자인으로<br className="product-line__exclusive-break" />{' '}새롭게 풀어낸 특별한 향수 컬렉션입니다. 감각을 깨우고 깊은 감정을<br className="product-line__exclusive-break" />{' '}불러일으키는 창작을 만나보세요.</p>
            <ViewMoreLink to="/shop?category=exclusive" label="Exclusive" />
        </section>
    );
}

export function ProductLineExplore() {
    return (
        <section className="product-line__explore">
            <div className="product-line__wide-canvas">
                <h2>Explore the world of Diptyque</h2>
                <div className="product-line__explore-list">
                    {exploreItems.map((item) => (
                        <Link className="product-line__explore-card" to={item.href} key={item.title}>
                            <span className="product-line__explore-image">
                                <img className={`product-line__explore-crop--${item.crop}`} src={`${ASSET_PATH}/${item.image}`} alt="" />
                            </span>
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function GlassOverlay() {
    return <span className="product-line__back-glass" aria-hidden="true" />;
}

export function ProductLineBackMain() {
    const navigate = useNavigate();
    const interactiveRef = useRef(null);
    const doorRef = useRef(null);
    const shadowRef = useRef(null);
    const innerShadowRef = useRef(null);
    const labelRef = useRef(null);
    const lineRef = useRef(null);
    const isNavigatingRef = useRef(false);

    useLayoutEffect(() => {
        const context = gsap.context(() => {
            gsap.set(doorRef.current, {
                rotationY: 0,
                transformOrigin: 'right center',
                transformPerspective: 1200,
                filter: 'drop-shadow(0 0 0 rgba(34, 34, 34, 0))',
            });
            gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.22, scaleY: 0.5, skewX: 8, transformOrigin: 'right center', filter: 'blur(11px)' });
            gsap.set(innerShadowRef.current, { opacity: 0, scaleX: 0.35, transformOrigin: 'right center', filter: 'blur(8px)' });
            gsap.set(labelRef.current, { color: 'rgba(34, 34, 34, 0.6)', opacity: 1 });
            gsap.set(lineRef.current, { scaleX: 1, transformOrigin: 'left center' });
        }, interactiveRef);

        return () => context.revert();
    }, []);

    const openDoor = () => {
        if (isNavigatingRef.current) return;
        gsap.to(doorRef.current, { rotationY: -32, filter: 'drop-shadow(5px 5px 7px rgba(34, 34, 34, 0.2))', duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(shadowRef.current, { opacity: 0.36, scaleX: 1.12, scaleY: 1.08, skewX: 22, filter: 'blur(12px)', duration: 0.37, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(innerShadowRef.current, { opacity: 0.32, scaleX: 1, filter: 'blur(9px)', duration: 0.36, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(labelRef.current, { color: 'rgba(34, 34, 34, 0.88)', opacity: 0.96, duration: 0.34, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(lineRef.current, { scaleX: 1.06, duration: 0.34, ease: 'power3.out', overwrite: 'auto' });
    };

    const closeDoor = () => {
        if (isNavigatingRef.current) return;
        gsap.to(doorRef.current, { rotationY: 0, filter: 'drop-shadow(0 0 0 rgba(34, 34, 34, 0))', duration: 0.31, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(shadowRef.current, { opacity: 0, scaleX: 0.22, scaleY: 0.5, skewX: 8, filter: 'blur(11px)', duration: 0.29, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(innerShadowRef.current, { opacity: 0, scaleX: 0.35, filter: 'blur(8px)', duration: 0.29, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(labelRef.current, { color: 'rgba(34, 34, 34, 0.6)', opacity: 1, duration: 0.3, ease: 'power2.inOut', overwrite: 'auto' });
        gsap.to(lineRef.current, { scaleX: 1, duration: 0.3, ease: 'power2.inOut', overwrite: 'auto' });
    };

    const handleBackToMain = (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;
        const page = interactiveRef.current?.closest('main');
        const transitionOverlay = document.querySelector('.page-transition-overlay');
        gsap.killTweensOf([doorRef.current, shadowRef.current, innerShadowRef.current, labelRef.current, lineRef.current, page, transitionOverlay]);
        gsap.set(transitionOverlay, { opacity: 0 });

        const clickTimeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
        clickTimeline
            .to(doorRef.current, {
                rotationY: -38,
                filter: 'drop-shadow(6px 6px 9px rgba(34, 34, 34, 0.2))',
                duration: 0.68,
                ease: 'sine.inOut',
            }, 0)
            .to(shadowRef.current, { opacity: 0.38, scaleX: 1.2, scaleY: 1.1, skewX: 24, filter: 'blur(13px)', duration: 0.62, ease: 'power2.out' }, 0)
            .to(innerShadowRef.current, { opacity: 0.35, scaleX: 1.06, filter: 'blur(10px)', duration: 0.62, ease: 'power2.out' }, 0)
            .to(transitionOverlay, {
                opacity: 1,
                duration: 0.55,
                ease: 'sine.inOut',
            }, 0.15)
            .to(page, {
                opacity: 0.35,
                filter: 'blur(1.5px)',
                duration: 0.48,
                ease: 'sine.inOut',
            }, 0.2)
            .call(() => {
                navigate('/');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        gsap.to(transitionOverlay, {
                            opacity: 0,
                            duration: 0.8,
                            ease: 'sine.out',
                            overwrite: 'auto',
                        });
                    });
                });
            }, null, 0.7);
    };

    return (
        <section className="product-line__back-main">
            <div className="product-line__wide-canvas">
                <Link
                    ref={interactiveRef}
                    className="product-line__back-interactive"
                    to="/"
                    aria-label="Back To Main Page"
                    onMouseEnter={openDoor}
                    onMouseLeave={closeDoor}
                    onFocus={openDoor}
                    onBlur={closeDoor}
                    onClick={handleBackToMain}
                >
                    <span className="product-line__back-images" aria-hidden="true">
                        <img className="product-line__back-frame" src={`${ASSET_PATH}/back-main-outer.png`} alt="" />
                        <span ref={innerShadowRef} className="product-line__back-inner-shadow" />
                        <span ref={shadowRef} className="product-line__back-door-shadow" />
                        <span ref={doorRef} className="product-line__back-door">
                            <GlassOverlay />
                            <img className="product-line__back-door-art" src={`${ASSET_PATH}/back-main-inner.png`} alt="" />
                        </span>
                    </span>
                    <span ref={labelRef} className="product-line__back-link" aria-hidden="true">
                        <span className="product-line__back-link-text">Back To Main Page</span>
                        <span ref={lineRef} className="product-line__back-arrow">
                            <img src={`${ASSET_PATH}/back-arrow.svg`} alt="" />
                        </span>
                    </span>
                </Link>
            </div>
        </section>
    );
}

export function ProductLineServices() {
    return (
        <section className="product-line__services">
            <div className="product-line__wide-canvas">
                <h2>DIPTYQUE SERVICE</h2>
                <div className="product-line__service-list">
                    {services.map((service) => (
                        <article className="product-line__service" key={service.title}>
                            <img src={`${ASSET_PATH}/${service.image}`} alt="" />
                            <div>
                                <h3>{service.title}</h3>
                                {service.lines.map((line) => <p key={line}>{line}</p>)}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function ProductLine() {
    return (
        <main className="product-line-page" data-node-id="3285:18940">
            <ProductLineVisual image="fragrance-visual.png" />
            <ProductLineStorySection story={stories.fragrances} />
            <ProductLineVisual image="exclusive-visual.png" className="product-line__visual--exclusive" />
            <ProductLineExclusive />
            <ProductLineStorySection story={stories.candlesHome} />
            <ProductLineStorySection story={stories.bathBody} />
            <ProductLineStorySection story={stories.homeDecor} />
            <ProductLineExplore />
            <ProductLineBackMain />
            <ProductLineServices />
        </main>
    );
}
